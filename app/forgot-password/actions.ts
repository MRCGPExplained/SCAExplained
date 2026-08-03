"use server";

import { createSupabaseServerClient } from "@/lib/supabase-case-bank";

export async function requestPasswordResetAction(
  _prev: { error: string; success?: never } | { success: boolean; error?: never },
  formData: FormData
) {
  const email = String(formData.get("email") ?? "").trim();
  if (!email) return { error: "Email is required." };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?type=recovery`,
  });

  if (error) return { error: error.message };
  return { success: true };
}
