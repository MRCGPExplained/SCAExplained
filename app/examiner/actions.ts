"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase-case-bank";
import { getExaminer } from "@/lib/examiner-auth";
import { getSupabaseAdmin } from "@/lib/supabase";
import { withoutEmDashes } from "@/lib/prose";
import { gpRequested, type GpColumns } from "@/lib/recording-state";
import { sendExaminerReportEmail } from "@/lib/email";
import { doctorPossessive, printableName } from "@/lib/doctor-name";
import { MAX_PRESETS_PER_FIELD, MAX_PRESET_LENGTH, savePresetField } from "@/lib/examiner-presets-store";
import { PRESET_FIELDS, type ExaminerPreset, type PresetField } from "@/lib/examiner-presets";
import { getCurrentPricing, claudeCostUsd, usdToGbp } from "@/lib/pricing";
import { snapshotGpReview } from "@/lib/consultation-costs";

const EXAMINER_CLAUDE_MODEL = "claude-haiku-4-5-20251001";

/*
  The smallest gap between two Resend requests from this action.

  Resend's default allowance is two requests a second, and the SDK carries no
  retry of its own — `rate_limit_exceeded` is returned as an ordinary failure
  and the email is simply gone. 550ms keeps a whole roomful under that with
  room to spare. A consultation is at most a handful of emails, so the cost is
  a second or so on the Send button; app/api/cron/nudge sends serially for the
  same reason.
*/
const SEND_GAP_MS = 550;

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

/**
 * One domain's block of the prompt.
 *
 * A domain with nothing typed says so rather than presenting two empty
 * labels. "Did well:" followed by nothing reads to the model as an examiner
 * who found nothing good to say, which is a different claim from an examiner
 * who did not write about that domain.
 */
/**
 * One half of a domain — the examiner's observations, one per line.
 *
 * They arrive newline-separated because the dialog's boxes are bullet lists.
 * A single observation is written inline; several are listed, so the model
 * can see they are separate points rather than one run-on sentence it has to
 * guess the joins in.
 */
function noteList(label: string, text: string): string {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  if (lines.length === 0) return "";
  if (lines.length === 1) return `  ${label}: ${lines[0]}\n`;
  return `  ${label}:\n` + lines.map((l) => `    ${l}\n`).join("");
}

function domainNotes(label: string, well: string, improve: string): string {
  const w = noteList("Did well", well);
  const i = noteList("Could improve", improve);
  if (!w && !i) return `${label}: no notes written.\n`;
  return `${label}:\n` + w + i;
}

/**
 * Draft an overall comment from notes the examiner types for this purpose.
 *
 * The six note fields are the only input. Two things it deliberately does not
 * see:
 *
 *   - The three saved domain comments. Handing it those made it a summariser
 *     of text the candidate was already going to read, so the overall comment
 *     came back as the same three points in a different order. These notes are
 *     written separately and are not stored anywhere; they exist to say what
 *     the summary should be about.
 *
 *   - The grades. Brandon's call, and the reasoning is sound: a model told
 *     "Clear Fail" writes to that label rather than to what the examiner
 *     observed, and softens or hardens prose the examiner never asked it to.
 *     The examiner writes what they mean in the notes, and the tone follows
 *     from that.
 *
 * The station title stays. It is the name of the case, not a judgement on it,
 * and it keeps the draft from misreading what the consultation was about.
 */
