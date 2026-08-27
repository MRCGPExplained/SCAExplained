import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

async function sha256hex(text: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");
}

const CASE_BANK_PUBLIC = ["/case-bank/login", "/case-bank/register", "/case-bank/purchase", "/case-bank/sample"];
const VIDEO_COURSE_PUBLIC = ["/video-course/purchase"];
const BUNDLE_PUBLIC = ["/bundle/purchase"];

const GUEST_SESSION_MAX_AGE_MS = 24 * 60 * 60 * 1000;

/**
 * This middleware makes no network calls, deliberately.
 *
 * It previously called supabase.auth.getUser() on every matched request. In
 * Vercel's Edge runtime that call never settles — Supabase answers 200 in
 * about 60ms but the promise hangs — so it first took the whole site down with
 * MIDDLEWARE_INVOCATION_TIMEOUT, and then, once bounded by a timeout, added
 * that timeout to the latency of every page load, prefetch and server action.
 *
 * It does not need to make that call. Every protected area verifies the
 * session itself on the Node runtime: the case-bank pages, the examiner
 * portal, and now app/admin/layout.tsx. Middleware's job is only the cheap
 * pre-filter — send someone with no session at all to the login page instead
 * of rendering a page that would immediately redirect them.
 *
 * A present-but-invalid cookie therefore passes this filter and is rejected by
 * the page a moment later, which is the same outcome one hop later.
 */

/** Supabase SSR stores the session in `sb-<ref>-auth-token` (possibly chunked). */
function isAuthCookie(name: string): boolean {
  return name.startsWith("sb-") && name.includes("auth-token");
}

function hasAuthCookie(req: NextRequest): boolean {
  return req.cookies.getAll().some((c) => isAuthCookie(c.name));
}

function base64UrlDecode(value: string): string {
  const b64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (ch) => ch.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

interface CookieSessionUser {
  is_anonymous?: boolean;
  created_at?: string;
}

/**
 * Reads the session the auth cookie already carries, with no network call.
 *
 * Used only to expire guest sessions, which can safely be decided from
 * unverified data: the decision only ever *removes* access, and anything a
 * forged cookie might claim is re-checked by the page it reaches.
 *
 * Chunked cookies are re-joined in index order, and a `base64-` prefix marks a
 * base64url payload. Any malformed input returns null and simply leaves the
 * session alone.
 */
function readCookieSessionUser(req: NextRequest): CookieSessionUser | null {
  const parts = req.cookies
    .getAll()
    .filter((c) => isAuthCookie(c.name))
    .map((c) => {
      const chunk = c.name.match(/^(.*)\.(\d+)$/);
      return { order: chunk ? parseInt(chunk[2], 10) : 0, value: c.value };
    })
    .sort((a, b) => a.order - b.order);

  if (parts.length === 0) return null;

  try {
    let raw = parts.map((p) => p.value).join("");
    if (raw.startsWith("base64-")) raw = base64UrlDecode(raw.slice("base64-".length));
    const session = JSON.parse(raw) as { user?: CookieSessionUser };
    return session?.user ?? null;
  } catch {
    return null;
  }
}

/** True once an anonymous guest session is past its 24-hour pass. */
function isExpiredGuest(req: NextRequest): boolean {
  const user = readCookieSessionUser(req);
  if (!user?.is_anonymous || !user.created_at) return false;
  const created = new Date(user.created_at).getTime();
  if (Number.isNaN(created)) return false;
  return Date.now() - created > GUEST_SESSION_MAX_AGE_MS;
}

/** Clears the Supabase auth cookies on the given response. */
function clearAuthCookies(req: NextRequest, res: NextResponse): NextResponse {
  req.cookies.getAll().forEach((c) => {
    if (isAuthCookie(c.name)) res.cookies.set(c.name, "", { maxAge: 0, path: "/" });
  });
  return res;
}

function redirectToLogin(req: NextRequest, loginPath: string): NextResponse {
  const url = req.nextUrl.clone();
  url.pathname = loginPath;
  url.searchParams.set("next", req.nextUrl.pathname);
  return NextResponse.redirect(url);
}

/**
 * Lets the request through when a session cookie is present, and redirects to
 * the login page when there is none. The page behind it does the real check.
 */
function sessionPreFilter(req: NextRequest, loginPath: string): NextResponse {
  if (isExpiredGuest(req)) {
    return clearAuthCookies(req, redirectToLogin(req, loginPath));
  }
  if (!hasAuthCookie(req)) return redirectToLogin(req, loginPath);
  return NextResponse.next({ request: req });
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ── Admin ─────────────────────────────────────────────────────────────────
  // app/admin/layout.tsx is the authoritative gate. Here we only bounce
  // visitors with no session at all.
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") return NextResponse.next();

    // /master fail-safe passcode — independent of Supabase auth entirely.
    const masterSession = req.cookies.get("master_session")?.value ?? "";
    const pw = process.env.ADMIN_PASSWORD ?? "";
    if (pw) {
      if (masterSession === (await sha256hex(pw))) return NextResponse.next();
    } else if (process.env.NODE_ENV !== "production") {
      return NextResponse.next();
    }

    if (!hasAuthCookie(req)) return redirectToLogin(req, "/admin/login");
    return NextResponse.next({ request: req });
  }

  // ── Case bank ─────────────────────────────────────────────────────────────
  if (pathname.startsWith("/case-bank")) {
    const isPublic = CASE_BANK_PUBLIC.some((p) => pathname === p || pathname.startsWith(p + "/"));
    if (isPublic) return NextResponse.next();
    return sessionPreFilter(req, "/login");
  }

  // ── Video course ──────────────────────────────────────────────────────────
  if (pathname.startsWith("/video-course")) {
    const isPublic = VIDEO_COURSE_PUBLIC.some((p) => pathname === p || pathname.startsWith(p + "/"));
    if (isPublic) return NextResponse.next();
    return sessionPreFilter(req, "/login");
  }

  // ── Bundle ────────────────────────────────────────────────────────────────
  if (pathname.startsWith("/bundle")) {
    const isPublic = BUNDLE_PUBLIC.some((p) => pathname === p || pathname.startsWith(p + "/"));
    if (isPublic) return NextResponse.next();
    return sessionPreFilter(req, "/login");
  }

  // ── Dashboard ─────────────────────────────────────────────────────────────
  if (pathname === "/dashboard" || pathname.startsWith("/dashboard/")) {
    return sessionPreFilter(req, "/login");
  }

  // ── Recordings ────────────────────────────────────────────────────────────
  if (pathname === "/recordings" || pathname.startsWith("/recordings/")) {
    if (pathname === "/recordings/sample") return NextResponse.next();
    return sessionPreFilter(req, "/login");
  }

  // ── Examiner ──────────────────────────────────────────────────────────────
  // Just requires a session; the page itself checks whether that account's
  // email is on the examiners list and shows "not authorised" if not.
  if (pathname === "/examiner" || pathname.startsWith("/examiner/")) {
    return sessionPreFilter(req, "/login");
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
