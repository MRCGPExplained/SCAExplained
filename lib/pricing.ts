import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Versioned provider pricing. Every consultation's cost is computed from the
 * pricing version current at the moment it was calculated, and that computed
 * cost is snapshotted into the ledger — so editing pricing later (which inserts
 * a NEW version) never changes historical costs.
 *
 * All rates are stored as strings by PostgREST (numeric type), so the loader
 * coerces everything to numbers.
 */
export interface Pricing {
  id: string;
  claudeInputUsdPerMTok: number;
  claudeOutputUsdPerMTok: number;
  claudeCacheWriteUsdPerMTok: number;
  claudeCacheReadUsdPerMTok: number;
  deepgramUsdPerMin: number;
  dailyAudioUsdPerMin: number;
  dailyVideoUsdPerMin: number;
  dailyFreeMinutesPerMonth: number;
  gpReviewGbp: number;
  stripePercent: number;
  stripeFixedGbp: number;
  usdToGbp: number;
}

type PricingRow = {
  id: string;
  claude_input_usd_per_mtok: string | number;
  claude_output_usd_per_mtok: string | number;
  claude_cache_write_usd_per_mtok: string | number;
  claude_cache_read_usd_per_mtok: string | number;
  deepgram_usd_per_min: string | number;
  daily_audio_usd_per_min: string | number;
  daily_video_usd_per_min: string | number;
  daily_free_minutes_per_month: number;
  gp_review_gbp: string | number;
  stripe_percent: string | number;
  stripe_fixed_gbp: string | number;
  usd_to_gbp: string | number;
};

function mapPricing(r: PricingRow): Pricing {
  return {
    id: r.id,
    claudeInputUsdPerMTok: Number(r.claude_input_usd_per_mtok),
    claudeOutputUsdPerMTok: Number(r.claude_output_usd_per_mtok),
    claudeCacheWriteUsdPerMTok: Number(r.claude_cache_write_usd_per_mtok),
    claudeCacheReadUsdPerMTok: Number(r.claude_cache_read_usd_per_mtok),
    deepgramUsdPerMin: Number(r.deepgram_usd_per_min),
    dailyAudioUsdPerMin: Number(r.daily_audio_usd_per_min),
    dailyVideoUsdPerMin: Number(r.daily_video_usd_per_min),
    dailyFreeMinutesPerMonth: Number(r.daily_free_minutes_per_month),
    gpReviewGbp: Number(r.gp_review_gbp),
    stripePercent: Number(r.stripe_percent),
    stripeFixedGbp: Number(r.stripe_fixed_gbp),
    usdToGbp: Number(r.usd_to_gbp),
  };
}

/** The pricing version to use for any new cost calculation. */
export async function getCurrentPricing(admin: SupabaseClient): Promise<Pricing | null> {
  const { data } = await admin
    .from("pricing_config")
    .select("*")
    .eq("is_current", true)
    .order("effective_from", { ascending: false })
    .limit(1)
    .maybeSingle<PricingRow>();
  return data ? mapPricing(data) : null;
}

export interface ClaudeTokens {
  input_tokens: number;
  output_tokens: number;
  cache_creation_tokens: number;
  cache_read_tokens: number;
}

export function claudeCostUsd(t: ClaudeTokens, p: Pricing): number {
  return (
    (t.input_tokens * p.claudeInputUsdPerMTok +
      t.output_tokens * p.claudeOutputUsdPerMTok +
      t.cache_creation_tokens * p.claudeCacheWriteUsdPerMTok +
      t.cache_read_tokens * p.claudeCacheReadUsdPerMTok) /
    1_000_000
  );
}

/** Deepgram bills per minute of audio, rounded up to whole minutes per request. */
export function deepgramBillableMinutes(audioDurationSeconds: number): number {
  return Math.ceil(Math.max(0, audioDurationSeconds) / 60);
}

export function deepgramCostUsd(billableMinutes: number, p: Pricing): number {
  return billableMinutes * p.deepgramUsdPerMin;
}

export type DailyBillingMode = "audio" | "video" | "unknown";

/** Per-consultation Daily cost at full rate (the monthly free allowance is
 * applied at the aggregate/dashboard level, not per consultation). Returns
 * null when the billing mode is unknown so we never estimate. */
export function dailyCostUsd(participantMinutes: number, mode: DailyBillingMode, p: Pricing): number | null {
  if (mode === "unknown") return null;
  const rate = mode === "audio" ? p.dailyAudioUsdPerMin : p.dailyVideoUsdPerMin;
  return participantMinutes * rate;
}

export function usdToGbp(usd: number, p: Pricing): number {
  return usd * p.usdToGbp;
}
