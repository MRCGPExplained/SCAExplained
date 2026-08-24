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

// Reads the current Supabase-authenticated user (if any) and returns the
// response carrying any refreshed session cookies, so callers can either
// `return` it directly (auth passed) or inspect `user` before redirecting.
async function getSupabaseUser(req: NextRequest): Promise<{ user: { email?: string } | null; response: NextResponse }> {
  let supabaseResponse = NextResponse.next({ request: req });

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

  const { data: { user } } = await supabase.auth.getUser();
  return { user, response: supabaseResponse };
}

async function supabaseAuthCheck(req: NextRequest, loginPath: string): Promise<NextResponse> {
  const { user, response } = await getSupabaseUser(req);

  if (!user) {
    const url = req.nextUrl.clone();
    url.pathname = loginPath;
    url.searchParams.set("next", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return response;
}

// Looks up whether an email is a registered admin (examiners.is_admin = true).
// Uses a direct REST call since middleware runs on the Edge runtime.
async function isAdminEmail(email: string): Promise<boolean> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) return false;

  try {
    const res = await fetch(
      `${supabaseUrl}/rest/v1/examiners?select=id&is_admin=eq.true&email=ilike.${encodeURIComponent(email)}`,
      { headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` }, cache: "no-store" }
    );
    if (!res.ok) return false;
    const rows = (await res.json()) as unknown[];
    return Array.isArray(rows) && rows.length > 0;
  } catch {
    return false; // Fail closed
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
    const { user, response } = await getSupabaseUser(req);
    if (user?.email && (await isAdminEmail(user.email))) return response;

    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
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
