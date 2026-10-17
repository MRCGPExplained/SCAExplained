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

  const { data } = await admin
    .from("station_recordings")
    .select(
      "status, ai_data_gathering, ai_clinical_management, ai_relating_to_others, examiner_data_gathering, examiner_clinical_management, examiner_relating_to_others, sent_to_candidate_at, ai_error, doctor_audio_path, patient_audio_path, transcript_formatted"
    )
    .eq("id", recordingId)
    .or(`doctor_user_id.eq.${user.id},patient_user_id.eq.${user.id}`)
    .single();

  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Three of the columns above are read here and not shipped. The transcript is
  // what separates "transcribing" from "marking", but it is the entire
  // consultation — several thousand words a poller would re-download every few
  // seconds — and the storage paths are only needed for the one boolean below.
  // Existing callers destructure `status` alone, so the added fields are safe.
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