export async function generateOverallCommentAction(args: {
  dgWell: string; dgImprove: string;
  cmWell: string; cmImprove: string;
  roWell: string; roImprove: string;
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
      /*
        300 was enough while this wrote a 3-5 sentence summary of its own. It
        now carries the examiner's six notes through largely intact, so the
        ceiling has to clear what they might type rather than what a summary
        would run to. 600 is roughly 450 words.
      */
      max_tokens: 600,
      /*
        Low, because the job is to keep somebody's words rather than to find
        better ones. Unset, the API defaults to 1.0, which is the setting
        least likely to leave a sentence alone — it was the right default
        while this was writing prose from grades, and the wrong one now.
      */
      temperature: 0.2,
      /*
        A copy editor, not a writer.

        Every instruction here that sounds redundant is a thing the model did
        on a real test run and must not do: it explained why a missed question
        mattered, it called an action "appropriate", and from the single note
        "fluid advice was right but you never quantified intake" it invented
        "Ensure you specify the volume of fluid replacement needed when
        managing gastroenteritis" — clinical advice no examiner wrote, going
        out under an examiner's name. Naming the failures is what stopped them.
      */
      system: [
        "You are copy-editing an RCGP examiner's notes into the overall comment a GP registrar will read.",
        "",
        "Use the examiner's words. Fix grammar, spelling, punctuation and tense, join fragments into sentences, and put the points in a sensible order. Nothing else. A note that is already a clean sentence comes through unchanged.",
        "",
        "Add nothing at all:",
        "- No explanation of why a point matters.",
        "- No advice or recommendation the examiner did not write.",
        "- No verdict on whether something was good, appropriate or correct.",
        "- No praise, softening or encouragement that is not in the notes.",
        "",
        "Do not rephrase a criticism into something gentler. If the note says a thing was missed, the comment says it was missed.",
        "",
        "Do not swap a word for a synonym. If the note says the referral was \"right\", the comment says it was right, not that it was appropriate. Leave abbreviations exactly as written: \"ICE\" stays \"ICE\", \"2ww\" stays \"2ww\".",
        "",
        "The notes may be lists, one observation per line. Join them into sentences. The comment itself is never a list.",
        "",
        "Say nothing about a domain with no notes.",
        "",
        "Plain prose, addressed to the candidate as \"you\". No headings, no bullet points, no em dashes. As short as the notes allow.",
      ].join("\n"),
      messages: [{
        role: "user",
        content: `Station: ${args.stationTitle}

${domainNotes("Data Gathering", args.dgWell, args.dgImprove)}
${domainNotes("Clinical Management", args.cmWell, args.cmImprove)}
${domainNotes("Relating to Others", args.roWell, args.roImprove)}
Copy-edit these notes into the overall comment. The examiner's words, corrected and joined up. Nothing added.`,
      }],
    }),
  });

  if (!res.ok) return { error: "AI request failed." };
  const data = await res.json();
  // The prompt asks for no em dashes twice and they still arrive. Asking is
  // a preference; this is the part that decides.
  const text = withoutEmDashes((data.content?.[0]?.text ?? "").trim());
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
  const text = withoutEmDashes((data.content?.[0]?.text ?? "").trim());
  await recordExaminerClaudeUsage("grammar_check", data.model ?? EXAMINER_CLAUDE_MODEL, data.usage ?? {}, args.recordingId);
  return { text };
}

