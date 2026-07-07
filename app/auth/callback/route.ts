import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type");

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );

  // Handle both PKCE (code) and OTP (token_hash) flows
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) console.error("[callback] exchangeCodeForSession failed:", error.message);
  } else if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type: type as "signup" | "email" });
    if (error) console.error("[callback] verifyOtp failed:", error.message);
  } else {
    return NextResponse.redirect(`${origin}/login`);
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(`${origin}/login`);

  const { data: beta } = await supabase
    .from("beta_users")
    .select("id, user_id")
    .eq("email", user.email ?? "")
    .maybeSingle();

  if (beta) {
    // Backfill user_id
    if (!beta.user_id) {
      await supabase.from("beta_users").update({ user_id: user.id }).eq("id", beta.id);
    }

    // Grant 1 year access via admin client (bypasses RLS)
    const admin = getSupabaseAdmin();
    if (admin) {
      const oneYearFromNow = new Date();
      oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
      await admin.from("user_access").upsert(
        { user_id: user.id, has_programme: true, expires_at: oneYearFromNow.toISOString() },
        { onConflict: "user_id" }
      );
    }

    return NextResponse.redirect(`${origin}/auth/confirmed`);
  }

  return NextResponse.redirect(`${origin}/login`);
}
