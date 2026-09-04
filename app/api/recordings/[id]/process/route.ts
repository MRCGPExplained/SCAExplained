import { NextResponse, after } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { DEFAULT_GRADING_GUIDANCE, buildOutputContract } from "@/lib/ai-defaults";
import { findTranscriptQuotes, quotesTranscript, buildQuoteRepairPrompt, type RepairTarget } from "@/lib/transcript-quotes";
import {
  buildSkillFrameworkPrompt,
  buildSkillsOutputContract,
  loadGradingSkills,
  applySkillAdjustment,
  DEFAULT_SKILL_CONFIG,
  type SkillAnswer,
  type GradingSkill,
  type Grade as SkillGrade,
} from "@/lib/skill-framework";
import {
  getCurrentPricing,
  claudeCostUsd,
  deepgramBillableMinutes,
  deepgramCostUsd,
  dailyCostUsd,
  usdToGbp,
  type ClaudeTokens,
} from "@/lib/pricing";
import { getMeetingUsage } from "@/lib/daily";
import { buildConsultationLedger } from "@/lib/consultation-costs";

const DEEPGRAM_MODEL = "nova-2-medical";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 300; // up to 5 min for transcription + grading

interface RouteParams {
  params: Promise<{ id: string }>;
}

type Grade = "CF" | "F" | "P" | "CP";

interface GradeResult {
  data_gathering: Grade;
  clinical_management: Grade;
  relating_to_others: Grade;
  comment_data_gathering: string;
  comment_clinical_management: string;
  comment_relating_to_others: string;
  focus_for_next_time: string;
  // Present only when skill grading is enabled. The model answers the skill
  // questions; the grade adjustment itself is computed in code.
  skills_assessment?: { skills?: SkillAnswer[] };
}

interface ClaudeUsageRaw {
  input_tokens?: number;
  output_tokens?: number;
  cache_creation_input_tokens?: number;
  cache_read_input_tokens?: number;
}

interface DeepgramUtterance {
  start: number;
  end: number;
  transcript: string;
}

interface TranscriptionResult {
  utterances: DeepgramUtterance[];
  durationSec: number;
  requestId: string | null;
}

interface DeepgramResponse {
  metadata?: {
    duration?: number;
    request_id?: string;
  };
  results?: {
    utterances?: DeepgramUtterance[];
    channels?: Array<{
      alternatives?: Array<{ transcript: string }>;
    }>;
  };
}

