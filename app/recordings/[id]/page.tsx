import { notFound, redirect } from "next/navigation";
import { PredictedScore } from "@/app/components/PredictedScore";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase-case-bank";
import { getSupabaseAdmin } from "@/lib/supabase";
import { getExaminer } from "@/lib/examiner-auth";
import { loadAllSkillLabels, CAP_CEILING, type SkillAnswer, type SkillsAssessment } from "@/lib/skill-framework";
import { DOMAIN_LABEL as CASE_DOMAIN_LABEL, type FiredRule } from "@/lib/case-rules";
import ConsultationPlayer from "@/app/components/ConsultationPlayer";
import { SubmitForReviewButton } from "@/app/recordings/SubmitForReviewButton";
import { AiReportFeedbackLink } from "@/app/recordings/AiReportFeedbackModal";
import { TimeAssessment, type TranscriptRaw } from "@/app/recordings/TimeAssessment";

const NAVY = "#333333";

const GRADE_META: Record<string, { label: string; color: string; bg: string; pts: (d: string) => number }> = {
  CF: { label: "Clear Fail", color: "#B91C1C", bg: "rgba(239,68,68,0.09)", pts: () => 0 },
  F:  { label: "Fail",       color: "#92400E", bg: "rgba(245,158,11,0.09)", pts: (d) => d === "cm" ? 1.5 : 1 },
  P:  { label: "Pass",       color: "#166534", bg: "rgba(34,197,94,0.09)",  pts: (d) => d === "cm" ? 3 : 2 },
  CP: { label: "Clear Pass", color: "#1D4ED8", bg: "rgba(59,130,246,0.09)", pts: (d) => d === "cm" ? 4.5 : 3 },
};

const DOMAIN_MAX: Record<string, number> = { dg: 3, cm: 4.5, ro: 3 };

// Deliberately shows the rating only. The underlying weak/moderate/strong
// domain influences stay internal — they are tuning data, not something a
// candidate should be reading as a second scoring system.
const SKILL_RATING_META: Record<string, { label: string; color: string; bg: string }> = {
  good: { label: "Good", color: "#166534", bg: "rgba(34,197,94,0.10)" },
  needs_improvement: { label: "Needs Improvement", color: "#92400E", bg: "rgba(245,158,11,0.12)" },
  not_assessable: { label: "Not Assessable", color: "rgba(51,51,51,0.5)", bg: "rgba(51,51,51,0.06)" },
  // Retired three-band ratings, kept so recordings graded under the old
  // framework still render a label rather than a raw key.
  excellent: { label: "Excellent", color: "#1D4ED8", bg: "rgba(59,130,246,0.10)" },
  satisfactory: { label: "Satisfactory", color: "#166534", bg: "rgba(34,197,94,0.10)" },
};



/**
 * The badge beside each domain.
 *
 * Two vocabularies, because two different things are speaking. A GP who has
 * listened to the consultation says Clear Pass or Clear Fail and means it.
 * A model estimating from a transcript should not: the difference between
 * Pass and Clear Pass is a finer judgement than it can reliably support, and
 * "Clear Fail" in a red badge is a verdict, delivered by something that was
 * guessing.
 *
 * So an AI report collapses to Good / Needs Improvement — which is not new
 * vocabulary, it is the one the Skills Assessment on this same page already
 * uses, down to the colours. Half the report speaking in soft bands while
 * the other half hands down Clear Fail was the thing that read wrong.
 *
 * The underlying CF/F/P/CP is untouched: it is what gets stored, what the
 * points are computed from, and what the Score Distribution and the predicted
 * total still show. The detail stays; only the verdict softens. Someone who
 * wants the band can read it off the points, and that is fine — a number in
 * a breakdown is data, a badge is a judgement, and it was the judgement that
 * was overclaiming.
 */