export async function retryAiPipelineAction(recordingId: string): Promise<{ error?: string }> {
  const examiner = await getExaminer();
  if (!examiner) return { error: "Not authorised." };

  const admin = getSupabaseAdmin();
  if (!admin) return { error: "Server config error." };

  // Any status except "processing" can be retried. The previous allow-list
  // left out "ai_graded", which is precisely the state a failed grading run
  // lands in (the pipeline rolls back to it so the candidate can still submit
  // for GP review), so the most common failure was the one case Retry
  // silently refused to act on — it matched no rows and reported no error.
  const { data: current } = await admin
    .from("station_recordings")
    .select("status, transcript_formatted")
    .eq("id", recordingId)
    .single<{ status: string; transcript_formatted: string | null }>();

  if (!current) return { error: "Recording not found." };
  if (current.status === "processing" || current.status === "grading") {
    return { error: "Already running — give it a minute." };
  }

  /*
    Ask for the stage that actually needs doing.

    This used to POST with no query string, so the route defaulted to
    stage="transcribe". On a row that already has a transcript the pipeline
    takes its reuse branch, writes nothing, and returns at the
    `if (stage === "transcribe") return;` guard before it ever grades. The
    claim below had already moved the row to "processing", and nothing was
    left to move it off: the only "transcribed" write lives in the branch the
    reuse path skips.

    Not a race. It happened on every retry of anything already transcribed,
    which is every row a GP has in front of them, which is the whole point of
    the button. The panel it sits in already described the behaviour the code
    did not have: "Running it again reuses the existing transcript, so it
    goes straight to grading."
  */
  const stage = current.transcript_formatted ? "grade" : "transcribe";
  const claimStatus = stage === "grade" ? "grading" : "processing";

  // The read above says what to roll back to; it does not decide anything.
  // Checking the status and then setting it are two statements, and two
  // Retry clicks landing together both passed the check and both started a
  // pipeline run. The condition belongs in the UPDATE, where Postgres
  // serialises it: the second one matches no rows and stops here.
  const { data: claimed, error } = await admin
    .from("station_recordings")
    .update({ status: claimStatus, ai_error: null, ai_failed_at: null })
    .eq("id", recordingId)
    // Claim only if nothing has moved since the read above. Stronger than the
    // old .neq("status","processing"), which let a claim land on a row some
    // other write had just changed underneath it.
    .eq("status", current.status)
    .select("id");

  if (error) return { error: error.message };
  if (!claimed || claimed.length === 0) return { error: "Already processing — give it a minute." };

  // Trigger the pipeline server-side rather than from the browser: only the
  // server holds INTERNAL_API_KEY, so a browser-issued POST is rejected as
  // soon as that key is set. Fire-and-forget — the route acknowledges
  // immediately and does the real work in its own after().
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.scafocus.com";
  try {
    const res = await fetch(`${origin}/api/recordings/${recordingId}/process?stage=${stage}`, {
      method: "POST",
      headers: { "x-internal-key": process.env.INTERNAL_API_KEY ?? "" },
    });
    if (!res.ok) {
      const body = await res.text();
      // Guarded: only undo our own claim. Unguarded this could drag a row
      // backwards over a status the pipeline had already written.
      await admin
        .from("station_recordings")
        .update({ status: current.status })
        .eq("id", recordingId)
        .eq("status", claimStatus);
      return { error: `Could not start the pipeline (${res.status}). ${body.slice(0, 120)}` };
    }
  } catch (err) {
    await admin
      .from("station_recordings")
      .update({ status: current.status })
      .eq("id", recordingId)
      .eq("status", claimStatus);
    return { error: err instanceof Error ? err.message : "Could not reach the processing service." };
  }

  return {};
}

export async function checkRetryStatusAction(
  recordingId: string
): Promise<{ status?: string; hasGrades?: boolean; aiError?: string | null; error?: string }> {
  const examiner = await getExaminer();
  if (!examiner) return { error: "Not authorised." };

  const admin = getSupabaseAdmin();
  if (!admin) return { error: "Server config error." };

  // Status alone can't distinguish success from failure — the pipeline lands
  // on "ai_graded" either way — so the presence of grades is what actually
  // says whether the run worked.
  const { data } = await admin
    .from("station_recordings")
    .select("status, ai_data_gathering, ai_error")
    .eq("id", recordingId)
    .single<{ status: string; ai_data_gathering: string | null; ai_error: string | null }>();

  return {
    status: data?.status,
    hasGrades: !!data?.ai_data_gathering,
    aiError: data?.ai_error ?? null,
  };
}

/**
 * Replaces one Did Well / Could Improve tick list.
 *
 * The whole list arrives each time rather than an add, an edit and a move:
 * reordering is a drag, and a drag is only ever expressible as the new order
 * of everything. Sending the list makes add, rename, delete and reorder the
 * same call, which is also why there is one of these rather than four.
 *
 * Everything is re-checked here. The browser is where the dragging happened,
 * not where the rules live.
 */
