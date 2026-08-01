import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { sendExaminerNotificationEmail } from "@/lib/email";

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
    "https://api.deepgram.com/v1/listen?model=nova-2&punctuate=true&utterances=true",
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
  transcript: string
): Promise<GradeResult> {
  const systemPrompt = `You are an experienced RCGP examiner assessing a GP registrar's SCA consultation.

Grade each domain using the official RCGP scale:
- CF (Clear Fail): Major safety concern or significant gaps. Patient potentially harmed.
- F (Fail): Below expected standard. Important elements missing but no immediate safety risk.
- P (Pass): Meets expected standard for a GP registrar at this stage.
- CP (Clear Pass): Clearly exceeds expected standard. Exceptional consultation.

Points per domain: Data Gathering & Diagnosis = 3pts max (CF=0, F=1, P=2, CP=3). Clinical Management = 4.5pts max (CF=0, F=1.5, P=3, CP=4.5). Relating to Others = 3pts max (CF=0, F=1, P=2, CP=3).

For any domain graded F or CF, write exactly 3 sentences of specific, developmental feedback. Reference a specific moment in the transcript where relevant. For P or CP domains, leave the comment as an empty string.

Respond ONLY with valid JSON — no markdown, no explanation:
{
  "data_gathering": "P",
  "clinical_management": "F",
  "relating_to_others": "CP",
  "comment_data_gathering": "",
  "comment_clinical_management": "Three sentence comment here.",
  "comment_relating_to_others": ""
}`;

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
  const text = (data.content?.[0]?.text ?? "").trim();

  try {
    return JSON.parse(text) as GradeResult;
  } catch {
    throw new Error(`Claude returned invalid JSON: ${text.slice(0, 200)}`);
  }
}

export async function POST(req: Request, { params }: RouteParams) {
  const { id: recordingId } = await params;

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
      doctor_audio_path: string;
      patient_audio_path: string;
      status: string;
    }>();

  if (!recording) return NextResponse.json({ error: "Recording not found" }, { status: 404 });
  if (recording.status !== "processing") {
    return NextResponse.json({ error: "Recording not in processing state" }, { status: 409 });
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
    // Download both audio files from storage
    const [{ data: doctorBlob }, { data: patientBlob }] = await Promise.all([
      admin.storage.from("consultation-recordings").download(recording.doctor_audio_path),
      admin.storage.from("consultation-recordings").download(recording.patient_audio_path),
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

    const transcriptFormatted = buildTranscript(doctorUtterances, patientUtterances);

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

    const grades = await gradeWithClaude(stationContext, transcriptFormatted);

    // Save transcript + grades to DB
    await admin.from("station_recordings").update({
      transcript_formatted: transcriptFormatted,
      transcript_raw: { doctor: doctorUtterances, patient: patientUtterances },
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