function GradePill({ grade, estimate }: { grade: string | null; domain: "dg" | "cm" | "ro"; estimate: boolean }) {
  if (!grade || !GRADE_META[grade]) return <span style={{ color: "rgba(51,51,51,0.3)" }}>—</span>;

  const meta = estimate
    ? grade === "P" || grade === "CP"
      ? SKILL_RATING_META.good
      : SKILL_RATING_META.needs_improvement
    : GRADE_META[grade];

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
  transcript_raw: TranscriptRaw | null;
  room_id: string | null;
  patient_user_id: string | null;
  ai_data_gathering: string | null;
  ai_clinical_management: string | null;
  ai_relating_to_others: string | null;
  ai_comment_data_gathering: string | null;
  ai_comment_clinical_management: string | null;
  ai_comment_relating_to_others: string | null;
  ai_focus_for_next_time: string | null;
  examiner_data_gathering: string | null;
  examiner_clinical_management: string | null;
  examiner_relating_to_others: string | null;
  examiner_comment_data_gathering: string | null;
  examiner_comment_clinical_management: string | null;
  examiner_comment_relating_to_others: string | null;
  examiner_overall_comment: string | null;
  skills_assessment: unknown;
  case_rules_fired: unknown;
  examiner_skills_assessment: unknown;
  ai_baseline_data_gathering: string | null;
  ai_baseline_clinical_management: string | null;
  ai_baseline_relating_to_others: string | null;
  examiner_voice_note_path: string | null;
  doctor_audio_path: string | null;
  patient_audio_path: string | null;
  sent_to_candidate_at: string | null;
  candidate_viewed_at: string | null;
  doctor_user_id: string;
  examiners: { name: string } | null;
};

export const dynamic = "force-dynamic";

/**
 * The report, as a page.
 *
 * It was briefly an overlay as well, opened over the study room through an
 * intercepting route. That is gone. The problem it was built for — reports
 * opened in a NEW TAB, which left you with two tabs and a dead room in one
 * of them — is answered by this page being reached with an ordinary in-app
 * link. The room survives that, because StudyRoomProvider is mounted in the
 * root layout and not under any page.
 *
 * What the overlay added beyond that was a kept scroll position and no page
 * transition. What it cost: a parallel-route slot that outlived its own
 * route and had to be dismissed by hand, a stacking context that hid the
 * study room dock underneath it, and that dock's own link becoming a dead
 * end. Not worth it for two conveniences.
 */
