import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase-case-bank";
import { getSupabaseAdmin } from "@/lib/supabase";
import { getExaminerFromCookie } from "@/lib/examiner-auth";
import DualTrackPlayer from "@/app/components/DualTrackPlayer";

export const dynamic = "force-dynamic";

const NAVY = "#333333";
const PASS_THRESHOLD = 7;

const GRADE_META: Record<string, { label: string; color: string; bg: string; pts: (d: string) => number }> = {
  CF: { label: "Clear Fail", color: "#B91C1C", bg: "rgba(239,68,68,0.09)", pts: () => 0 },
  F:  { label: "Fail",       color: "#92400E", bg: "rgba(245,158,11,0.09)", pts: (d) => d === "cm" ? 1.5 : 1 },
  P:  { label: "Pass",       color: "#166534", bg: "rgba(34,197,94,0.09)",  pts: (d) => d === "cm" ? 3 : 2 },
  CP: { label: "Clear Pass", color: "#1D4ED8", bg: "rgba(59,130,246,0.09)", pts: (d) => d === "cm" ? 4.5 : 3 },
};

const DOMAIN_MAX: Record<string, number> = { dg: 3, cm: 4.5, ro: 3 };

function GradePill({ grade }: { grade: string | null; domain: "dg" | "cm" | "ro" }) {
  if (!grade || !GRADE_META[grade]) return <span style={{ color: "rgba(51,51,51,0.3)" }}>—</span>;
  const meta = GRADE_META[grade];
  return (
    <span
      className="text-[11px] font-bold px-2.5 py-0.5 rounded-md"
      style={{ background: meta.bg, color: meta.color }}
    >
      {meta.label}
    </span>
  );
}

function ScoreBar({ pts, max }: { pts: number; max: number }) {
  const pct = Math.round((pts / max) * 100);
  return (
    <div style={{ background: "rgba(51,51,51,0.08)", borderRadius: 99, height: 7, overflow: "hidden" }}>
      <div style={{ width: `${pct}%`, height: "100%", background: "#F6D44B", borderRadius: 99 }} />
    </div>
  );
}

