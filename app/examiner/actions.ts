"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-case-bank";
import { getExaminer } from "@/lib/examiner-auth";
import { getSupabaseAdmin } from "@/lib/supabase";
import { sendExaminerReportEmail } from "@/lib/email";
import { getCurrentPricing, claudeCostUsd, usdToGbp } from "@/lib/pricing";
import { snapshotGpReview } from "@/lib/consultation-costs";

const EXAMINER_CLAUDE_MODEL = "claude-haiku-4-5-20251001";

// Records the token usage + cost of an examiner-initiated Claude call.
// Best-effort: never blocks the examiner's action.
async function recordExaminerClaudeUsage(
  callType: "overall_comment" | "grammar_check",
  model: string,
  usage: {
    input_tokens?: number;
    output_tokens?: number;
    cache_creation_input_tokens?: number;
    cache_read_input_tokens?: number;
  },
  recordingId?: string
): Promise<void> {
  try {
    const admin = getSupabaseAdmin();
    if (!admin) return;
    const pricing = await getCurrentPricing(admin);
    if (!pricing) return;
    const tokens = {
      input_tokens: usage.input_tokens ?? 0,
      output_tokens: usage.output_tokens ?? 0,
      cache_creation_tokens: usage.cache_creation_input_tokens ?? 0,
      cache_read_tokens: usage.cache_read_input_tokens ?? 0,
    };
    const costUsd = claudeCostUsd(tokens, pricing);
    await admin.from("claude_usage").insert({
      recording_id: recordingId ?? null,
      call_type: callType,
      model,
      input_tokens: tokens.input_tokens,
      output_tokens: tokens.output_tokens,
      cache_creation_tokens: tokens.cache_creation_tokens,
      cache_read_tokens: tokens.cache_read_tokens,
      cost_usd: costUsd,
      cost_gbp: usdToGbp(costUsd, pricing),
      pricing_version_id: pricing.id,
    });
  } catch (e) {
    console.error("[examiner] failed to record Claude usage:", e);
  }
}

export async function generateOverallCommentAction(args: {
  dgGrade: string; dgComment: string;
  cmGrade: string; cmComment: string;
  roGrade: string; roComment: string;
  stationTitle: string;
  recordingId?: string;
}): Promise<{ text?: string; error?: string }> {
  const examiner = await getExaminer();
  if (!examiner) return { error: "Not authorised." };

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": process.env.ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: EXAMINER_CLAUDE_MODEL,
      max_tokens: 300,
      system: "You are an RCGP examiner writing a brief overall comment to a GP registrar after their SCA consultation. Write in a supportive but honest tone. Use plain sentences, no bullet points, no em dashes. 3-5 sentences maximum.",
      messages: [{
        role: "user",
        content: `Station: ${args.stationTitle}

Data Gathering (${args.dgGrade}): ${args.dgComment}
Clinical Management (${args.cmGrade}): ${args.cmComment}
Relating to Others (${args.roGrade}): ${args.roComment}

Write a brief overall comment that summarises performance and highlights the single most important thing to work on. No em dashes.`,
      }],
    }),
  });

  if (!res.ok) return { error: "AI request failed." };
  const data = await res.json();
  const text = (data.content?.[0]?.text ?? "").trim();
  await recordExaminerClaudeUsage("overall_comment", data.model ?? EXAMINER_CLAUDE_MODEL, data.usage ?? {}, args.recordingId);
  return { text };
}

export async function grammarCheckAction(args: { text: string; recordingId?: string }): Promise<{ text?: string; error?: string }> {
  const examiner = await getExaminer();
  if (!examiner) return { error: "Not authorised." };
  if (!args.text.trim()) return { error: "Nothing to check." };

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": process.env.ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: EXAMINER_CLAUDE_MODEL,
      max_tokens: 400,
      system: "You are a copy editor. Fix grammar and spelling only. Do not change the meaning, tone, structure, or word choice. Return ONLY the corrected text with no explanation.",
      messages: [{ role: "user", content: args.text }],
    }),
  });

  if (!res.ok) return { error: "AI request failed." };
  const data = await res.json();
  const text = (data.content?.[0]?.text ?? "").trim();
  await recordExaminerClaudeUsage("grammar_check", data.model ?? EXAMINER_CLAUDE_MODEL, data.usage ?? {}, args.recordingId);
  return { text };
}

export async function retryAiPipelineAction(recordingId: string): Promise<{ error?: string }> {
  const examiner = await getExaminer();
  if (!examiner) return { error: "Not authorised." };

  const admin = getSupabaseAdmin();
  if (!admin) return { error: "Server config error." };

  const { error } = await admin
    .from("station_recordings")
    .update({ status: "processing" })
    .eq("id", recordingId)
    .in("status", ["pending_examiner", "reviewing", "sent", "failed"]);

  if (error) return { error: error.message };
  return {};
}

