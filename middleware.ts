import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

async function sha256hex(text: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");
}

const CASE_BANK_PUBLIC = ["/case-bank/login", "/case-bank/register", "/case-bank/purchase", "/case-bank/sample"];
const VIDEO_COURSE_PUBLIC = ["/video-course/purchase"];
const BUNDLE_PUBLIC = ["/bundle/purchase"];

const GUEST_SESSION_MAX_AGE_MS = 24 * 60 * 60 * 1000;

// This middleware runs on every matched request — page loads, link prefetches,
// and every server action POST — so a single stalled Supabase call here takes
// the entire site down with a 504 (MIDDLEWARE_INVOCATION_TIMEOUT), not just one
// page. Every network call below is therefore bounded by an explicit timeout.
// Generous enough that only a genuine stall trips them, still far below the
// ~25s ceiling at which Vercel kills the middleware and 504s the whole site.
// 3s was too tight: an admin page prefetches its whole nav, so one visit fires
// a burst of middleware invocations doing two network calls each, and the
// slowest of those tripped the timeout — which on /admin means failing closed
// and bouncing a real admin to the login page.
const AUTH_TIMEOUT_MS = 8000;
const ADMIN_LOOKUP_TIMEOUT_MS = 8000;

/**
 * Admin status by email, cached in the Edge instance for a short window.
 *
 * Without this, every prefetch in the admin nav re-queries PostgREST for the
 * same answer. Revoking an admin takes up to TTL to take effect, which is an
 * acceptable trade for not hammering the API on every hover.
 */
const ADMIN_CACHE_TTL_MS = 60_000;
const adminCache = new Map<string, { isAdmin: boolean; at: number }>();

type SessionUser = { email?: string; is_anonymous?: boolean; created_at?: string };
type AuthOutcome = { ok: true; user: SessionUser | null } | { ok: false };

interface AuthLookup {
  user: SessionUser | null;
  response: NextResponse;
  /** The auth lookup stalled or errored — the caller decides fail-open vs fail-closed. */
  degraded: boolean;
}

/** Supabase SSR stores the session in `sb-<ref>-auth-token` (possibly chunked). */
function isAuthCookie(name: string): boolean {
  return name.startsWith("sb-") && name.includes("auth-token");
}

/** Copies cookies set on `from` onto `to` — a freshly built redirect would drop them. */
function carryCookies(from: NextResponse, to: NextResponse): NextResponse {
  from.cookies.getAll().forEach((c) => to.cookies.set(c));
  return to;
}

// Reads the current Supabase-authenticated user (if any) and returns the
// response carrying any refreshed session cookies, so callers can either
// `return` it directly (auth passed) or inspect `user` before redirecting.
async function getSupabaseUser(req: NextRequest): Promise<AuthLookup> {
  let supabaseResponse = NextResponse.next({ request: req });

  // No Supabase cookie at all means there is definitely no session, so skip
  // the network round-trip entirely — this covers logged-out traffic and the
  // prefetches that come with it.
  if (!req.cookies.getAll().some((c) => isAuthCookie(c.name))) {
    return { user: null, response: supabaseResponse, degraded: false };
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return req.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request: req });
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options));
        },
      },
    }
  );

  const outcome: AuthOutcome = await Promise.race([
    supabase.auth
      .getUser()
      .then(({ data }): AuthOutcome => ({ ok: true, user: data.user as SessionUser | null }))
      .catch((): AuthOutcome => ({ ok: false })),
    new Promise<AuthOutcome>((resolve) => setTimeout(() => resolve({ ok: false }), AUTH_TIMEOUT_MS)),
  ]);

  if (!outcome.ok) return { user: null, response: supabaseResponse, degraded: true };

  // Guest (anonymous) sessions are a 24-hour pass, not a real account — past
  // that, expire them so they land back on the room's login-or-guest choice
  // instead of staying in indefinitely. The cookies are cleared directly
  // rather than via signOut(): that would be a second unbounded network call
  // on the hot path, and its cookie clearing was being silently dropped by the
  // redirect below anyway, so expired guests never actually got signed out.
  const user = outcome.user;
  if (user?.is_anonymous && user.created_at) {
    const ageMs = Date.now() - new Date(user.created_at).getTime();
    if (ageMs > GUEST_SESSION_MAX_AGE_MS) {
      const cleared = NextResponse.next({ request: req });
      req.cookies.getAll().forEach((c) => {
        if (isAuthCookie(c.name)) cleared.cookies.set(c.name, "", { maxAge: 0, path: "/" });
      });
      return { user: null, response: cleared, degraded: false };
    }
  }

  return { user, response: supabaseResponse, degraded: false };
}

async function supabaseAuthCheck(req: NextRequest, loginPath: string): Promise<NextResponse> {
  const { user, response, degraded } = await getSupabaseUser(req);

  // Auth lookup stalled — let the request through instead of hanging until
  // Vercel kills the middleware and serves a 504 for the whole site. Every
  // page behind this check re-verifies the session server-side and redirects
  // on its own, so this check is a fast pre-filter, not the only gate.
  // (/admin is the exception — it has no page-level check, so it fails closed.)
  if (degraded) return NextResponse.next({ request: req });

  if (!user) {
    const url = req.nextUrl.clone();
    url.pathname = loginPath;
    url.searchParams.set("next", req.nextUrl.pathname);
    return carryCookies(response, NextResponse.redirect(url));
  }

  return response;
}