// Deepgram transcription for a single audio file. Returns the utterances plus
// the billing metadata (audio duration + request id) so cost can be recorded.
async function transcribeAudio(audioBuffer: Buffer): Promise<TranscriptionResult> {
  const res = await fetch(
    `https://api.deepgram.com/v1/listen?model=${DEEPGRAM_MODEL}&punctuate=true&utterances=true`,
    {
      method: "POST",
      headers: {
        Authorization: `Token ${process.env.DEEPGRAM_API_KEY}`,
        "Content-Type": "audio/webm",
      },
      body: audioBuffer as unknown as BodyInit,
    }
  );

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Deepgram ${res.status}: ${body}`);
  }

  const data = (await res.json()) as DeepgramResponse;
  return {
    utterances: data?.results?.utterances ?? [],
    durationSec: data?.metadata?.duration ?? 0,
    requestId: data?.metadata?.request_id ?? null,
  };
}

// Merge doctor + patient utterances chronologically into a readable transcript
function buildTranscript(
  doctorUtterances: DeepgramUtterance[],
  patientUtterances: DeepgramUtterance[]
): string {
  const all = [
    ...doctorUtterances.map((u) => ({ ...u, speaker: "Doctor" as const })),
    ...patientUtterances.map((u) => ({ ...u, speaker: "Patient" as const })),
  ].sort((a, b) => a.start - b.start);

  return all
    .map((u) => {
      const mins = Math.floor(u.start / 60);
      const secs = Math.floor(u.start % 60).toString().padStart(2, "0");
      return `[${mins}:${secs}] ${u.speaker}: ${u.transcript}`;
    })
    .join("\n");
}


const GRADING_MODEL = "claude-haiku-4-5-20251001";

// Output scales with consultation length: three domains × three sentences with
// quotes, plus a focus line. Plain grading has come in at 303-644 tokens.
//
// Skill grading adds far more than it looks — eleven skills, each with a
// comment and three domain influences, plus baseline grades. That overshot a
// 2000 ceiling on the first real run and truncated the JSON mid-string, which
// fails the whole grading. Sized well clear of it now: output is billed per
// token generated, not per token allowed, so unused headroom costs nothing.
const GRADING_MAX_TOKENS = 6000;

interface GradeWithUsage {
  grades: GradeResult;
  model: string;
  tokens: ClaudeTokens;
}

// Grade the consultation with Claude. Returns the grades plus the token usage
// so the cost of the call can be recorded.
async function gradeWithClaude(
  stationContext: string,
  transcript: string,
  opts: { customPrompt?: string; skills?: GradingSkill[]; stationNotes?: Record<string, string>; model: string }
): Promise<GradeWithUsage> {
  // Guidance is replaceable by an admin; the skill framework and the output
  // contract are not, so a custom prompt can change how Claude grades but can
  // never break how it replies.
  const skills = opts.skills ?? [];
  const systemPrompt = [
    opts.customPrompt?.trim() || DEFAULT_GRADING_GUIDANCE,
    skills.length ? buildSkillFrameworkPrompt(skills, opts.stationNotes ?? {}) : null,
    buildOutputContract(skills.length ? buildSkillsOutputContract(skills) : null),
  ]
    .filter(Boolean)
    .join("\n\n");

  const userMessage = `STATION CONTEXT:\n${stationContext}\n\nCONSULTATION TRANSCRIPT:\n${transcript}\n\nPlease grade this consultation.`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": process.env.ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: opts.model,
      max_tokens: GRADING_MAX_TOKENS,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Claude ${res.status}: ${body}`);
  }

  const data = await res.json();

  // Hitting the token ceiling truncates the JSON mid-string, so JSON.parse
  // fails with a confusing "invalid JSON" further down. Name it precisely
  // instead — this is what silently broke grading on long consultations.
  if (data.stop_reason === "max_tokens") {
    throw new Error(
      `Claude response hit the ${GRADING_MAX_TOKENS}-token ceiling and was truncated (${data.usage?.output_tokens ?? "?"} output tokens). Raise GRADING_MAX_TOKENS.`
    );
  }

  const raw = (data.content?.[0]?.text ?? "").trim();
  // Strip markdown code fences Claude sometimes adds despite instructions
  const text = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();

  const usage = (data.usage ?? {}) as ClaudeUsageRaw;
  const tokens: ClaudeTokens = {
    input_tokens: usage.input_tokens ?? 0,
    output_tokens: usage.output_tokens ?? 0,
    cache_creation_tokens: usage.cache_creation_input_tokens ?? 0,
    cache_read_tokens: usage.cache_read_input_tokens ?? 0,
  };

  try {
    return { grades: JSON.parse(text) as GradeResult, model: data.model ?? opts.model, tokens };
  } catch {
    throw new Error(`Claude returned invalid JSON: ${text.slice(0, 200)}`);
  }
}

/**
 * Whether a quoting comment is rewritten or merely recorded.
 *
 * The prompt already asks for no quoting and mostly gets it. Rewriting is a
 * second Claude call per affected consultation, which is real money for a
 * problem that is a readability one, so the default is to measure how often the
 * prompt fails rather than pay to correct it every time. Flip to true to make
 * the rule a guarantee.
 */
const REWRITE_QUOTED_COMMENTS = false;

/**
 * Rewrites any comment that quotes the transcript, and returns what it changed.
 *
 * Asking the model not to quote is not a control: the same instruction produced
 * 1, 7 and 10 quoting comments across three runs of the same two recordings, so
 * the check has to happen after the fact. `findTranscriptQuotes` decides what
 * counts, mechanically, and only the comments that fail are sent back.
 *
 * Grades are never re-requested. They are already settled, and regrading to fix
 * prose could change them, which is a much worse outcome than a quotation.
 */
