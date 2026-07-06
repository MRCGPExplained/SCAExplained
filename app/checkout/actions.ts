"use server";

import { redirect } from "next/navigation";
import { getSupabaseAdmin } from "@/lib/supabase";
import { createSupabaseServerClient } from "@/lib/supabase-case-bank";

export interface PromoResult {
  valid: boolean;
  error?: string;
}

async function getPromoSettings(): Promise<Record<string, string>> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return {};
  const { data } = await supabase
    .from("settings")
    .select("key, value")
    .in("key", ["PROMO_CODE_VALUE", "PROMO_CODE_ACTIVE", "PROMO_CODE_EXPIRY", "PROMO_CODE_MAX_USES", "PROMO_CODE_USES"]);
  return Object.fromEntries((data ?? []).map((r: { key: string; value: string }) => [r.key, r.value]));
}

export async function validatePromoCodeAction(code: string): Promise<PromoResult> {
  const supabaseUser = await createSupabaseServerClient();
  const { data: { user } } = await supabaseUser.auth.getUser();
  if (!user) return { valid: false, error: "Not authenticated." };

  const { data: access } = await supabaseUser
    .from("user_access")
    .select("has_programme, expires_at")
    .eq("user_id", user.id)
    .maybeSingle();
  const hasAccess = !!(access?.has_programme && access.expires_at && new Date(access.expires_at) > new Date());
  if (hasAccess) return { valid: false, error: "You already have active access to The Complete SCA Package." };

  const settings = await getPromoSettings();

  if (!settings.PROMO_CODE_VALUE || code.trim().toLowerCase() !== settings.PROMO_CODE_VALUE.toLowerCase()) {
    return { valid: false, error: "That code isn't valid. Please check and try again." };
  }
  if (settings.PROMO_CODE_ACTIVE !== "true") {
    return { valid: false, error: "That code isn't valid. Please check and try again." };
  }
  if (settings.PROMO_CODE_EXPIRY && new Date() > new Date(settings.PROMO_CODE_EXPIRY)) {
    return { valid: false, error: "That code has expired." };
  }
  const uses = parseInt(settings.PROMO_CODE_USES ?? "0", 10);
  const maxUses = parseInt(settings.PROMO_CODE_MAX_USES ?? "0", 10);
  if (uses >= maxUses) {
    return { valid: false, error: "That code has reached its maximum uses." };
  }

  return { valid: true };
}

export async function claimPromoAccessAction(code: string): Promise<{ error?: string }> {
  const supabaseUser = await createSupabaseServerClient();
  const { data: { user } } = await supabaseUser.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  // Re-validate before granting
  const check = await validatePromoCodeAction(code);
  if (!check.valid) return { error: check.error };

  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Database not available." };

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 90);

  const { error: accessError } = await supabase.from("user_access").upsert({
    user_id: user.id,
    has_programme: true,
    expires_at: expiresAt.toISOString(),
    renewal_reminder_sent_at: null,
  });
  if (accessError) return { error: accessError.message };

  // Increment uses
  const settings = await getPromoSettings();
  const newUses = parseInt(settings.PROMO_CODE_USES ?? "0", 10) + 1;
  await supabase.from("settings").upsert({ key: "PROMO_CODE_USES", value: String(newUses) }, { onConflict: "key" });

  redirect("/confirmation?type=promo");
}
