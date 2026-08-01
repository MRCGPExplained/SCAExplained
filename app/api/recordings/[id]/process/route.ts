import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { sendExaminerNotificationEmail } from "@/lib/email";
import { DEFAULT_SYSTEM_PROMPT } from "@/lib/ai-defaults";

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
}

interface DeepgramUtterance {
  start: number;
  end: number;
  transcript: string;
}

interface DeepgramResponse {
  results?: {
    utterances?: DeepgramUtterance[];
    channels?: Array<{
      alternatives?: Array<{ transcript: string }>;
    }>;
  };
}

// Deepgram transcription for a single audio file
async function transcribeAudio(audioBuffer: Buffer): Promise<DeepgramUtterance[]> {
  const res = await fetch(
    "https://api.deepgram.com/v1/listen?model=nova-2-medical&punctuate=true&utterances=true",
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
  return data?.results?.utterances ?? [];
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


// Grade the consultation with Claude
async function gradeWithClaude(
  stationContext: string,
  transcript: string,
  customPrompt?: string
): Promise<GradeResult> {
  const systemPrompt = customPrompt?.trim() || DEFAULT_SYSTEM_PROMPT;

  const userMessage = `STATION CONTEXT:\n${stationContext}\n\nCONSULTATION TRANSCRIPT:\n${transcript}\n\nPlease grade this consultation.`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": process.env.ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 600,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Claude ${res.status}: ${body}`);
  }

  const data = await res.json();
  const raw = (data.content?.[0]?.text ?? "").trim();
  // Strip markdown code fences Claude sometimes adds despite instructions
  const text = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();

  try {
    return JSON.parse(text) as GradeResult;
  } catch {
    throw new Error(`Claude returned invalid JSON: ${text.slice(0, 200)}`);
  }
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
    .select("id, station_number, doctor_audio_path, patient_audio_path, status")
    .eq("id", recordingId)
    .single<{
      id: string;
      station_number: number;
      doctor_audio_path: string | null;
      patient_audio_path: string | null;
      status: string;
    }>();

  if (!recording) return NextResponse.json({ error: "Recording not found" }, { status: 404 });
  if (recording.status !== "processing") {
    return NextResponse.json({ error: "Recording not in processing state" }, { status: 409 });
  }

  // Fetch runtime settings once
  const { data: settingsRows } = await admin
    .from("site_settings")
    .select("key, value")
    .in("key", ["deepgram_enabled", "ai_grading_prompt", "vercel_plan"]);

  const settingsMap = new Map(
    ((settingsRows ?? []) as { key: string; value: string }[]).map((r) => [r.key, r.value])
  );
  const deepgramEnabled = settingsMap.get("deepgram_enabled") === "true"; // must be explicitly on
  const vercelPlan = settingsMap.get("vercel_plan") ?? "pro"; // default pro
  const customPrompt = settingsMap.get("ai_grading_prompt") ?? undefined;

  console.log(`[recordings/process] settings: deepgramEnabled=${deepgramEnabled} vercelPlan=${vercelPlan} settingsRows=${JSON.stringify(settingsRows)}`);

  // If Deepgram is disabled, skip pipeline and send straight to examiner queue
  if (!deepgramEnabled || vercelPlan === "hobby") {
    console.log(`[recordings/process] early return: deepgramEnabled=${deepgramEnabled} vercelPlan=${vercelPlan}`);
    await admin
      .from("station_recordings")
      .update({ status: "pending_examiner" })
      .eq("id", recordingId);

    const { data: recRow } = await admin
      .from("station_recordings")
      .select("station_number, station_title, doctor_display_name")
      .eq("id", recordingId)
      .single<{ station_number: number; station_title: string; doctor_display_name: string }>();

    if (recRow) {
      const { data: examiners } = await admin.from("examiners").select("name, email");
      await Promise.all(
        (examiners ?? []).map((ex: { name: string; email: string }) =>
          sendExaminerNotificationEmail({
            to: ex.email,
            examinerName: ex.name,
            candidateName: recRow.doctor_display_name,
            stationNumber: recRow.station_number,
            stationTitle: recRow.station_title,
          })
        )
      );
    }

    return NextResponse.json({ ok: true, skipped: "deepgram_disabled" });
  }

  const { data: station } = await admin
    .from("stations")
    .select(
      "title, opening_statement, ice_ideas, ice_concerns, ice_expectations, role_player_instruction, data_gathering, management, marking_notes_data_gathering, marking_notes_clinical_management, marking_notes_relating_to_others"
    )
    .eq("number", recording.station_number)
    .single<{
      title: string;
      opening_statement: string;
      ice_ideas: string;
      ice_concerns: string;
      ice_expectations: string;
      role_player_instruction: string | null;
      data_gathering: string[];
      management: string[];
      marking_notes_data_gathering: string | null;
      marking_notes_clinical_management: string | null;
      marking_notes_relating_to_others: string | null;
    }>();

  try {
    let transcriptFormatted: string;
    let transcriptRaw: unknown;

    if (isSpike) {
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
      const [doctorUtterances, patientUtterances] = await Promise.all([
        transcribeAudio(doctorBuf),
        transcribeAudio(patientBuf),
      ]);

      transcriptFormatted = buildTranscript(doctorUtterances, patientUtterances);
      transcriptRaw = { doctor: doctorUtterances, patient: patientUtterances };
    }

    // Build station context for the grading prompt
    const stationContext = [
      `Station: ${station?.title ?? `Station ${recording.station_number}`}`,
      station?.opening_statement ? `Opening: ${station.opening_statement}` : null,
      station?.ice_ideas ? `Patient's ideas: ${station.ice_ideas}` : null,
      station?.ice_concerns ? `Patient's concerns: ${station.ice_concerns}` : null,
      station?.data_gathering?.length
        ? `Key data gathering: ${station.data_gathering.join("; ")}`
        : null,
      station?.management?.length
        ? `Expected management: ${station.management.join("; ")}`
        : null,
      station?.role_player_instruction
        ? `Role player notes: ${station.role_player_instruction}`
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

    const grades = await gradeWithClaude(stationContext, transcriptFormatted, customPrompt);

    // Save transcript + grades to DB
    await admin.from("station_recordings").update({
      transcript_formatted: transcriptFormatted,
      transcript_raw: transcriptRaw,
      ai_data_gathering: grades.data_gathering,
      ai_clinical_management: grades.clinical_management,
      ai_relating_to_others: grades.relating_to_others,
      ai_comment_data_gathering: grades.comment_data_gathering,
      ai_comment_clinical_management: grades.comment_clinical_management,
      ai_comment_relating_to_others: grades.comment_relating_to_others,
      ai_graded_at: new Date().toISOString(),
      status: "pending_examiner",
    }).eq("id", recordingId);

    // Notify all examiners
    const { data: recRow } = await admin
      .from("station_recordings")
      .select("station_number, station_title, doctor_display_name")
      .eq("id", recordingId)
      .single<{ station_number: number; station_title: string; doctor_display_name: string }>();

    if (recRow) {
      const { data: examiners } = await admin
        .from("examiners")
        .select("name, email");

      await Promise.all(
        (examiners ?? []).map((ex: { name: string; email: string }) =>
          sendExaminerNotificationEmail({
            to: ex.email,
            examinerName: ex.name,
            candidateName: recRow.doctor_display_name,
            stationNumber: recRow.station_number,
            stationTitle: recRow.station_title,
          })
        )
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Processing failed";
    console.error("[recordings/process]", msg);
    // Don't leave it stuck in processing — roll back so examiner can still review
    await admin.from("station_recordings").update({ status: "pending_examiner" }).eq("id", recordingId);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