async function repairQuotedComments(
  comments: Record<string, string | undefined>,
  transcript: string,
  model: string
): Promise<{ fixed: Record<string, string>; tokens: ClaudeTokens | null; remaining: number }> {
  const targets: RepairTarget[] = [];
  for (const [key, comment] of Object.entries(comments)) {
    if (!comment) continue;
    const quotes = findTranscriptQuotes(comment, transcript);
    if (quotes.length) targets.push({ key, comment, quotes });
  }

  if (!targets.length) return { fixed: {}, tokens: null, remaining: 0 };

  // Detection is free; the rewrite is a second Claude call. Off by default, so
  // the prompt does the work and this only records how often the prompt failed.
  // Turn on to guarantee the rule rather than merely measure it.
  if (!REWRITE_QUOTED_COMMENTS) {
    console.warn(
      `[recordings/process] ${targets.length} comment(s) quote the transcript, rewrite disabled: ` +
        targets.map((t) => `${t.key} (${t.quotes[0]?.slice(0, 60)})`).join("; ")
    );
    return { fixed: {}, tokens: null, remaining: targets.length };
  }

  console.log(`[recordings/process] rewriting ${targets.length} quoting comment(s)`);

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": process.env.ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model,
      max_tokens: 2000,
      messages: [{ role: "user", content: buildQuoteRepairPrompt(targets) }],
    }),
  });

  // A failed rewrite must never fail the grading. The original comment is
  // worse for quoting, not unusable, so it stands and the run continues.
  if (!res.ok) {
    console.error(`[recordings/process] quote repair failed: Claude ${res.status}`);
    return { fixed: {}, tokens: null, remaining: targets.length };
  }

  const data = await res.json();
  const raw = (data.content?.[0]?.text ?? "").trim();
  const text = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();

  const usage = (data.usage ?? {}) as ClaudeUsageRaw;
  const tokens: ClaudeTokens = {
    input_tokens: usage.input_tokens ?? 0,
    output_tokens: usage.output_tokens ?? 0,
    cache_creation_tokens: usage.cache_creation_input_tokens ?? 0,
    cache_read_tokens: usage.cache_read_input_tokens ?? 0,
  };

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(text) as Record<string, unknown>;
  } catch {
    console.error(`[recordings/process] quote repair returned invalid JSON: ${text.slice(0, 200)}`);
    return { fixed: {}, tokens, remaining: targets.length };
  }

  const fixed: Record<string, string> = {};
  let remaining = 0;
  for (const target of targets) {
    const rewritten = parsed[target.key];
    // Only accept a rewrite that actually stopped quoting. One that still
    // quotes is no better than what it replaces, so the original stands.
    if (typeof rewritten === "string" && rewritten.trim() && !quotesTranscript(rewritten, transcript)) {
      fixed[target.key] = rewritten.trim();
    } else {
      remaining++;
    }
  }

  if (remaining) console.warn(`[recordings/process] ${remaining} comment(s) still quoting after rewrite`);
  return { fixed, tokens, remaining };
}