export async function saveExaminerPresetsAction(
  field: string,
  presets: ExaminerPreset[]
): Promise<{ error?: string; success?: boolean }> {
  const examiner = await getExaminer();
  if (!examiner) return { error: "Not authorised." };

  if (!PRESET_FIELDS.includes(field as PresetField)) return { error: "Unknown list." };
  if (!Array.isArray(presets)) return { error: "Bad list." };
  if (presets.length > MAX_PRESETS_PER_FIELD) {
    return { error: `That is more than ${MAX_PRESETS_PER_FIELD} presets.` };
  }

  const cleaned: ExaminerPreset[] = [];
  const seen = new Set<string>();
  for (const entry of presets) {
    const text = String(entry?.text ?? "").trim();
    const id = String(entry?.id ?? "").trim();
    // A blank one is dropped rather than refused: it is what an empty row
    // left behind in the editor looks like, not something worth an error.
    if (!text || !id) continue;
    if (text.length > MAX_PRESET_LENGTH) return { error: "One of those is too long." };
    if (seen.has(id)) continue;
    seen.add(id);
    cleaned.push({ id, text });
  }

  const admin = getSupabaseAdmin();
  if (!admin) return { error: "Server error." };

  const { error } = await savePresetField(admin, field as PresetField, cleaned);
  if (error) return { error };

  return { success: true };
}

export async function examinerLogoutAction() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/examiner");
}

