import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      }
    );
    await supabase.auth.exchangeCodeForSession(code);

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: beta } = await supabase
        .from("beta_users")
        .select("id, user_id")
        .eq("email", user.email ?? "")
        .maybeSingle();

      // Backfill user_id and grant access on first confirmation
      if (beta) {
        if (!beta.user_id) {
          await supabase
            .from("beta_users")
            .update({ user_id: user.id })
            .eq("id", beta.id);
        }

        // Grant 1 year of access if not already granted
        const oneYearFromNow = new Date();
        oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
        await supabase
          .from("user_access")
          .upsert(
            { user_id: user.id, expires_at: oneYearFromNow.toISOString() },
            { onConflict: "user_id" }
          );
      }

      const destination = beta ? "beta" : "standard";
      return NextResponse.redirect(`${origin}/auth/confirmed?access=${destination}`);
    }
  }

  return NextResponse.redirect(`${origin}/auth/confirmed?access=standard`);
}