// Sample transcript injected when ?spike=1 — skips Deepgram entirely
const SPIKE_TRANSCRIPT = `[0:00] Doctor: Good morning, please come in and take a seat. So how can I help you today?
[0:08] Patient: Morning. I've been getting this chest pain on and off for about three weeks now. It's been worrying me.
[0:16] Doctor: I'm sorry to hear that. Can you tell me more about the pain? Where exactly is it?
[0:22] Patient: It's sort of here, in the centre of my chest. Sometimes it goes up into my throat a bit.
[0:30] Doctor: And when does it tend to come on?
[0:34] Patient: Mainly after eating. Especially if I eat a big meal or something spicy. It's worse when I lie down at night.
[0:42] Doctor: How long does each episode last?
[0:45] Patient: Maybe twenty, thirty minutes. Then it settles on its own.
[0:50] Doctor: Have you noticed anything that makes it better or worse?
[0:54] Patient: Sitting up helps. And I had some Gaviscon left over from before — that seemed to help a bit.
[1:02] Doctor: That's useful to know. Have you had anything like this before?
[1:06] Patient: I had a bit of heartburn when I was pregnant, about five years ago. But nothing like this since then.
[1:13] Doctor: Any difficulty swallowing, or feeling like food is sticking?
[1:17] Patient: No, nothing like that.
[1:19] Doctor: Any nausea, vomiting, or have you noticed any blood in your vomit or stools?
[1:24] Patient: No, none of that. My stools have been normal.
[1:28] Doctor: Any weight loss recently?
[1:30] Patient: I've actually put on a bit of weight over the last year. Desk job.
[1:35] Doctor: I see. Any shortness of breath or palpitations with the chest pain?
[1:40] Patient: No, my breathing's fine. The pain doesn't come on with exercise either — only with food and lying down.
[1:48] Doctor: That's helpful. Any significant medical history — anything you see your GP for regularly?
[1:54] Patient: I'm on the pill and that's about it. I had my blood pressure checked a few months ago and it was normal.
[2:02] Doctor: Any family history of heart problems?
[2:06] Patient: My dad had a heart attack at sixty-two. That's partly why I'm here, to be honest.
[2:12] Doctor: That's completely understandable. Do you smoke or drink?
[2:16] Patient: I gave up smoking three years ago. I drink maybe a glass of wine most evenings.
[2:22] Doctor: Okay. And tell me — what were you worried this might be?
[2:27] Patient: Obviously I was worried it might be my heart. But actually the more I read online, the more it sounded like it could be acid reflux or something like that.
[2:37] Doctor: That's a very reasonable thought. The pattern you're describing — coming on after food, relieved by sitting up, responding to Gaviscon — does sound much more in keeping with acid reflux, or gastro-oesophageal reflux disease as we call it, rather than a cardiac cause. The fact that it doesn't come on with exertion is also reassuring.
[2:58] Patient: That is reassuring. So you don't think I need any heart tests?
[3:03] Doctor: Given the typical reflux pattern and your age and that it's consistently food-related, I'm not concerned about your heart. But I do want to examine you today and take your blood pressure, and I'll arrange some routine bloods including a check of your haemoglobin to make sure there's no anaemia.
[3:20] Patient: Okay, that sounds fine.
[3:23] Doctor: In terms of treatment, I'd like to start you on a medication called a proton pump inhibitor — omeprazole 20mg once a day before breakfast. We'd try that for four to eight weeks and see how you get on.
[3:35] Patient: Is that safe to take long-term?
[3:38] Doctor: It's very well-tolerated short-term. If you need it longer term we'd review that together, but for now a trial course is the right approach. There are also some lifestyle measures that can help — avoiding large meals, not eating for two to three hours before bed, raising the head of your bed slightly, and perhaps cutting back on the wine a little as alcohol can relax the valve that keeps acid down.
[4:02] Patient: I'll try the wine thing. Not sure about the bed head!
[4:06] Doctor: Fair enough. I'd also want to see you back in four to six weeks to see how you're getting on. If the omeprazole hasn't helped by then, or if you develop any new symptoms — difficulty swallowing, vomiting blood, significant weight loss — come in sooner. Those would be things I'd want to investigate further.
[4:24] Patient: Right, that makes sense. Should I stop the Gaviscon?
[4:27] Doctor: You can continue to use it as a top-up if you need it, especially before bed. It works differently to omeprazole so they complement each other.
[4:35] Patient: Great, that's really helpful. Thanks.
[4:38] Doctor: Not at all. I'll examine you now and then we'll get those bloods organised.`;

