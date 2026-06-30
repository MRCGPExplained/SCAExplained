import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

async function sha256hex(text: string): Promise<string> {
  const buf = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(text)
  );
  return Array.from(new Uint8Array(buf), (b) =>
    b.toString(16).padStart(2, "0")
  ).join("");
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname === "/admin/login") return NextResponse.next();

  const session = req.cookies.get("admin_session")?.value ?? "";
  const pw = process.env.ADMIN_PASSWORD ?? "";

  if (pw) {
    const expected = await sha256hex(pw);
    if (session === expected) return NextResponse.next();
  } else if (process.env.NODE_ENV !== "production") {
    // No password set in dev — let through so you can build without configuring it
    return NextResponse.next();
  }

  const url = req.nextUrl.clone();
  url.pathname = "/admin/login";
  url.searchParams.set("next", pathname);
  return NextResponse.redirect(url);
}

export const config = { matcher: "/admin/:path*" };
