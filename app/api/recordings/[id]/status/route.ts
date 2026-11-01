import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-case-bank";
import { getSupabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_req: Request, { params }: RouteParams) {
  const { id: recordingId } = await params;

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });

  const admin = getSupabaseAdmin();
  if (!admin) return NextResponse.json({ error: "Config error" }, { status: 500 });

  /*
    No grade columns. This route admits the doctor OR the patient, so every
    column it ships is readable by both of them, and the six grade columns were
    one person's mark being handed to the person they practised with — on the
    wire, four times a minute, while the row that deliberately withholds those
    same grades renders on screen. No caller ever read them: RecordingProgress
    types status/has_transcript/audio_complete, the two betatest pollers
    destructure status alone, and the study room declared ai_data_gathering
    without reading it.
  */
  const { data } = await admin
    .from("station_recordings")
    .select(
      "status, sent_to_candidate_at, ai_error, doctor_audio_path, patient_audio_path, transcript_formatted"
    )
    .eq("id", recordingId)
    .or(`doctor_user_id.eq.${user.id},patient_user_id.eq.${user.id}`)
    .single();

  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Three of the columns above are read here and not shipped. The transcript is
  // what separates "transcribing" from "marking", but it is the entire
  // consultation — several thousand words a poller would re-download every few
  // seconds — and the storage paths are only needed for the one boolean below.
  const { transcript_formatted, doctor_audio_path, patient_audio_path, ...rest } = data as typeof data & {
    transcript_formatted: string | null;
    doctor_audio_path: string | null;
    patient_audio_path: string | null;
  };

  return NextResponse.json({
    ...rest,
    has_transcript: !!transcript_formatted,
    // Both tracks have to land before the pipeline starts, so a candidate who
    // has uploaded is still "uploading" until their partner has too.
    audio_complete: !!doctor_audio_path && !!patient_audio_path,
  });
}
