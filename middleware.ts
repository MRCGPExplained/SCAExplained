import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

async function sha256hex(text: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");
}

const CASE_BANK_PUBLIC = ["/case-bank/login", "/case-bank/register", "/case-bank/purchase"];
const VIDEO_COURSE_PUBLIC = ["/video-course/purchase"];
const BUNDLE_PUBLIC = ["/bundle/purchase"];

async function supabaseAuthCheck(req: NextRequest, loginPath: string): Promise<NextResponse> {
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

  if (!user) {
    const url = req.nextUrl.clone();
    url.pathname = loginPath;
    url.searchParams.set("next", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ── Admin auth ────────────────────────────────────────────────────────────
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") return NextResponse.next();
    const session = req.cookies.get("admin_session")?.value ?? "";
    const pw = process.env.ADMIN_PASSWORD ?? "";
    if (pw) {
      const expected = await sha256hex(pw);
      if (session === expected) return NextResponse.next();
    } else if (process.env.NODE_ENV !== "production") {
      return NextResponse.next();
    }
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
  ],
};
