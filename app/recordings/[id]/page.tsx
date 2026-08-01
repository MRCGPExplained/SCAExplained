import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase-case-bank";
import { getSupabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const NAVY = "#1A1B52";

const GRADE_META: Record<string, { label: string; color: string; bg: string; pts: (d: string) => number }> = {
  CF: { label: "Clear Fail", color: "#B91C1C", bg: "rgba(239,68,68,0.09)", pts: () => 0 },
  F:  { label: "Fail",       color: "#92400E", bg: "rgba(245,158,11,0.09)", pts: (d) => d === "cm" ? 1.5 : 1 },
  P:  { label: "Pass",       color: "#166534", bg: "rgba(34,197,94,0.09)",  pts: (d) => d === "cm" ? 3 : 2 },
  CP: { label: "Clear Pass", color: "#1D4ED8", bg: "rgba(59,130,246,0.09)", pts: (d) => d === "cm" ? 4.5 : 3 },
};

function GradeBadge({ grade, domain }: { grade: string | null; domain: "dg" | "cm" | "ro" }) {
  if (!grade || !GRADE_META[grade]) return <span style={{ color: "rgba(26,27,82,0.3)" }}>—</span>;
  const meta = GRADE_META[grade];
  return (
    <span
      className="inline-flex items-center gap-1.5 text-[12px] font-bold px-3 py-1 rounded-lg"
      style={{ background: meta.bg, color: meta.color }}
    >
      {grade}
      <span className="font-normal text-[11px]">{meta.label}</span>
      <span className="opacity-60 text-[10px]">({meta.pts(domain)} pts)</span>
    </span>
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
  sent_to_candidate_at: string | null;
  doctor_user_id: string;
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function RecordingDetailPage({ params }: PageProps) {
  const { id } = await params;

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = getSupabaseAdmin();
  if (!admin) notFound();

  const { data: rec } = await admin
    .from("station_recordings")
    .select("*")
    .eq("id", id)
    .or(`doctor_user_id.eq.${user.id},patient_user_id.eq.${user.id}`)
    .single<RecordingDetail>();

  if (!rec) notFound();

  const isFinal = !!rec.sent_to_candidate_at;
  const isDoctor = rec.doctor_user_id === user.id;

  // Use examiner grades if sent, otherwise AI provisional
  const grades = {
    dg: isFinal ? rec.examiner_data_gathering : rec.ai_data_gathering,
    cm: isFinal ? rec.examiner_clinical_management : rec.ai_clinical_management,
    ro: isFinal ? rec.examiner_relating_to_others : rec.ai_relating_to_others,
  };
  const comments = {
    dg: isFinal ? rec.examiner_comment_data_gathering : rec.ai_comment_data_gathering,
    cm: isFinal ? rec.examiner_comment_clinical_management : rec.ai_comment_clinical_management,
    ro: isFinal ? rec.examiner_comment_relating_to_others : rec.ai_comment_relating_to_others,
  };

  const dgPts = grades.dg ? GRADE_META[grades.dg]?.pts("dg") ?? null : null;
  const cmPts = grades.cm ? GRADE_META[grades.cm]?.pts("cm") ?? null : null;
  const roPts = grades.ro ? GRADE_META[grades.ro]?.pts("ro") ?? null : null;
  const total = dgPts !== null && cmPts !== null && roPts !== null ? dgPts + cmPts + roPts : null;

  return (
    <div className="min-h-screen" style={{ background: "#F3F2FB" }}>
      <div className="max-w-[760px] mx-auto px-4 py-10">

        <div className="mb-6">
          <Link href="/recordings" className="text-[12px] font-semibold" style={{ color: "rgba(26,27,82,0.45)", textDecoration: "none" }}>
            ← My Recordings
          </Link>
        </div>

        {/* Station header */}
        <div
          className="rounded-2xl p-6 mb-5"
          style={{ background: NAVY, color: "white" }}
        >
          <div className="text-[11px] font-bold uppercase tracking-[0.07em] mb-1 opacity-50">
            Station {rec.station_number}
          </div>
          <h1 className="font-display font-extrabold text-[22px] mb-3">{rec.station_title}</h1>
          <div className="flex items-center gap-4 text-[12px] opacity-60 flex-wrap">
            <span>{new Date(rec.started_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</span>
            <span>Doctor: {rec.doctor_display_name}</span>
            <span>Patient: {rec.patient_display_name}</span>
          </div>
        </div>

        {/* Provisional banner */}
        {!isFinal && (
          <div
            className="rounded-xl px-4 py-3 mb-5 text-[12.5px]"
            style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", color: "#92400E" }}
          >
            <strong>Provisional scores only.</strong> Full examiner feedback is on its way — usually within 5 working days.
          </div>
        )}

        {/* Score summary */}
        {total !== null && (
          <div
            className="rounded-2xl p-5 mb-5"
            style={{ background: "white", border: "1px solid rgba(26,27,82,0.08)" }}
          >
            <div className="text-[11px] font-bold uppercase tracking-[0.06em] mb-4" style={{ color: "rgba(26,27,82,0.4)" }}>
              {isFinal ? "Examiner Report" : "Provisional AI Grades"}
            </div>

            <div className="flex flex-col gap-4">
              {([
                { key: "dg", label: "Data Gathering & Diagnosis", max: "3 pts" },
                { key: "cm", label: "Clinical Management", max: "4.5 pts" },
                { key: "ro", label: "Relating to Others", max: "3 pts" },
              ] as const).map(({ key, label, max }) => (
                <div key={key}>
                  <div className="flex items-center justify-between mb-1.5 flex-wrap gap-2">
                    <div>
                      <span className="text-[13px] font-semibold" style={{ color: NAVY }}>{label}</span>
                      <span className="text-[11px] ml-2" style={{ color: "rgba(26,27,82,0.4)" }}>(max {max})</span>
                    </div>
                    <GradeBadge grade={grades[key]} domain={key} />
                  </div>
                  {comments[key] && (
                    <p className="text-[13px] leading-relaxed mt-1 pl-1" style={{ color: "rgba(26,27,82,0.7)" }}>
                      {comments[key]}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div
              className="mt-5 pt-4 flex items-center justify-between"
              style={{ borderTop: "1px solid rgba(26,27,82,0.07)" }}
            >
              <span className="text-[13px] font-semibold" style={{ color: "rgba(26,27,82,0.5)" }}>Station total</span>
              <span className="font-bold text-[18px]" style={{ color: NAVY }}>{total} / 10.5 pts</span>
            </div>
          </div>
        )}

        {/* Overall examiner comment */}
        {isFinal && rec.examiner_overall_comment && (
          <div
            className="rounded-2xl p-5 mb-5"
            style={{ background: "white", border: "1px solid rgba(26,27,82,0.08)" }}
          >
            <div className="text-[11px] font-bold uppercase tracking-[0.06em] mb-3" style={{ color: "rgba(26,27,82,0.4)" }}>
              Overall Examiner Comment
            </div>
            <p className="text-[13.5px] leading-relaxed" style={{ color: NAVY }}>
              {rec.examiner_overall_comment}
            </p>
          </div>
        )}

        {/* Transcript */}
        {isDoctor && rec.transcript_formatted && (
          <div
            className="rounded-2xl p-5"
            style={{ background: "white", border: "1px solid rgba(26,27,82,0.08)" }}
          >
            <div className="text-[11px] font-bold uppercase tracking-[0.06em] mb-4" style={{ color: "rgba(26,27,82,0.4)" }}>
              Transcript
            </div>
            <pre
              className="text-[12.5px] leading-relaxed whitespace-pre-wrap"
              style={{ color: "rgba(26,27,82,0.75)", fontFamily: "inherit" }}
            >
              {rec.transcript_formatted}
            </pre>
          </div>
        )}

        {/* Still processing */}
        {!grades.dg && rec.status === "processing" && (
          <div
            className="rounded-2xl p-8 text-center"
            style={{ background: "white", border: "1px solid rgba(26,27,82,0.08)" }}
          >
            <p className="text-[15px] font-semibold mb-1" style={{ color: NAVY }}>Processing your consultation…</p>
            <p className="text-[13px]" style={{ color: "rgba(26,27,82,0.5)" }}>Usually takes 2–3 minutes. Refresh this page to check.</p>
          </div>
        )}

      </div>
    </div>
  );
}
