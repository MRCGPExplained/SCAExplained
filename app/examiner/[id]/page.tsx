import { notFound, redirect } from "next/navigation";
import { getExaminerFromCookie } from "@/lib/examiner-auth";
import { getSupabaseAdmin } from "@/lib/supabase";
import ExaminerReviewClient from "./ExaminerReviewClient";

export const dynamic = "force-dynamic";

type RecordingFull = {
  id: string;
  station_number: number;
  station_title: string;
  doctor_display_name: string;
  patient_display_name: string;
  started_at: string;
  status: string;
  transcript_formatted: string | null;
  ai_data_gathering: string | null;
  ai_clinical_management: string | null;
  ai_relating_to_others: string | null;
  ai_comment_data_gathering: string | null;
  ai_comment_clinical_management: string | null;
  ai_comment_relating_to_others: string | null;
  examiner_data_gathering: string | null;
  examiner_clinical_management: string | null;
  examiner_relating_to_others: string | null;
  examiner_comment_data_gathering: string | null;
  examiner_comment_clinical_management: string | null;
  examiner_comment_relating_to_others: string | null;
  examiner_overall_comment: string | null;
  examiner_voice_note_path: string | null;
  sent_to_candidate_at: string | null;
  doctor_audio_path: string | null;
  patient_audio_path: string | null;
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ExaminerReviewPage({ params }: PageProps) {
  const { id } = await params;

  const examiner = await getExaminerFromCookie();
  if (!examiner) redirect("/examiner/login");

  const admin = getSupabaseAdmin();
  if (!admin) notFound();

  const { data: rec } = await admin
    .from("station_recordings")
    .select("*")
    .eq("id", id)
    .single<RecordingFull>();

  if (!rec) notFound();

  let doctorAudioUrl: string | null = null;
  let patientAudioUrl: string | null = null;

  if (rec.doctor_audio_path) {
    const { data } = await admin.storage
      .from("consultation-recordings")
      .createSignedUrl(rec.doctor_audio_path, 3600);
    doctorAudioUrl = data?.signedUrl ?? null;
  }
  if (rec.patient_audio_path) {
    const { data } = await admin.storage
      .from("consultation-recordings")
      .createSignedUrl(rec.patient_audio_path, 3600);
    patientAudioUrl = data?.signedUrl ?? null;
  }

  return (
    <ExaminerReviewClient
      recording={rec}
      doctorAudioUrl={doctorAudioUrl}
      patientAudioUrl={patientAudioUrl}
    />
  );
}