export async function POST(req: Request, { params }: RouteParams) {
  const { id: recordingId } = await params;
  const url = new URL(req.url);
  const isSpike = url.searchParams.get("spike") === "1";

  // Validate internal caller
  const internalKey = req.headers.get("x-internal-key") ?? "";
  const expectedKey = process.env.INTERNAL_API_KEY ?? "";
  if (expectedKey && internalKey !== expectedKey) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const admin = getSupabaseAdmin();
  if (!admin) return NextResponse.json({ error: "Server config error" }, { status: 500 });

  // Fetch recording + station data
  const { data: recording } = await admin
    .from("station_recordings")
    .select("id, station_number, doctor_user_id, doctor_audio_path, patient_audio_path, status, transcript_formatted, transcript_raw")
    .eq("id", recordingId)
    .single<{
      id: string;
      station_number: number;
      doctor_user_id: string;
      doctor_audio_path: string | null;
      patient_audio_path: string | null;
      status: string;
      transcript_formatted: string | null;
      transcript_raw: unknown;
    }>();

  if (!recording) return NextResponse.json({ error: "Recording not found" }, { status: 404 });
  if (recording.status !== "processing") {
    return NextResponse.json({ error: "Recording not in processing state" }, { status: 409 });
  }

  // Fetch runtime settings once
  const { data: settingsRows } = await admin
    .from("site_settings")
    .select("key, value")
    .in("key", ["deepgram_enabled", "ai_grading_prompt", "vercel_plan", "skill_grading_enabled", "grading_model", "skill_threshold_up", "skill_threshold_down", "skill_min_assessable", "skill_framework_version", "skill_cap_rto"]);

  const settingsMap = new Map(
    ((settingsRows ?? []) as { key: string; value: string }[]).map((r) => [r.key, r.value])
  );
  const deepgramEnabled = settingsMap.get("deepgram_enabled") === "true"; // must be explicitly on
  const vercelPlan = settingsMap.get("vercel_plan") ?? "pro"; // default pro
  const customPrompt = settingsMap.get("ai_grading_prompt") ?? undefined;
  // Off unless explicitly enabled, so the pipeline behaves exactly as before
  // until someone turns it on.
  const skillGrading = settingsMap.get("skill_grading_enabled") === "true";
  const gradingModel = settingsMap.get("grading_model")?.trim() || GRADING_MODEL;
  const skillConfig = {
    thresholdUp: Number(settingsMap.get("skill_threshold_up")) || DEFAULT_SKILL_CONFIG.thresholdUp,
    thresholdDown: Number(settingsMap.get("skill_threshold_down")) || DEFAULT_SKILL_CONFIG.thresholdDown,
    minAssessable: Number(settingsMap.get("skill_min_assessable")) || DEFAULT_SKILL_CONFIG.minAssessable,
    frameworkVersion: Number(settingsMap.get("skill_framework_version")) || DEFAULT_SKILL_CONFIG.frameworkVersion,
    capEnabled: settingsMap.get("skill_cap_rto") === "true",
  };

  // If Deepgram is disabled, skip AI grading — the candidate can still
  // choose to Submit for GP Review with no AI pre-assessment shown.
  if (!deepgramEnabled || vercelPlan === "hobby") {
    await admin
      .from("station_recordings")
      .update({ status: "ai_graded" })
      .eq("id", recordingId);

    return NextResponse.json({ ok: true, skipped: "deepgram_disabled" });
  }

  // The actual pipeline (transcription + grading) can take several minutes —
  // longer than whatever caller is awaiting this fetch (e.g. the upload
  // route's after()). Acknowledge now and do the real work in our own
  // after(), which gets this route's full maxDuration independent of the
  // caller's budget, so a slow grading run can't get severed mid-flight.
  after(async () => {
    const { data: station } = await admin
      .from("stations")
      .select(
        "title, dilemma, reason_for_consultation, pmh, medications_and_allergies, recent_notes, opening_statement, if_asked_further, only_if_asked, social_history, ice_ideas, ice_concerns, ice_expectations, question_for_doctor, data_gathering, management, skill_notes, marking_notes_data_gathering, marking_notes_clinical_management, marking_notes_relating_to_others"
      )
      .eq("number", recording.station_number)
      .single<{
        title: string;
        dilemma: string | null;
        reason_for_consultation: string;
        pmh: string[];
        medications_and_allergies: string[];
        recent_notes: string | null;
        opening_statement: string;
        if_asked_further: string;
        only_if_asked: string[];
        social_history: string;
        ice_ideas: string;
        ice_concerns: string;
        ice_expectations: string;
        question_for_doctor: string[] | null;
        data_gathering: string[];
        management: string[];
        skill_notes: Record<string, string> | null;
        marking_notes_data_gathering: string | null;
        marking_notes_clinical_management: string | null;
        marking_notes_relating_to_others: string | null;
      }>();

    // Load the pricing version once for all cost calculations in this run.
    const pricing = await getCurrentPricing(admin);

    try {
      let transcriptFormatted: string;
      let transcriptRaw: unknown;

      if (recording.transcript_formatted) {
        // A prior attempt already transcribed this (e.g. a retry after grading
        // failed) — reuse it instead of re-downloading and re-transcribing.
        console.log("[recordings/process] reusing existing transcript", recordingId);
        transcriptFormatted = recording.transcript_formatted;
        transcriptRaw = recording.transcript_raw;
      } else if (isSpike) {
        // Skip Deepgram — use sample consultation transcript
        transcriptFormatted = SPIKE_TRANSCRIPT;
        transcriptRaw = { spike: true };
      } else {
        // Download both audio files from storage
        const [{ data: doctorBlob }, { data: patientBlob }] = await Promise.all([
          admin.storage.from("consultation-recordings").download(recording.doctor_audio_path!),
          admin.storage.from("consultation-recordings").download(recording.patient_audio_path!),
        ]);

        if (!doctorBlob || !patientBlob) throw new Error("Could not download audio files");

        const [doctorBuf, patientBuf] = await Promise.all([
          doctorBlob.arrayBuffer().then(Buffer.from),
          patientBlob.arrayBuffer().then(Buffer.from),
        ]);

        // Transcribe both tracks in parallel
        const [doctorTx, patientTx] = await Promise.all([
          transcribeAudio(doctorBuf),
          transcribeAudio(patientBuf),
        ]);

        transcriptFormatted = buildTranscript(doctorTx.utterances, patientTx.utterances);
        transcriptRaw = { doctor: doctorTx.utterances, patient: patientTx.utterances };

        // Checkpoint the transcript as soon as it exists — if grading fails
        // below, a retry can skip straight past Deepgram to Claude instead
        // of re-downloading and re-transcribing audio it already has.
        await admin
          .from("station_recordings")
          .update({ transcript_formatted: transcriptFormatted, transcript_raw: transcriptRaw })
          .eq("id", recordingId);

        // Record Deepgram usage + cost for both tracks (fresh transcription
        // only — a retry reuses the transcript and does not re-bill Deepgram).
        if (pricing) {
          for (const [role, tx] of [["doctor", doctorTx], ["patient", patientTx]] as const) {
            const billable = deepgramBillableMinutes(tx.durationSec);
            const costUsd = deepgramCostUsd(billable, pricing);
            await admin.from("deepgram_usage").insert({
              recording_id: recordingId,
              role,
              audio_duration_s: tx.durationSec,
              billable_min: billable,
              model: DEEPGRAM_MODEL,
              request_id: tx.requestId,
              cost_usd: costUsd,
              cost_gbp: usdToGbp(costUsd, pricing),
              pricing_version_id: pricing.id,
            });
          }
        }
      }

      // Deepgram returns nothing (or near-nothing) for silent, inaudible, or
      // heavily mumbled audio. Grading from that would force Claude to
      // invent plausible-sounding scores and feedback with no real basis —
      // refuse instead, and let the fallback below leave it ungraded.
      const wordCount = transcriptFormatted.trim().split(/\s+/).filter(Boolean).length;
      if (wordCount < 15) {
        throw new Error(`Transcript too short to grade (${wordCount} words) — audio may be silent, unintelligible, or failed to capture.`);
      }

      // Build station context for the grading prompt
      const stationContext = [
        `Station: ${station?.title ?? `Station ${recording.station_number}`}`,
        station?.dilemma ? `The dilemma at the heart of this case (what the doctor must navigate): ${station.dilemma}` : null,
        station?.reason_for_consultation ? `Reason for consultation: ${station.reason_for_consultation}` : null,
        station?.pmh?.length ? `Past medical history: ${station.pmh.join("; ")}` : null,
        station?.medications_and_allergies?.length
          ? `Medications and allergies: ${station.medications_and_allergies.join("; ")}`
          : null,
        station?.recent_notes ? `Recent notes: ${station.recent_notes}` : null,
        station?.opening_statement ? `Opening: ${station.opening_statement}` : null,
        station?.if_asked_further ? `Further detail the patient can give if asked: ${station.if_asked_further}` : null,
        station?.only_if_asked?.length
          ? `Details the patient shares only if directly asked: ${station.only_if_asked.join("; ")}`
          : null,
        station?.social_history ? `Social history: ${station.social_history}` : null,
        station?.ice_ideas ? `Patient's ideas: ${station.ice_ideas}` : null,
        station?.ice_concerns ? `Patient's concerns: ${station.ice_concerns}` : null,
        station?.ice_expectations ? `Patient's expectations: ${station.ice_expectations}` : null,
        station?.question_for_doctor?.length ? `Questions the patient may ask the doctor: ${station.question_for_doctor.join("; ")}` : null,
        station?.data_gathering?.length
          ? `Key data gathering: ${station.data_gathering.join("; ")}`
          : null,
        station?.management?.length
          ? `Expected management: ${station.management.join("; ")}`
          : null,
        station?.marking_notes_data_gathering
          ? `Examiner notes (data gathering): ${station.marking_notes_data_gathering}`
          : null,
        station?.marking_notes_clinical_management
          ? `Examiner notes (clinical management): ${station.marking_notes_clinical_management}`
          : null,
        station?.marking_notes_relating_to_others
          ? `Examiner notes (relating to others): ${station.marking_notes_relating_to_others}`
          : null,
      ]
        .filter(Boolean)
        .join("\n");

      // Loaded per run so an edited question set takes effect immediately.
      const gradingSkills = skillGrading ? await loadGradingSkills(admin) : [];

      const { grades, model: gradeModel, tokens } = await gradeWithClaude(stationContext, transcriptFormatted, {
        customPrompt,
        skills: gradingSkills,
        stationNotes: (station?.skill_notes ?? {}) as Record<string, string>,
        model: gradingModel,
      });

      // The model graded the domains and answered the skill questions. Moving
      // the grade is arithmetic, so it happens here rather than being asked of
      // the model — that is what makes it consistent and tunable.
      const skillAnswers: SkillAnswer[] = Array.isArray(grades.skills_assessment?.skills)
        ? grades.skills_assessment.skills
        : [];

      const baseline = {
        data_gathering: grades.data_gathering as SkillGrade,
        clinical_management: grades.clinical_management as SkillGrade,
        relating_to_others: grades.relating_to_others as SkillGrade,
      };

      const adjusted =
        gradingSkills.length && skillAnswers.length
          ? applySkillAdjustment(baseline, skillAnswers, gradingSkills, skillConfig)
          : null;

      const finalGrades = adjusted?.final ?? baseline;

      // Domain comments and skill comments go through the same check: a quote
      // is just as unwelcome in either, and both are read by the candidate.
      const skillCommentKey = (skill: string) => `skill:${skill}`;
      const { fixed: repaired, tokens: repairTokens } = await repairQuotedComments(
        {
          comment_data_gathering: grades.comment_data_gathering,
          comment_clinical_management: grades.comment_clinical_management,
          comment_relating_to_others: grades.comment_relating_to_others,
          focus_for_next_time: grades.focus_for_next_time,
          ...Object.fromEntries(skillAnswers.map((a) => [skillCommentKey(a.skill), a.comment])),
        },
        transcriptFormatted,
        gradingModel
      );

      const comments = {
        data_gathering: repaired.comment_data_gathering ?? grades.comment_data_gathering,
        clinical_management: repaired.comment_clinical_management ?? grades.comment_clinical_management,
        relating_to_others: repaired.comment_relating_to_others ?? grades.comment_relating_to_others,
        focus: repaired.focus_for_next_time ?? grades.focus_for_next_time,
      };

      const finalSkillAnswers: SkillAnswer[] = skillAnswers.map((a) => ({
        ...a,
        comment: repaired[skillCommentKey(a.skill)] ?? a.comment,
      }));

      // Record Claude usage + cost. First grading call for a recording is
      // "grading"; any later call (a Retry AI run) is "retry".
      if (pricing) {
        const { count } = await admin
          .from("claude_usage")
          .select("id", { count: "exact", head: true })
          .eq("recording_id", recordingId)
          .eq("call_type", "grading");
        const callType = (count ?? 0) > 0 ? "retry" : "grading";
        const costUsd = claudeCostUsd(tokens, pricing);
        await admin.from("claude_usage").insert({
          recording_id: recordingId,
          call_type: callType,
          model: gradeModel,
          input_tokens: tokens.input_tokens,
          output_tokens: tokens.output_tokens,
          cache_creation_tokens: tokens.cache_creation_tokens,
          cache_read_tokens: tokens.cache_read_tokens,
          cost_usd: costUsd,
          cost_gbp: usdToGbp(costUsd, pricing),
          pricing_version_id: pricing.id,
        });

        // Billed separately so the cost of enforcing the no-quotes rule is
        // visible rather than buried in the grading line.
        if (repairTokens) {
          const repairUsd = claudeCostUsd(repairTokens, pricing);
          await admin.from("claude_usage").insert({
            recording_id: recordingId,
            call_type: "quote_repair",
            model: gradingModel,
            input_tokens: repairTokens.input_tokens,
            output_tokens: repairTokens.output_tokens,
            cache_creation_tokens: repairTokens.cache_creation_tokens,
            cache_read_tokens: repairTokens.cache_read_tokens,
            cost_usd: repairUsd,
            cost_gbp: usdToGbp(repairUsd, pricing),
            pricing_version_id: pricing.id,
          });
        }
      }

      // Save transcript + grades to DB. Status lands on "ai_graded", not the
      // examiner queue — the candidate has to explicitly Submit for GP Review
      // (which is what actually consumes one of their 20 credits) to enter it.
      await admin.from("station_recordings").update({
        transcript_formatted: transcriptFormatted,
        transcript_raw: transcriptRaw,
        // The grades shown on the report are post-adjustment.
        ai_data_gathering: finalGrades.data_gathering,
        ai_clinical_management: finalGrades.clinical_management,
        ai_relating_to_others: finalGrades.relating_to_others,
        ai_comment_data_gathering: comments.data_gathering,
        ai_comment_clinical_management: comments.clinical_management,
        ai_comment_relating_to_others: comments.relating_to_others,
        ai_focus_for_next_time: comments.focus,
        ai_graded_at: new Date().toISOString(),
        status: "ai_graded",
        // Null when skill grading is off, which is what keeps the report's
        // Skills Assessment section hidden for those recordings.
        skills_assessment: adjusted
          ? { skills: finalSkillAnswers, outcomes: adjusted.outcomes }
          : null,
        skills_graded_at: adjusted ? new Date().toISOString() : null,
        skills_framework_version: adjusted ? skillConfig.frameworkVersion : null,
        // What the model graded before the adjustment, so the layer's effect
        // stays measurable rather than folded invisibly into the final grade.
        ai_baseline_data_gathering: adjusted ? baseline.data_gathering : null,
        ai_baseline_clinical_management: adjusted ? baseline.clinical_management : null,
        ai_baseline_relating_to_others: adjusted ? baseline.relating_to_others : null,
        // Clear any failure recorded by a previous attempt.
        ai_error: null,
        ai_failed_at: null,
      }).eq("id", recordingId);

      // Count this toward the candidate's unlimited-but-soft-capped AI usage.
      const { data: accessRow } = await admin
        .from("user_access")
        .select("ai_uses_count")
        .eq("user_id", recording.doctor_user_id)
        .single<{ ai_uses_count: number }>();
      await admin
        .from("user_access")
        .update({ ai_uses_count: (accessRow?.ai_uses_count ?? 0) + 1 })
        .eq("user_id", recording.doctor_user_id);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Processing failed";
      console.error("[recordings/process]", msg);
      // Don't leave it stuck in processing — roll back so the candidate can
      // still choose to submit, even with no AI pre-assessment to show.
      // The failure reason is persisted alongside it: console logs are
      // per-deployment and short-lived, so without this a failed run is
      // indistinguishable from a successful one after the fact.
      await admin
        .from("station_recordings")
        .update({ status: "ai_graded", ai_error: msg.slice(0, 2000), ai_failed_at: new Date().toISOString() })
        .eq("id", recordingId);
    } finally {
      // Record Daily live-audio usage (group consultations only) and build the
      // immutable cost ledger — runs even if grading failed, since Deepgram and
      // Daily costs were still incurred.
      try {
        const usage = await getMeetingUsage(`sca-${recordingId}`);
        if (usage && usage.hasData && pricing) {
          // Rooms are always created audio-only, so they bill at the audio rate.
          const mode = "audio" as const;
          const costUsd = dailyCostUsd(usage.participantMinutes, mode, pricing) ?? 0;
          await admin.from("daily_usage").upsert(
            {
              recording_id: recordingId,
              participant_minutes: usage.participantMinutes,
              room_duration_s: usage.roomDurationSeconds,
              max_participants: usage.maxParticipants,
              billing_mode: mode,
              cost_usd: costUsd,
              cost_gbp: usdToGbp(costUsd, pricing),
              pricing_version_id: pricing.id,
            },
            { onConflict: "recording_id" }
          );
        }
      } catch (e) {
        console.error("[recordings/process] Daily usage capture failed:", e);
      }

      await buildConsultationLedger(admin, recordingId);
    }
  });

  return NextResponse.json({ ok: true, accepted: true });
}
