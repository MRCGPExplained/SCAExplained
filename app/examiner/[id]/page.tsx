import { notFound, redirect } from "next/navigation";
import { getExaminer } from "@/lib/examiner-auth";
import { getSupabaseAdmin } from "@/lib/supabase";
import { loadAllSkillLabels, type SkillAnswer } from "@/lib/skill-framework";
import { mergedTurns } from "@/lib/transcript";
import { loadPresetMap } from "@/lib/examiner-presets-store";
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
  /** Deepgram's utterances, words and all. See lib/transcript. */
  transcript_raw: unknown;
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
  ai_error: string | null;
  doctor_audio_path: string | null;
  patient_audio_path: string | null;
  skills_assessment: { skills?: SkillAnswer[] } | null;
  examiner_skills_assessment: { skills?: SkillAnswer[] } | null;
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ExaminerReviewPage({ params }: PageProps) {
  const { id } = await params;

  const examiner = await getExaminer();
  if (!examiner) redirect("/examiner");

  const admin = getSupabaseAdmin();
  if (!admin) notFound();

  // site_settings is no longer read here: the AI pipeline button is offered on
  // every attempt, and the pipeline itself reports what happened if it can't run.
  const { data: rec } = await admin
    .from("station_recordings")
    .select("*")
    .eq("id", id)
    .single<RecordingFull>();

  if (!rec) notFound();

  let doctorAudioUrl: string | null = null;
  let patientAudioUrl: string | null = null;
  let voiceNoteUrl: string | null = null;

  const [doctorResult, patientResult, voiceResult] = await Promise.all([
    rec.doctor_audio_path
      ? admin.storage.from("consultation-recordings").createSignedUrl(rec.doctor_audio_path, 3600)
      : Promise.resolve({ data: null }),
    rec.patient_audio_path
      ? admin.storage.from("consultation-recordings").createSignedUrl(rec.patient_audio_path, 3600)
      : Promise.resolve({ data: null }),
    rec.examiner_voice_note_path
      ? admin.storage.from("consultation-recordings").createSignedUrl(rec.examiner_voice_note_path, 3600)
      : Promise.resolve({ data: null }),
  ]);

  doctorAudioUrl = doctorResult.data?.signedUrl ?? null;
  patientAudioUrl = patientResult.data?.signedUrl ?? null;
  voiceNoteUrl = voiceResult.data?.signedUrl ?? null;

  /*
    Turned into turns here rather than in the browser.

    The column is 60-70kB of Deepgram JSON — ids, channels, per-word
    confidences, and each utterance's text repeated outside its words. The
    turns are what the page actually renders, and they are smaller than the
    raw they come from, so doing this on the server both saves the parse and
    cuts the payload. Empty for a spike row or a recording transcribed before
    utterances were kept, and the client falls back to the formatted string.
  */
  const turns = mergedTurns(rec.transcript_raw);
  // Read here rather than fetched by the rail on mount, so the tick lists are
  // on the page in the first paint instead of appearing a beat later.
  const presets = await loadPresetMap(admin);

  /*
    The raw column is not sent on. `turns` replaces it, the client reads
    nothing else from it, and at 60-70kB it was the largest thing crossing the
    wire for a page that never opened it. Destructured away rather than
    overwritten with undefined, so the key is absent from the payload instead
    of present and empty.
  */
  const { transcript_raw: _unusedRaw, ...recordingForClient } = rec;
  void _unusedRaw;

  const aiSkills = rec.skills_assessment?.skills ?? [];
  // Retired skills included, so a report graded under an older question set
  // still shows a label rather than a bare key.
  const skillLabels = aiSkills.length ? await loadAllSkillLabels(admin) : {};

  return (
    <ExaminerReviewClient
      recording={recordingForClient}
      turns={turns}
      presets={presets}
      doctorAudioUrl={doctorAudioUrl}
      patientAudioUrl={patientAudioUrl}
      voiceNoteUrl={voiceNoteUrl}
      aiSkills={aiSkills}
      examinerSkills={rec.examiner_skills_assessment?.skills ?? null}
      skillLabels={skillLabels}
    />
  );
}