export async function submitExaminerReviewAction(
  _prevState: { error?: string; success?: boolean; warning?: string; sent?: boolean },
  formData: FormData
): Promise<{ error?: string; success?: boolean; warning?: string; sent?: boolean }> {
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
    .select("submitted_for_review_at, gp_requested_at, sent_to_candidate_at")
    .eq("id", recordingId)
    .single<GpColumns & { sent_to_candidate_at: string | null }>();

  /*
    A report is sent once.

    The buttons are hidden once sent_to_candidate_at is set, which covers a
    reload and nothing else: a second click before the page catches up, a
    tab left open from this morning, a retry after a timeout that actually
    landed — each of those reached here and each wrote a fresh
    sent_to_candidate_at and emailed the whole room again. The window is not
    theoretical now that a send is several emails paced a half-second apart.

    Checked on the server because that is the only place it holds. A disabled
    button is a courtesy; this is the rule.

    Fails closed on an unreadable row. Refusing a first send over a transient
    read error costs a reload; the other way round costs everyone in the room
    a duplicate report, and there is no unsending one.
  */
  if (sendNow) {
    if (!current) {
      return { error: "Could not check whether this has already been sent, so nothing was sent. Reload and try again." };
    }
    if (current.sent_to_candidate_at) {
      const when = new Date(current.sent_to_candidate_at).toLocaleString("en-GB", {
        day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Europe/London",
      });
      return { error: `Already sent to the candidate on ${when}. Nothing was sent again.` };
    }
  }
  /*
    Whether this was ever sent to a GP, asked of the columns that record it
    rather than of the status string.

    It read `status === "ai_graded"`, which the pipeline is free to write at
    any moment. A re-grade that landed on "ai_graded" therefore reclassified
    a real GP review as an AI-pile overwrite, and the next Save kept it there
    permanently: a one-way trap, triggered by a button meant to be harmless.
  */
  const isAiPile = !gpRequested(current ?? {});

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

  /*
    So the page this was submitted from comes back with sent_to_candidate_at
    set, which is what hides the buttons. Without it the form sits there
    offering to send a report that has already gone, and only the server
    guard above stands between the examiner and a second one.
  */
  revalidatePath(`/examiner/${recordingId}`);

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
    .select(
      "candidate_email, station_number, station_title, doctor_display_name, patient_display_name, doctor_user_id, patient_user_id, observer_user_ids"
    )
    .eq("id", recordingId)
    .single<{
      candidate_email: string | null;
      station_number: number;
      station_title: string;
      doctor_display_name: string;
      patient_display_name: string | null;
      doctor_user_id: string | null;
      patient_user_id: string | null;
      observer_user_ids: string[] | null;
    }>();

  let emailed = true;
  /** Copies to the others in the room that were meant to go and did not. */
  let peerMissed = 0;

  if (sendNow && rec) {
    const gradePts: Record<string, Record<string, number>> = {
      dg: { CF: 0, F: 1, P: 2, CP: 3 },
      cm: { CF: 0, F: 1.5, P: 3, CP: 4.5 },
      ro: { CF: 0, F: 1, P: 2, CP: 3 },
    };
    const total = (gradePts.dg[dgGrade] ?? 0) + (gradePts.cm[cmGrade] ?? 0) + (gradePts.ro[roGrade] ?? 0);

    /*
      The marking, written once and sent to everyone who was in the room.

      Brandon's call, and it is narrower than it looks: the report page has
      never gated the grades on which chair you sat in, so the patient and the
      observers could already open all of this from their envelope. What
      changes is that it now reaches them without their having to look. The
      only thing withheld from a peer is the doctor's display name — see the
      peer field on sendExaminerReportEmail.
    */
    /*
      Who was in the room, for the block under the station title.

      The doctor and the patient are denormalised onto the row; the observers
      are only ids, so their names come from user_profiles in one go and are
      put back in the order the array holds them rather than the order the
      rows come back in.

      The examiner is the person pressing Send, which is the same id written
      to examiner_id in updatePayload above — not a second lookup that could
      disagree with it.
    */
    const observerIds = (rec.observer_user_ids ?? []).filter(Boolean);
    let observerNames: string[] = [];
    if (observerIds.length > 0) {
      // supabase-js returns { data, error } rather than throwing.
      const { data: profiles, error: profileErr } = await admin
        .from("user_profiles")
        .select("id, display_name")
        .in("id", observerIds);
      if (profileErr) {
        console.error("[examiner] could not read observer names", { recordingId, error: profileErr.message });
      }
      const byId = new Map((profiles ?? []).map((p) => [p.id as string, p.display_name as string | null]));
      observerNames = observerIds
        .map((id) => printableName(byId.get(id)))
        .filter((n): n is string => !!n);
    }

    const roster = {
      doctor: printableName(rec.doctor_display_name),
      patient: printableName(rec.patient_display_name),
      observers: observerNames,
      examiner: printableName(examiner.name),
    };

    const report = {
      recordingId,
      roster,
      stationNumber: rec.station_number,
      stationTitle: rec.station_title,
      dgGrade,
      cmGrade,
      roGrade,
      totalPts: total,
    };

    /*
      Every send in this action goes through here, so the pacing holds across
      the candidate's copy and the peers' alike rather than only within the
      peer loop. The stamp is taken before the request rather than after, so
      the gap is measured between starts and the time a send itself takes is
      slack on top of it.
    */
    let lastSendAt = 0;
    const pacedSend = async (opts: Parameters<typeof sendExaminerReportEmail>[0]) => {
      const wait = SEND_GAP_MS - (Date.now() - lastSendAt);
      if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait));
      lastSendAt = Date.now();
      return sendExaminerReportEmail(opts);
    };

    if (rec.candidate_email) {
      /*
        The result used to be discarded. sendExaminerReportEmail returns false
        on a Resend error or a missing key and never throws, so a bounced email
        left the review marked sent, the candidate never told, and nothing
        recorded anywhere.

        It is no longer fatal — the review is saved, sent_to_candidate_at is
        set, and it is now sitting in the candidate's envelope either way — but
        the GP who pressed Send is the one person who can chase it, so say so.
      */
      emailed = await pacedSend({ to: rec.candidate_email, ...report });
      if (!emailed) {
        console.error("[examiner] report email not sent", { recordingId, to: rec.candidate_email });
      }
    }

    /*
      Everyone else who was in the room.

      doctor_user_id is excluded explicitly rather than for tidiness: a solo
      practice take writes the doctor into patient_user_id as well
      (app/betatest/actions.ts:35), so without this the candidate would get a
      second copy of their own report, that one addressed to them in the third
      person.
    */
    const peerIds = Array.from(
      new Set(
        [rec.patient_user_id, ...(rec.observer_user_ids ?? [])].filter(
          (id): id is string => !!id && id !== rec.doctor_user_id
        )
      )
    );

    /*
      Addresses, which are not on the row — only candidate_email is, and that
      is the doctor's. Keyed on the lowercased address so the same person in
      two chairs is one email, and checked against candidate_email in case a
      peer resolves to the address that has just been written to.
    */
    const peerAddresses = new Map<string, string>();
    for (const id of peerIds) {
      // supabase-js returns { data, error } rather than throwing.
      const { data: authUser, error: lookupErr } = await admin.auth.admin.getUserById(id);
      const address = authUser?.user?.email;
      if (lookupErr || !address) {
        console.error("[examiner] no address for someone in the room", {
          recordingId,
          userId: id,
          error: lookupErr?.message,
        });
        peerMissed++;
        continue;
      }
      const key = address.toLowerCase();
      if (key === (rec.candidate_email ?? "").toLowerCase()) continue;
      peerAddresses.set(key, address);
    }

    const peerList = Array.from(peerAddresses.values());
    if (peerList.length > 0) {
      /*
        The doctor is named in the possessive and nowhere else. doctorPossessive
        returns null for a display name it cannot trust — one holding an email
        address, or the "Tester"/"Doctor" placeholders — and the subject is then
        the bare "SCA Report", exactly as the envelope says "the case".
      */
      const whose = doctorPossessive(rec.doctor_display_name);

      /*
        One at a time, through the same gate as the candidate's copy.

        This was Promise.all, which fired every peer at once. A room with two
        observers is three peers, so three requests landed together against an
        allowance of two a second, and the one that lost came back as a plain
        failure with nothing to retry it. The GP would have been told a copy
        did not go out, which is true and no use to the person who did not get
        it. One observer never showed it: two is where it starts.
      */
      for (const to of peerList) {
        const ok = await pacedSend({ to, ...report, whose });
        if (ok) continue;
        peerMissed++;
        console.error("[examiner] report email not sent to someone in the room", { recordingId, to });
      }
    }
  }

  /*
    One warning covering both, because the GP who pressed Send is the only
    person who can chase any of it, and a half-delivered send they are not
    told about reads to them as a clean one.
  */
  const undelivered: string[] = [];
  if (sendNow && rec?.candidate_email && !emailed) undelivered.push("the candidate's copy did not go out");
  if (peerMissed > 0) {
    undelivered.push(
      `${peerMissed} ${peerMissed === 1 ? "copy" : "copies"} to the others in the room did not go out`
    );
  }

  return {
    success: true,
    // Only true when a send actually happened here, so the navbar's count
    // moves for a send and not for a draft save.
    sent: sendNow,
    warning: undelivered.length
      ? `Saved and sent, but ${undelivered.join(", and ")}. Everyone who was in the room can still see the report in their envelope on the site.`
      : undefined,
  };
}

