"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseAdmin } from "@/lib/supabase";

export interface ActionResult {
  error?: string;
  success?: boolean;
}

/**
 * Saves a new pricing version. Never mutates existing rows — inserts a fresh
 * version and marks the previous ones not-current — so historical consultation
 * costs (which snapshot their pricing_version_id) are unaffected.
 */
export async function updatePricingAction(
  _prev: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  const admin = getSupabaseAdmin();
  if (!admin) return { error: "Database not available." };

  const num = (key: string) => Number(String(formData.get(key) ?? "").trim());
  const fields = {
    claude_input_usd_per_mtok: num("claude_input_usd_per_mtok"),
    claude_output_usd_per_mtok: num("claude_output_usd_per_mtok"),
    claude_cache_write_usd_per_mtok: num("claude_cache_write_usd_per_mtok"),
    claude_cache_read_usd_per_mtok: num("claude_cache_read_usd_per_mtok"),
    deepgram_usd_per_min: num("deepgram_usd_per_min"),
    daily_audio_usd_per_min: num("daily_audio_usd_per_min"),
    daily_video_usd_per_min: num("daily_video_usd_per_min"),
    daily_free_minutes_per_month: num("daily_free_minutes_per_month"),
    gp_review_gbp: num("gp_review_gbp"),
    stripe_percent: num("stripe_percent"),
    stripe_fixed_gbp: num("stripe_fixed_gbp"),
    usd_to_gbp: num("usd_to_gbp"),
  };

  for (const [k, v] of Object.entries(fields)) {
    if (!Number.isFinite(v) || v < 0) return { error: `Invalid value for ${k}.` };
  }

  // Retire the previous current version, then insert the new current one.
  await admin.from("pricing_config").update({ is_current: false }).eq("is_current", true);
  const { error } = await admin.from("pricing_config").insert({ ...fields, is_current: true });
  if (error) return { error: error.message };

  revalidatePath("/admin/economics");
  return { success: true };
}
