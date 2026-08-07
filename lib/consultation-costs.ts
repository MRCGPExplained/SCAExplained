import type { SupabaseClient } from "@supabase/supabase-js";
import { getCurrentPricing } from "@/lib/pricing";

/**
 * Rebuilds the immutable consultation cost ledger row for one recording by
 * aggregating the per-provider usage rows already written for it. GBP totals
 * are snapshotted with the pricing version used, so later pricing changes
 * never alter this row. Preserves any GP-review snapshot already recorded.
 */
export async function buildConsultationLedger(admin: SupabaseClient, recordingId: string): Promise<void> {
  const pricing = await getCurrentPricing(admin);
  if (!pricing) {
    console.error("[costs] no current pricing_config — ledger not written for", recordingId);
    return;
  }

  const [claudeRes, dgRes, dailyRes, recRes, existingRes] = await Promise.all([
    admin.from("claude_usage").select("cost_gbp").eq("recording_id", recordingId).in("call_type", ["grading", "retry"]),
    admin.from("deepgram_usage").select("cost_gbp").eq("recording_id", recordingId),
    admin.from("daily_usage").select("cost_gbp, billing_mode, max_participants").eq("recording_id", recordingId).maybeSingle(),
    admin.from("station_recordings").select("doctor_user_id, started_at, ended_at").eq("id", recordingId).maybeSingle(),
    admin.from("consultation_costs").select("gp_reviewed, gp_reviewer_id, gp_cost_gbp").eq("recording_id", recordingId).maybeSingle(),
  ]);

  const claudeRows = (claudeRes.data ?? []) as { cost_gbp: string | number }[];
  const dgRows = (dgRes.data ?? []) as { cost_gbp: string | number }[];
  const dailyRow = dailyRes.data as { cost_gbp: string | number | null; billing_mode: string; max_participants: number } | null;
  const rec = recRes.data as { doctor_user_id: string | null; started_at: string | null; ended_at: string | null } | null;
  const existing = existingRes.data as { gp_reviewed: boolean; gp_reviewer_id: string | null; gp_cost_gbp: string | number } | null;

  const claudeCostGbp = claudeRows.reduce((s, r) => s + Number(r.cost_gbp), 0);
  const deepgramCostGbp = dgRows.reduce((s, r) => s + Number(r.cost_gbp), 0);
  const dailyCostGbp = dailyRow?.cost_gbp != null ? Number(dailyRow.cost_gbp) : null;
  const gpCostGbp = existing?.gp_cost_gbp != null ? Number(existing.gp_cost_gbp) : 0;

  const durationS =
    rec?.started_at && rec?.ended_at
      ? (new Date(rec.ended_at).getTime() - new Date(rec.started_at).getTime()) / 1000
      : null;

  const total = deepgramCostGbp + claudeCostGbp + (dailyCostGbp ?? 0) + gpCostGbp;

  const { error } = await admin.from("consultation_costs").upsert(
    {
      recording_id: recordingId,
      doctor_user_id: rec?.doctor_user_id ?? null,
      duration_s: durationS,
      participants: dailyRow?.max_participants ?? null,
      deepgram_cost_gbp: deepgramCostGbp,
      claude_cost_gbp: claudeCostGbp,
      daily_cost_gbp: dailyCostGbp,
      daily_billing_mode: dailyRow?.billing_mode ?? null,
      gp_reviewed: existing?.gp_reviewed ?? false,
      gp_reviewer_id: existing?.gp_reviewer_id ?? null,
      gp_cost_gbp: gpCostGbp,
      total_cost_gbp: total,
      pricing_version_id: pricing.id,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "recording_id" }
  );
  if (error) console.error("[costs] ledger upsert failed:", error.message);
}

/**
 * Snapshots the GP-review cost onto a consultation's ledger row at the moment
 * a GP actually reviews it, using the GP rate current then. Later rate changes
 * do not affect this snapshot. Recomputes the total from the existing provider
 * costs already on the row.
 */
export async function snapshotGpReview(admin: SupabaseClient, recordingId: string, examinerId: string): Promise<void> {
  const pricing = await getCurrentPricing(admin);
  if (!pricing) {
    console.error("[costs] no current pricing_config — GP cost not snapshotted for", recordingId);
    return;
  }

  const { data } = await admin
    .from("consultation_costs")
    .select("deepgram_cost_gbp, claude_cost_gbp, daily_cost_gbp")
    .eq("recording_id", recordingId)
    .maybeSingle();
  const existing = data as { deepgram_cost_gbp: string | number; claude_cost_gbp: string | number; daily_cost_gbp: string | number | null } | null;

  const base = existing
    ? Number(existing.deepgram_cost_gbp) + Number(existing.claude_cost_gbp) + (existing.daily_cost_gbp != null ? Number(existing.daily_cost_gbp) : 0)
    : 0;
  const gpCostGbp = pricing.gpReviewGbp;

  const { error } = await admin.from("consultation_costs").upsert(
    {
      recording_id: recordingId,
      gp_reviewed: true,
      gp_reviewer_id: examinerId,
      gp_cost_gbp: gpCostGbp,
      total_cost_gbp: base + gpCostGbp,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "recording_id" }
  );
  if (error) console.error("[costs] GP snapshot upsert failed:", error.message);
}