/**
 * Examiner edits to the skill ratings and text.
 *
 * Saved to examiner_skills_assessment rather than over the AI's, mirroring how
 * examiner_data_gathering sits beside ai_data_gathering: the report can then
 * show what the model said and what the GP changed it to, and a re-run of the
 * pipeline cannot silently wipe a GP's work.
 *
 * Deliberately does not re-run the grade adjustment. That adjustment exists to
 * correct the model's own domain grades; an examiner sets the domain grades
 * directly, so recomputing from their skill edits would fight them for control
 * of the same number.
 */
export async function saveExaminerSkillsAction(
  recordingId: string,
  skills: { skill: string; rating: string; comment: string; improvement?: string }[]
): Promise<{ error?: string }> {
  const examiner = await getExaminer();
  if (!examiner) return { error: "Not authorised." };

  const admin = getSupabaseAdmin();
  if (!admin) return { error: "Server config error." };

  const allowed = ["good", "needs_improvement", "not_assessable"];
  for (const s of skills) {
    if (!allowed.includes(s.rating)) return { error: `Unknown rating "${s.rating}".` };
  }

  const cleaned = skills.map((s) => ({
    skill: s.skill,
    rating: s.rating,
    comment: (s.comment ?? "").trim(),
    ...(s.improvement?.trim() ? { improvement: s.improvement.trim() } : {}),
  }));

  const { error } = await admin
    .from("station_recordings")
    .update({ examiner_skills_assessment: { skills: cleaned } })
    .eq("id", recordingId);

  if (error) return { error: error.message };
  revalidatePath(`/examiner/${recordingId}`);
  revalidatePath(`/recordings/${recordingId}`);
  return {};
}