export default async function RecordingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const admin = getSupabaseAdmin();
  if (!admin) notFound();

  const examiner = await getExaminer();

  /*
    Who is actually looking, resolved once and the same way for everyone.

    `isDoctor` below is set to true for any examiner on any report. That is
    not a claim about who recorded this consultation — it unlocks the
    privileged view — so nothing that needs to know whose consultation this
    IS may ask it. That distinction had no name, and the read-marker asked
    the wrong one: a GP who is also a customer never cleared their own
    unread badge, because being an examiner cancelled out being the
    candidate on their own recording.
  */
  const supabase = await createSupabaseServerClient();
  const { data: { user: viewer } } = await supabase.auth
    .getUser()
    .catch(() => ({ data: { user: null } }));

  let rec: RecordingDetail | null = null;
  let isDoctor = false;

  if (examiner) {
    const { data } = await admin
      .from("station_recordings")
      .select("*, examiners!station_recordings_examiner_id_fkey(name)")
      .eq("id", id)
      .single<RecordingDetail>();
    rec = data;
    isDoctor = true;
  } else {
    const { data } = await admin
      .from("station_recordings")
      .select("*, examiners!station_recordings_examiner_id_fkey(name)")
      .eq("id", id)
      .single<RecordingDetail>();
    rec = data;
    if (rec && viewer) isDoctor = rec.doctor_user_id === viewer.id;
  }

  if (!rec) notFound();

  /** Whose consultation this is. Never forged, unlike isDoctor above. */
  const viewerIsDoctor = !!viewer && rec.doctor_user_id === viewer.id;

  /*
    A report is readable by whoever has the link.

    Brandon's call. The people in it are colleagues role-playing a written
    case, not patients, and he does not consider a simulated consultation
    between two trainees sensitive. So there is no gate here: the id is the
    permission, the way an unlisted video link is.

    What that means, stated plainly because it is easy to forget later: a
    report URL is public to anyone who ends up holding it, signed in or not,
    for as long as the recording exists. It carries both display names and
    the marking. Sharing the link shares all of it, and there is no way to
    take it back short of deleting the recording.

    Submitting for GP review stays the candidate's alone — see below.
  */

  const isRealCandidate = !examiner && isDoctor;
  let hasAiReportFeedback = false;
  if (isRealCandidate && rec.status === "ai_graded") {
    const { data: feedback } = await admin
      .from("ai_report_feedback")
      .select("id")
      .eq("recording_id", rec.id)
      .maybeSingle();
    hasAiReportFeedback = !!feedback;
  }

  const skillsAssessment = rec.skills_assessment as SkillsAssessment | null;
  const aiSkills: SkillAnswer[] = Array.isArray(skillsAssessment?.skills) ? skillsAssessment.skills : [];
  // A GP's edits win over the model's, the same way examiner_* domain grades
  // win over ai_*. The AI's version stays in its own column either way.
  const examinerSkills = rec.examiner_skills_assessment as SkillsAssessment | null;
  const skills: SkillAnswer[] = Array.isArray(examinerSkills?.skills) && examinerSkills.skills.length
    ? examinerSkills.skills
    : aiSkills;
  const firedRules: FiredRule[] = Array.isArray(rec.case_rules_fired) ? rec.case_rules_fired : [];
  // Includes retired skills so an old recording still shows a proper label.
  const skillLabels = skills.length ? await loadAllSkillLabels(admin) : {};

  const isFinal = !!rec.sent_to_candidate_at;
  const hasExaminerGrades = !!(rec.examiner_data_gathering && rec.examiner_clinical_management && rec.examiner_relating_to_others);
  const showExaminerGrades = isFinal || hasExaminerGrades;

  /*
    Mark as read the first time the CANDIDATE sees the finalised report.

    This was "!examiner", which meant the candidate back when the page was
    gated to them. It no longer does: a report opens for whoever holds the
    link, so the patient, an observer, or a chat app fetching a link preview
    would all have cleared the unread marker on somebody else's report and the
    candidate would never have known it had arrived.

    Then it was `isRealCandidate`, which is `!examiner && isDoctor` — and that
    went wrong the other way. Being a GP reviewer cancelled out being the
    candidate, so anyone who is both never cleared their own envelope: they
    opened the report, nothing was stamped, and the badge came back every
    time. Both the people reviewing for this product are also customers of it.

    The question is only ever "is this my consultation", which is what
    viewerIsDoctor answers. An examiner opening someone else's report fails
    it honestly, which is all `!examiner` was ever there to achieve.
  */
  if (viewerIsDoctor && isFinal && (!rec.candidate_viewed_at || new Date(rec.candidate_viewed_at) < new Date(rec.sent_to_candidate_at!))) {
    await admin.from("station_recordings").update({ candidate_viewed_at: new Date().toISOString() }).eq("id", rec.id);
  }

  const [voiceResult, doctorResult, patientResult, gpCreditsResult] = await Promise.all([
    showExaminerGrades && rec.examiner_voice_note_path
      ? admin.storage.from("consultation-recordings").createSignedUrl(rec.examiner_voice_note_path, 3600)
      : Promise.resolve({ data: null }),
    rec.doctor_audio_path
      ? admin.storage.from("consultation-recordings").createSignedUrl(rec.doctor_audio_path, 3600)
      : Promise.resolve({ data: null }),
    rec.patient_audio_path
      ? admin.storage.from("consultation-recordings").createSignedUrl(rec.patient_audio_path, 3600)
      : Promise.resolve({ data: null }),
    // The GP balance, which this page never loaded. Without it
    // SubmitForReviewButton saw creditsRemaining undefined, so its
    // "No GP reviews left" branch could not fire here and someone with
    // nothing left got the ordinary confirm dialog and a failed submit.
    admin.from("gp_review_credits").select("balance").eq("user_id", rec.doctor_user_id).single<{ balance: number }>(),
  ]);

  const gpCreditsRemaining = (gpCreditsResult as { data: { balance: number } | null }).data?.balance ?? 0;
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

  /*
    The transcript and both audio tracks, for anyone the gate above let in.

    It used to require isDoctor, which meant the patient and the observer
    could read the marking but not the consultation it was marking — a
    conversation all three of them had just sat through and heard every word
    of. The gate already decides who may be here; there is no second, quieter
    question for it to answer.
  */
  const hasConsultation = !!(doctorAudioUrl || patientAudioUrl || rec.transcript_formatted);

  return (
    <div className="min-h-screen" style={{ background: "#F4F4F2" }}>
      <div className="max-w-[960px] mx-auto px-4 py-10">

        {/* Station header */}
        <div
          className="rounded-2xl px-5 py-4 mb-5 flex items-center justify-between gap-4"
          style={{ background: "white", border: "1px solid rgba(51,51,51,0.08)" }}
        >
          {/* Left: back. It earns its place on the paths where the browser's
              own back does not work: an examiner arrives here in a new tab
              from the review page, and a shared report link lands people who
              have no history at all. */}
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

          {/* Centre: station identity. flex-1 rather than a bare block, so it
              centres on the header itself and does not drift when the thing
              beside it changes width or goes away. */}
          <div className="flex-1 flex flex-col items-center text-center min-w-0">
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

        {/* Public note */}
        {!examiner && (
          <p className="text-center text-[11px] mb-3" style={{ color: "rgba(51,51,51,0.35)" }}>
            Anyone with this link can view this report.
          </p>
        )}

        {/* Metadata row */}
        <div className="flex items-center gap-4 text-[11px] mb-5 px-1 flex-wrap" style={{ color: "rgba(51,51,51,0.4)" }}>
          <span>{new Date(rec.started_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</span>
          <span>·</span>
          <span>Doctor: {rec.doctor_display_name}</span>
          {rec.patient_display_name && <><span>·</span><span>Patient: {rec.patient_display_name}</span></>}
          {rec.examiners?.name && <><span>·</span><span>Marked by Dr {rec.examiners.name}</span></>}
        </div>

        {/* Ready to submit — AI-graded but not yet sent for GP review */}
        {isDoctor && rec.status === "ai_graded" && (
          <div
            className="rounded-xl px-4 py-3 mb-5 text-[12.5px]"
            style={{ background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)", color: "#1D4ED8" }}
          >
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <span>
                <strong>AI review complete.</strong> This is provisional. Submit it to get GP-reviewed feedback (uses 1 of your GP reviews).
              </span>
              <SubmitForReviewButton recordingId={rec.id} stationTitle={rec.station_title} creditsRemaining={gpCreditsRemaining} />
            </div>
            {isRealCandidate && (
              <div className="mt-2">
                <AiReportFeedbackLink recordingId={rec.id} alreadySubmitted={hasAiReportFeedback} />
              </div>
            )}
          </div>
        )}

        {/* Provisional banner — only once it's genuinely been submitted */}
        {!isFinal && !examiner && (rec.status === "pending_examiner" || rec.status === "reviewing") && (
          <div
            className="rounded-xl px-4 py-3 mb-5 text-[12.5px]"
            style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", color: "#92400E" }}
          >
            <strong>Provisional scores only.</strong> Full examiner feedback is on its way, usually within 5 working days.
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
                Predicted Score
              </div>
              <PredictedScore total={total} />

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
            ) : !showExaminerGrades && rec.ai_focus_for_next_time ? (
              <div
                className="rounded-2xl p-6"
                style={{ background: "white", border: "1px solid rgba(51,51,51,0.08)" }}
              >
                <div className="text-[11px] font-bold uppercase tracking-[0.07em] mb-3" style={{ color: NAVY }}>
                  Focus for Next Time
                </div>
                <p className="text-[13.5px] leading-relaxed" style={{ color: "rgba(51,51,51,0.75)" }}>
                  {rec.ai_focus_for_next_time}
                </p>
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
                {/*
                  Badge above the title, on its own line, in every card.

                  It used to sit beside the title, which only fitted while
                  the badge was short. Measured at the real width: the card
                  is 268px inside its padding, "Data Gathering & Diagnosis"
                  is 174px, and "Needs Improvement" is 129px — 43px too
                  wide. So one card wrapped and the other two did not, and
                  which ones depended on the grades that came back.

                  Stacking fixed that. Putting the badge FIRST rather than
                  second is the part worth keeping deliberately: it lands at
                  the same height in all three cards regardless of how long
                  the name is, so the row of verdicts reads in one pass
                  instead of stepping over three different-length titles.

                  The worry about leading with a judgement did not survive
                  looking at it. The badge is small and pale — it reads as a
                  tag, not a headline. What made the old report feel final
                  was the words "Clear Fail", not where they sat.
                */}
                <div className="flex flex-col items-start gap-2">
                  {/* showExaminerGrades is already the test for "a GP has
                      marked this", which is exactly when the precise band is
                      earned. */}
                  <GradePill grade={grades[key]} domain={key} estimate={!showExaminerGrades} />
                  <span className="text-[13px] font-bold" style={{ color: NAVY }}>{label}</span>
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

        {/* ── Case rules, examiner only ── */}
        {/* Its own panel rather than part of the skills strip: a rule can fire
            on a station with skill grading switched off entirely, and a forced
            grade must never reach a GP unexplained. */}
        {examiner && firedRules.length > 0 && (
          <div
            className="rounded-2xl px-5 py-4 mb-5"
            style={{ background: "rgba(99,102,241,0.05)", border: "1px solid rgba(99,102,241,0.18)" }}
          >
            <div className="text-[10px] font-bold uppercase tracking-[0.06em] mb-2" style={{ color: "#4338CA" }}>
              Case rules applied · not shown to the candidate
            </div>
            <div className="flex flex-col gap-2.5">
              {firedRules.map((f, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between gap-3 text-[12.5px] flex-wrap">
                    <span style={{ color: "rgba(51,51,51,0.65)" }}>
                      {f.name}
                      {!f.decisive && <span style={{ color: "rgba(51,51,51,0.35)" }}> · not decisive</span>}
                    </span>
                    <span className="font-mono" style={{ color: "#4338CA" }}>
                      {CASE_DOMAIN_LABEL[f.domain]} {f.bound === "ceiling" ? "capped at" : "lifted to"} {f.grade}
                      {f.before !== f.after ? ` · ${f.before} → ${f.after}` : " · no change"}
                    </span>
                  </div>
                  {/* What it fired on, not just that it fired. A forced grade an
                      examiner cannot check is a forced grade they cannot trust. */}
                  {f.finding && (
                    <p className="text-[12px] mt-1 mb-0 pl-3" style={{ color: "rgba(51,51,51,0.5)", borderLeft: "2px solid rgba(99,102,241,0.3)" }}>
                      {f.finding}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Skills Assessment ── */}
        {/* Only rendered when the recording actually has skill data, so
            recordings graded before skill grading existed are unaffected. */}
        {skills.length > 0 && (
          <details
            className="rounded-2xl overflow-hidden mb-5"
            style={{ background: "white", border: "1px solid rgba(51,51,51,0.08)" }}
          >
            <summary
              className="px-5 py-4 cursor-pointer select-none flex items-center justify-center gap-2"
              style={{ listStyle: "none" }}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, opacity: 0.4 }}>
                <path d="M1.5 4.5L3 6l2.5-2.5" stroke={NAVY} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M1.5 11L3 12.5L5.5 10" stroke={NAVY} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M8.5 5h6M8.5 11.5h6" stroke={NAVY} strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span className="text-[12px] font-semibold" style={{ color: "rgba(51,51,51,0.5)" }}>
                Skills Assessment
              </span>
            </summary>

            <div style={{ borderTop: "1px solid rgba(51,51,51,0.07)" }}>
            {/* Examiner-only: what the skill layer actually did to the grades.
                Candidates see the final grade and the skill ratings, not the
                mechanics — this is review context and tuning data. */}
            {examiner && (
              <div
                className="mx-5 mt-4 rounded-xl px-4 py-3"
                style={{ background: "rgba(99,102,241,0.05)", border: "1px solid rgba(99,102,241,0.18)" }}
              >
                <div className="text-[10px] font-bold uppercase tracking-[0.06em] mb-2" style={{ color: "#4338CA" }}>
                  Examiner view · not shown to the candidate
                </div>
                <div className="flex flex-col gap-1">
                  {([
                    { key: "data_gathering", label: "Data Gathering", baseline: rec.ai_baseline_data_gathering, final: rec.ai_data_gathering },
                    { key: "clinical_management", label: "Clinical Management", baseline: rec.ai_baseline_clinical_management, final: rec.ai_clinical_management },
                    { key: "relating_to_others", label: "Relating to Others", baseline: rec.ai_baseline_relating_to_others, final: rec.ai_relating_to_others },
                  ] as const).map((d) => {
                    const o = skillsAssessment?.outcomes?.[d.key];
                    const moved = d.baseline && d.final && d.baseline !== d.final;
                    // Says why nothing moved, not just that nothing moved —
                    // "2 of 4 assessable" is the answer to the obvious question.
                    const detail = !o
                      ? ""
                      : o.goodPct === null
                        ? ` · ${o.assessed} assessable, below minimum`
                        : ` · ${o.good}/${o.assessed} good (${Math.round(o.goodPct)}%)`;
                    // Shown as the full chain when the ceiling bit, because
                    // "CP (unchanged)" would be a lie about a capped Clear Pass
                    // that the count then earned back.
                    const chain = o?.capApplied
                      ? `${d.baseline} → ${CAP_CEILING} (ceiling)${d.final !== CAP_CEILING ? ` → ${d.final}` : ""}`
                      : `${d.baseline ?? "—"}${moved ? ` → ${d.final}` : " (unchanged)"}`;
                    return (
                      <div key={d.key} className="flex items-center justify-between gap-3 text-[12.5px]">
                        <span style={{ color: "rgba(51,51,51,0.6)" }}>{d.label}</span>
                        <span className="font-mono" style={{ color: moved || o?.capApplied ? "#4338CA" : "rgba(51,51,51,0.45)" }}>
                          {chain}
                          {detail}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="px-5 pb-5 pt-4 flex flex-col gap-3">
              {skills.map((s) => {
                const meta = SKILL_RATING_META[s.rating] ?? SKILL_RATING_META.not_assessable;
                return (
                  <div
                    key={s.skill}
                    className="rounded-xl px-4 py-3"
                    style={{ background: "rgba(51,51,51,0.02)", border: "1px solid rgba(51,51,51,0.07)" }}
                  >
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <span className="text-[13.5px] font-semibold" style={{ color: NAVY }}>
                        {s.skill in skillLabels ? skillLabels[s.skill] : s.skill}
                      </span>
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-[0.04em]"
                        style={{ background: meta.bg, color: meta.color }}
                      >
                        {meta.label}
                      </span>
                    </div>
                    {s.comment?.trim() && (
                      <p className="text-[13.5px] leading-[1.6] mt-1.5 mb-0" style={{ color: "rgba(51,51,51,0.7)" }}>
                        {s.comment}
                      </p>
                    )}
                    {/* The actionable half, given its own line rather than left
                        as the last clause of a paragraph about what went wrong.
                        Absent on recordings graded before it existed. */}
                    {s.improvement?.trim() && (
                      <p
                        className="text-[13.5px] leading-[1.6] mt-2.5 mb-0 pl-3"
                        style={{ color: "rgba(51,51,51,0.72)", borderLeft: "2px solid rgba(246,212,75,0.9)" }}
                      >
                        <span className="font-semibold" style={{ color: NAVY }}>Next time: </span>
                        {s.improvement}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
            </div>
          </details>
        )}

        {/* ── Time Assessment ──────────────────────────────────────────
            Whole feature is app/recordings/TimeAssessment.tsx plus this
            block. Renders nothing when the recording has no raw transcript,
            which is every recording graded before the two-track pipeline. */}
        <TimeAssessment raw={rec.transcript_raw} />

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
              {(doctorAudioUrl || patientAudioUrl) && (
                <div className="text-[11px] font-bold uppercase tracking-[0.06em] px-5 pt-5" style={{ color: "rgba(51,51,51,0.4)" }}>
                  Consultation Audio &amp; Transcript
                </div>
              )}
              <div className="px-5 pt-4 pb-5">
                <ConsultationPlayer
                  doctorUrl={doctorAudioUrl}
                  patientUrl={patientAudioUrl}
                  transcript={rec.transcript_formatted}
                />
              </div>
            </div>
          </details>
        )}

      </div>
    </div>
  );
}