type RecordingDetail = {
  id: string;
  station_number: number;
  station_title: string;
  doctor_display_name: string;
  patient_display_name: string;
  started_at: string;
  ended_at: string | null;
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
  doctor_audio_path: string | null;
  patient_audio_path: string | null;
  sent_to_candidate_at: string | null;
  doctor_user_id: string;
  examiners: { name: string } | null;
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function RecordingDetailPage({ params }: PageProps) {
  const { id } = await params;

  const admin = getSupabaseAdmin();
  if (!admin) notFound();

  const examiner = await getExaminerFromCookie();

  let rec: RecordingDetail | null = null;
  let isDoctor = false;

  if (examiner) {
    const { data } = await admin
      .from("station_recordings")
      .select("*, examiners(name)")
      .eq("id", id)
      .single<RecordingDetail>();
    rec = data;
    isDoctor = true;
  } else {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    const { data } = await admin
      .from("station_recordings")
      .select("*, examiners(name)")
      .eq("id", id)
      .or(`doctor_user_id.eq.${user.id},patient_user_id.eq.${user.id}`)
      .single<RecordingDetail>();
    rec = data;
    if (rec) isDoctor = rec.doctor_user_id === user.id;
  }

  if (!rec) notFound();

  const isFinal = !!rec.sent_to_candidate_at;
  const showExaminerGrades = isFinal || !!examiner;

  const [voiceResult, doctorResult, patientResult] = await Promise.all([
    showExaminerGrades && rec.examiner_voice_note_path
      ? admin.storage.from("consultation-recordings").createSignedUrl(rec.examiner_voice_note_path, 3600)
      : Promise.resolve({ data: null }),
    rec.doctor_audio_path
      ? admin.storage.from("consultation-recordings").createSignedUrl(rec.doctor_audio_path, 3600)
      : Promise.resolve({ data: null }),
    rec.patient_audio_path
      ? admin.storage.from("consultation-recordings").createSignedUrl(rec.patient_audio_path, 3600)
      : Promise.resolve({ data: null }),
  ]);

  const voiceNoteUrl = voiceResult.data?.signedUrl ?? null;
  const doctorAudioUrl = doctorResult.data?.signedUrl ?? null;
  const patientAudioUrl = patientResult.data?.signedUrl ?? null;

  const grades = {
    dg: showExaminerGrades ? rec.examiner_data_gathering : rec.ai_data_gathering,
    cm: showExaminerGrades ? rec.examiner_clinical_management : rec.ai_clinical_management,
    ro: showExaminerGrades ? rec.examiner_relating_to_others : rec.ai_relating_to_others,
  };
  const comments = {
    dg: showExaminerGrades ? rec.examiner_comment_data_gathering : rec.ai_comment_data_gathering,
    cm: showExaminerGrades ? rec.examiner_comment_clinical_management : rec.ai_comment_clinical_management,
    ro: showExaminerGrades ? rec.examiner_comment_relating_to_others : rec.ai_comment_relating_to_others,
  };

  const dgPts = grades.dg ? GRADE_META[grades.dg]?.pts("dg") ?? null : null;
  const cmPts = grades.cm ? GRADE_META[grades.cm]?.pts("cm") ?? null : null;
  const roPts = grades.ro ? GRADE_META[grades.ro]?.pts("ro") ?? null : null;
  const total = dgPts !== null && cmPts !== null && roPts !== null ? dgPts + cmPts + roPts : null;
  const isPassing = total !== null && total >= PASS_THRESHOLD;

  const hasConsultation = isDoctor && (doctorAudioUrl || patientAudioUrl || rec.transcript_formatted);

  return (
    <div className="min-h-screen" style={{ background: "#F4F4F2" }}>
      <div className="max-w-[960px] mx-auto px-4 py-10">

        {/* Station header */}
        <div
          className="rounded-2xl px-5 py-4 mb-5 flex items-center justify-between gap-4"
          style={{ background: "white", border: "1px solid rgba(51,51,51,0.08)" }}
        >
          {/* Left: back */}
          {examiner ? (
            <Link
              href={`/examiner/${rec.id}`}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] font-semibold shrink-0"
              style={{ border: "1px solid rgba(51,51,51,0.12)", color: "rgba(51,51,51,0.6)", textDecoration: "none" }}
            >
              ← Back to Review
            </Link>
          ) : (
            <Link
              href="/recordings"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] font-semibold shrink-0"
              style={{ border: "1px solid rgba(51,51,51,0.12)", color: "rgba(51,51,51,0.6)", textDecoration: "none" }}
            >
              ← My Recordings
            </Link>
          )}

          {/* Centre: station identity */}
          <div className="flex flex-col items-center text-center min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-[0.08em] mb-0.5" style={{ color: "rgba(51,51,51,0.35)" }}>
              Station {rec.station_number}
            </span>
            <h1 className="font-bold text-[15px] leading-tight truncate max-w-[320px]" style={{ color: NAVY }}>
              {rec.station_title}
            </h1>
          </div>

          {/* Right: go to station */}
          <Link
            href={`/case-bank/${rec.station_number}`}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[12px] font-bold shrink-0"
            style={{ background: "#F6D44B", color: NAVY, textDecoration: "none" }}
          >
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
              <path d="M2.5 1.5L10.5 6L2.5 10.5V1.5Z" fill={NAVY} />
            </svg>
            Go to Station
          </Link>
        </div>

        {/* Metadata row */}
        <div className="flex items-center gap-4 text-[11px] mb-5 px-1 flex-wrap" style={{ color: "rgba(51,51,51,0.4)" }}>
          <span>{new Date(rec.started_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</span>
          <span>·</span>
          <span>Doctor: {rec.doctor_display_name}</span>
          {rec.examiners?.name && <><span>·</span><span>Marked by Dr {rec.examiners.name}</span></>}
        </div>

        {/* Provisional banner */}
        {!isFinal && !examiner && (
          <div
            className="rounded-xl px-4 py-3 mb-5 text-[12.5px]"
            style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", color: "#92400E" }}
          >
            <strong>Provisional scores only.</strong> Full examiner feedback is on its way — usually within 5 working days.
          </div>
        )}

        {/* Still processing */}
        {!grades.dg && rec.status === "processing" && (
          <div className="rounded-2xl p-8 text-center mb-5" style={{ background: "white", border: "1px solid rgba(51,51,51,0.08)" }}>
            <p className="text-[15px] font-semibold mb-1" style={{ color: NAVY }}>Processing your consultation…</p>
            <p className="text-[13px]" style={{ color: "rgba(51,51,51,0.5)" }}>Usually takes 2–3 minutes. Refresh this page to check.</p>
          </div>
        )}

        {/* ── Top row: score card + overall summary ── */}
        {total !== null && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">

            {/* Score card */}
            <div className="rounded-2xl p-6" style={{ background: "white", border: "1px solid rgba(51,51,51,0.08)" }}>
              <div className="text-[11px] font-bold uppercase tracking-[0.07em] mb-4" style={{ color: "rgba(51,51,51,0.4)" }}>
                Total Score
              </div>
              <div className="flex items-end gap-4 mb-5">
                <span className="font-extrabold leading-none" style={{ fontSize: 44, color: NAVY }}>
                  {total}
                  <span className="font-extrabold">/10.5</span>
                </span>
              </div>

              <div className="text-[11px] font-bold uppercase tracking-[0.07em] mb-3" style={{ color: "rgba(51,51,51,0.4)" }}>
                Score Distribution
              </div>
              <div className="flex flex-col gap-3">
                {([
                  { key: "dg", label: "Data Gathering", pts: dgPts, max: 3 },
                  { key: "cm", label: "Clinical Management", pts: cmPts, max: 4.5 },
                  { key: "ro", label: "Relating to Others", pts: roPts, max: 3 },
                ] as const).map(({ key, label, pts, max }) => (
                  <div key={key}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[12px] font-medium" style={{ color: "rgba(51,51,51,0.7)" }}>{label}</span>
                      <span className="text-[12px] font-bold tabular-nums" style={{ color: NAVY }}>{pts}/{max}</span>
                    </div>
                    {pts !== null && <ScoreBar pts={pts} max={max} />}
                  </div>
                ))}
              </div>
            </div>

            {/* Overall examiner summary */}
            {showExaminerGrades && (rec.examiner_overall_comment || voiceNoteUrl) ? (
              <div
                className="rounded-2xl p-6"
                style={{ background: "white", border: "1px solid rgba(51,51,51,0.08)" }}
              >
                <div className="text-[11px] font-bold uppercase tracking-[0.07em] mb-3" style={{ color: "#111111" }}>
                  Examiner&apos;s Overall Summary
                </div>
                {rec.examiner_overall_comment && (
                  <p className="text-[13.5px] leading-relaxed" style={{ color: "#111111" }}>
                    {rec.examiner_overall_comment}
                  </p>
                )}
                {voiceNoteUrl && (
                  <div className={rec.examiner_overall_comment ? "mt-4 pt-4" : ""} style={rec.examiner_overall_comment ? { borderTop: "1px solid rgba(51,51,51,0.07)" } : {}}>
                    <div className="text-[11px] mb-2" style={{ color: "rgba(51,51,51,0.4)" }}>Voice note</div>
                    <audio src={voiceNoteUrl} controls className="w-full" style={{ height: 40 }} />
                  </div>
                )}
              </div>
            ) : (
              /* placeholder keeps the grid balanced when there's no overall comment yet */
              <div />
            )}
          </div>
        )}

        {/* ── Domain cards ── */}
        {(grades.dg || grades.cm || grades.ro) && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {([
              { key: "dg", label: "Data Gathering & Diagnosis" },
              { key: "cm", label: "Clinical Management" },
              { key: "ro", label: "Relating to Others" },
            ] as const).map(({ key, label }) => (
              <div
                key={key}
                className="rounded-2xl p-5 flex flex-col gap-3"
                style={{ background: "white", border: "1px solid rgba(51,51,51,0.08)" }}
              >
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <span className="text-[13px] font-bold" style={{ color: NAVY }}>{label}</span>
                  <GradePill grade={grades[key]} domain={key} />
                </div>
                {comments[key] ? (
                  <p className="text-[12.5px] leading-relaxed" style={{ color: "rgba(51,51,51,0.7)" }}>
                    {comments[key]}
                  </p>
                ) : (
                  <p className="text-[12px] italic" style={{ color: "rgba(51,51,51,0.3)" }}>No comment yet.</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── View Consultation ── */}
        {hasConsultation && (
          <details
            className="rounded-2xl overflow-hidden"
            style={{ background: "white", border: "1px solid rgba(51,51,51,0.08)" }}
          >
            <summary
              className="px-5 py-4 cursor-pointer select-none flex items-center justify-center gap-2"
              style={{ listStyle: "none" }}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, opacity: 0.4 }}>
                <path d="M2 4h12M2 8h8M2 12h5" stroke={NAVY} strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span className="text-[12px] font-semibold" style={{ color: "rgba(51,51,51,0.5)" }}>View Consultation</span>
            </summary>

            <div style={{ borderTop: "1px solid rgba(51,51,51,0.07)" }}>
              {/* Audio */}
              {(doctorAudioUrl || patientAudioUrl) && (
                <div className="px-5 pt-5 pb-4">
                  <div className="text-[11px] font-bold uppercase tracking-[0.06em] mb-3" style={{ color: "rgba(51,51,51,0.4)" }}>
                    Consultation Audio
                  </div>
                  <DualTrackPlayer doctorUrl={doctorAudioUrl} patientUrl={patientAudioUrl} />
                </div>
              )}

              {/* Transcript */}
              {rec.transcript_formatted && (
                <div
                  className="px-5 pt-4 pb-5 flex flex-col gap-2.5"
                  style={doctorAudioUrl || patientAudioUrl ? { borderTop: "1px solid rgba(51,51,51,0.07)" } : {}}
                >
                  <div className="text-[11px] font-bold uppercase tracking-[0.06em] mb-1" style={{ color: "rgba(51,51,51,0.4)" }}>
                    Transcript
                  </div>
                  {rec.transcript_formatted.split("\n").filter(Boolean).map((line, i) => {
                    const m = line.match(/^(\[\d+:\d+\])\s*(Doctor|Patient):\s*(.*)$/);
                    if (!m) return <p key={i} className="text-[12.5px]" style={{ color: "rgba(51,51,51,0.6)" }}>{line}</p>;
                    const [, timestamp, speaker, speech] = m;
                    return (
                      <div key={i}>
                        <span className="text-[11px] mr-1.5 font-mono" style={{ color: "rgba(51,51,51,0.3)" }}>{timestamp}</span>
                        <span className="text-[12.5px] font-bold mr-1" style={{ color: NAVY }}>{speaker}:</span>
                        <span className="text-[12.5px]" style={{ color: "rgba(51,51,51,0.75)" }}>{speech}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </details>
        )}

      </div>
    </div>
  );
}
