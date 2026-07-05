"use server";

import { createSupabaseServerClient } from "@/lib/supabase-case-bank";

export async function changePasswordAction(newPassword: string): Promise<{ error?: string; success?: boolean }> {
  if (newPassword.length < 8) return { error: "Password must be at least 8 characters." };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.updateUser({ password: newPassword });

  if (error) return { error: error.message };
  return { success: true };
}