export async function checkRetryStatusAction(recordingId: string): Promise<{ status?: string; error?: string }> {
  const examiner = await getExaminer();
  if (!examiner) return { error: "Not authorised." };

  const admin = getSupabaseAdmin();
  if (!admin) return { error: "Server config error." };

  const { data } = await admin
    .from("station_recordings")
    .select("status")
    .eq("id", recordingId)
    .single<{ status: string }>();

  return { status: data?.status };
}

export async function examinerLogoutAction() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/examiner");
}

export async function submitExaminerReviewAction(
  _prevState: { error?: string; success?: boolean },
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const examiner = await getExaminer();
  if (!examiner) return { error: "Not authorised." };

  const admin = getSupabaseAdmin();
  if (!admin) return { error: "Server error." };

  const recordingId = String(formData.get("recordingId") ?? "").trim();
  const dgGrade = String(formData.get("dg_grade") ?? "").trim();
  const cmGrade = String(formData.get("cm_grade") ?? "").trim();
  const roGrade = String(formData.get("ro_grade") ?? "").trim();
  const dgComment = String(formData.get("dg_comment") ?? "").trim();
  const cmComment = String(formData.get("cm_comment") ?? "").trim();
  const roComment = String(formData.get("ro_comment") ?? "").trim();
  const overallComment = String(formData.get("overall_comment") ?? "").trim();
  const sendNow = formData.get("send_now") === "1";

  const validGrades = ["CF", "F", "P", "CP"];
  if (!validGrades.includes(dgGrade) || !validGrades.includes(cmGrade) || !validGrades.includes(roGrade)) {
    return { error: "All three domain grades are required." };
  }

  // An "ai_graded" recording was never submitted for GP review — it lives in
  // the AI pile of the portal. Grading it here is a manual overwrite: keep it
  // in the AI pile (status stays "ai_graded") and flag it as manually checked,
  // rather than moving it into the GP review queue/completed lists.
  const { data: current } = await admin
    .from("station_recordings")
    .select("status")
    .eq("id", recordingId)
    .single<{ status: string }>();
  const isAiPile = current?.status === "ai_graded";

  const now = new Date().toISOString();
  const updatePayload: Record<string, unknown> = {
    examiner_id: examiner.id,
    examiner_data_gathering: dgGrade,
    examiner_clinical_management: cmGrade,
    examiner_relating_to_others: roGrade,
    examiner_comment_data_gathering: dgComment || null,
    examiner_comment_clinical_management: cmComment || null,
    examiner_comment_relating_to_others: roComment || null,
    examiner_overall_comment: overallComment || null,
    examiner_reviewed_at: now,
    status: isAiPile ? "ai_graded" : sendNow ? "sent" : "reviewing",
  };

  if (isAiPile) {
    updatePayload.manually_checked_at = now;
    updatePayload.manually_checked_by = examiner.id;
  }

  if (sendNow) {
    updatePayload.sent_to_candidate_at = now;
  }

  const { error: updateErr } = await admin
    .from("station_recordings")
    .update(updatePayload)
    .eq("id", recordingId);

  if (updateErr) return { error: updateErr.message };

  // Snapshot the GP-review cost onto the consultation ledger the first time a
  // GP reviews it (whether a normal GP review or an AI-pile manual overwrite —
  // a GP was paid for their time either way). Frozen at the rate current now.
  {
    const { data: costRow } = await admin
      .from("consultation_costs")
      .select("gp_reviewed")
      .eq("recording_id", recordingId)
      .maybeSingle<{ gp_reviewed: boolean }>();
    if (!costRow?.gp_reviewed) {
      await snapshotGpReview(admin, recordingId, examiner.id);
    }
  }

  const { data: rec } = await admin
    .from("station_recordings")
    .select("candidate_email, station_number, station_title, doctor_display_name")
    .eq("id", recordingId)
    .single<{
      candidate_email: string | null;
      station_number: number;
      station_title: string;
      doctor_display_name: string;
    }>();

  if (sendNow && rec?.candidate_email) {
    const gradePts: Record<string, Record<string, number>> = {
      dg: { CF: 0, F: 1, P: 2, CP: 3 },
      cm: { CF: 0, F: 1.5, P: 3, CP: 4.5 },
      ro: { CF: 0, F: 1, P: 2, CP: 3 },
    };
    const total = (gradePts.dg[dgGrade] ?? 0) + (gradePts.cm[cmGrade] ?? 0) + (gradePts.ro[roGrade] ?? 0);

    await sendExaminerReportEmail({
      to: rec.candidate_email,
      candidateName: rec.doctor_display_name,
      stationNumber: rec.station_number,
      stationTitle: rec.station_title,
      dgGrade,
      cmGrade,
      roGrade,
      totalPts: total,
      dgComment,
      cmComment,
      roComment,
      overallComment,
    });
  }

  return { success: true };
}
