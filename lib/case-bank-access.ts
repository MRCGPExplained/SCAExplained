import type { SupabaseClient } from "@supabase/supabase-js";

export const AI_USE_SOFT_CAP = 500;

export interface CaseBankAccess {
  hasAccess: boolean;
  expiresAt: string | null;
  aiUsesCount: number;
}

/** Reads the current user's Case Bank programme access. Uses the caller's
 * own Supabase client (RLS-scoped), so it only ever sees the caller's own row. */
export async function getCaseBankAccess(supabase: SupabaseClient, userId: string): Promise<CaseBankAccess> {
  const { data } = await supabase
    .from("user_access")
    .select("has_case_bank, case_bank_expires_at, ai_uses_count")
    .eq("user_id", userId)
    .single<{ has_case_bank: boolean; case_bank_expires_at: string | null; ai_uses_count: number }>();

  const hasAccess = !!data?.has_case_bank && !!data.case_bank_expires_at && data.case_bank_expires_at > new Date().toISOString();

  return {
    hasAccess,
    expiresAt: data?.case_bank_expires_at ?? null,
    aiUsesCount: data?.ai_uses_count ?? 0,
  };
}