// Looks up whether an email is a registered admin (examiners.is_admin = true).
// Uses a direct REST call since middleware runs on the Edge runtime.
async function isAdminEmail(email: string): Promise<boolean> {
  const key = email.toLowerCase();
  const hit = adminCache.get(key);
  if (hit && Date.now() - hit.at < ADMIN_CACHE_TTL_MS) return hit.isAdmin;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) return false;

  try {
    const res = await fetch(
      `${supabaseUrl}/rest/v1/examiners?select=id&is_admin=eq.true&email=ilike.${encodeURIComponent(email)}`,
      {
        headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` },
        cache: "no-store",
        signal: AbortSignal.timeout(ADMIN_LOOKUP_TIMEOUT_MS),
      }
    );
    if (!res.ok) {
      console.error("[middleware] admin lookup failed", res.status);
      return hit?.isAdmin ?? false;
    }
    const rows = (await res.json()) as unknown[];
    const isAdminNow = Array.isArray(rows) && rows.length > 0;
    adminCache.set(key, { isAdmin: isAdminNow, at: Date.now() });
    return isAdminNow;
  } catch (err) {
    // Fail closed, but prefer a recently-confirmed answer over bouncing a real
    // admin because one lookup stalled. Logged because a silent catch here is
    // indistinguishable from "you are not an admin".
    console.error("[middleware] admin lookup error", err instanceof Error ? err.message : err);
    return hit?.isAdmin ?? false;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ── Admin auth ────────────────────────────────────────────────────────────
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") return NextResponse.next();

    // 1. /master fail-safe passcode — independent of Supabase auth entirely.
    const masterSession = req.cookies.get("master_session")?.value ?? "";
    const pw = process.env.ADMIN_PASSWORD ?? "";
    if (pw) {
      if (masterSession === (await sha256hex(pw))) return NextResponse.next();
    } else if (process.env.NODE_ENV !== "production") {
      return NextResponse.next();
    }

    // 2. Normal path — logged in with an email on the admin list.
    // Unlike the other protected areas, no admin page re-checks auth itself,
    // so this is the only gate and a degraded lookup must fail closed.
    const { user, response, degraded } = await getSupabaseUser(req);
    if (!degraded && user?.email && (await isAdminEmail(user.email))) return response;

    // Denials here are otherwise indistinguishable from "not an admin" — which
    // is exactly how a stalled lookup came to look like a permissions problem.
    console.error("[middleware] admin denied", {
      path: pathname,
      degraded,
      hasEmail: !!user?.email,
    });

    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("next", pathname);
    return carryCookies(response, NextResponse.redirect(url));
  }

  // ── Case bank ─────────────────────────────────────────────────────────────
  if (pathname.startsWith("/case-bank")) {
    const isPublic = CASE_BANK_PUBLIC.some((p) => pathname === p || pathname.startsWith(p + "/"));
    if (isPublic) return NextResponse.next();
    return supabaseAuthCheck(req, "/login");
  }

  // ── Video course ──────────────────────────────────────────────────────────
  if (pathname.startsWith("/video-course")) {
    const isPublic = VIDEO_COURSE_PUBLIC.some((p) => pathname === p || pathname.startsWith(p + "/"));
    if (isPublic) return NextResponse.next();
    return supabaseAuthCheck(req, "/login");
  }

  // ── Bundle ────────────────────────────────────────────────────────────────
  if (pathname.startsWith("/bundle")) {
    const isPublic = BUNDLE_PUBLIC.some((p) => pathname === p || pathname.startsWith(p + "/"));
    if (isPublic) return NextResponse.next();
    return supabaseAuthCheck(req, "/login");
  }

  // ── Dashboard ─────────────────────────────────────────────────────────────
  if (pathname === "/dashboard" || pathname.startsWith("/dashboard/")) {
    return supabaseAuthCheck(req, "/login");
  }

  // ── Recordings ────────────────────────────────────────────────────────────
  if (pathname === "/recordings" || pathname.startsWith("/recordings/")) {
    if (pathname === "/recordings/sample") return NextResponse.next();
    return supabaseAuthCheck(req, "/login");
  }

  // ── Examiner ──────────────────────────────────────────────────────────────
  // Just requires a logged-in account; the page itself checks whether that
  // account's email is on the examiners list and shows "not authorised" if not.
  if (pathname === "/examiner" || pathname.startsWith("/examiner/")) {
    return supabaseAuthCheck(req, "/login");
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/case-bank/:path*",
    "/video-course/:path*",
    "/bundle/:path*",
    "/dashboard",
    "/dashboard/:path*",
    "/recordings",
    "/recordings/:path*",
    "/examiner",
    "/examiner/:path*",
  ],
};
