import { redirect } from "next/navigation";
import { isUnreadReport } from "@/lib/inbox";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase-case-bank";
import { getSupabaseAdmin } from "@/lib/supabase";
import { SubmitForReviewButton } from "./SubmitForReviewButton";
import { TranscribedChoice } from "./TranscribedChoice";
import { TopUpButton } from "./TopUpButton";
import { RecordingProgress } from "./RecordingProgress";
import { TOPUPS, isTopUpKey } from "@/lib/topups";

export const dynamic = "force-dynamic";

import { gradeDisplay, ESTIMATE, VERDICT } from "@/lib/grade-display";

function gradePoints(grade: string | null, domain: "dg" | "cm" | "ro"): string {
  if (!grade) return "—";
  const map: Record<string, Record<string, number>> = {
    dg: { CF: 0, F: 1, P: 2, CP: 3 },
    cm: { CF: 0, F: 1.5, P: 3, CP: 4.5 },
    ro: { CF: 0, F: 1, P: 2, CP: 3 },
  };
  return `${map[domain][grade]} pts`;
}

function totalPoints(rec: RecordingRow): string {
  const src = rec.sent_to_candidate_at
    ? { dg: rec.examiner_data_gathering, cm: rec.examiner_clinical_management, ro: rec.examiner_relating_to_others }
    : { dg: rec.ai_data_gathering, cm: rec.ai_clinical_management, ro: rec.ai_relating_to_others };

  const dg = { CF: 0, F: 1, P: 2, CP: 3 }[src.dg ?? ""] ?? null;
  const cm = { CF: 0, F: 1.5, P: 3, CP: 4.5 }[src.cm ?? ""] ?? null;
  const ro = { CF: 0, F: 1, P: 2, CP: 3 }[src.ro ?? ""] ?? null;

  if (dg === null || cm === null || ro === null) return "—";
  return `${dg + cm + ro} / 10.5 pts`;
}

type RecordingRow = {
  id: string;
  station_number: number;
  station_title: string;
  started_at: string;
  status: string;
  ai_data_gathering: string | null;
  ai_clinical_management: string | null;
  ai_relating_to_others: string | null;
  examiner_data_gathering: string | null;
  examiner_clinical_management: string | null;
  examiner_relating_to_others: string | null;
  sent_to_candidate_at: string | null;
  candidate_viewed_at: string | null;
  /** Why it could not be graded. Shown, not just stored — a row that failed
   *  silently is the thing this is here to stop. */
  ai_error: string | null;
};

interface AccessRow {
  ai_allowance: number;
  ai_uses_count: number;
  has_case_bank: boolean;
  case_bank_expires_at: string | null;
}

export default async function RecordingsPage({ searchParams }: { searchParams: Promise<{ purchased?: string; topped_up?: string; topup?: string }> }) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { purchased, topped_up, topup } = await searchParams;

  // Named from the pack that was actually bought. "1" is the shape the old
  // success_url used; a session created just before that change can still
  // land here, and it is better to confirm the purchase vaguely than to name
  // the wrong pack or show nothing at all.
  //
  // Its own wording rather than the pack label. The label is a product name
  // bound for Stripe, and lowercasing it printed "25 ai gradings have been
  // added" directly above a chip reading "25 AI reviews remaining" — two
  // names for one meter, at the one moment someone is checking that the
  // money they just spent actually landed.
  const toppedUpPack = topped_up && isTopUpKey(topped_up) ? TOPUPS[topped_up] : null;
  const toppedUpMessage = !topped_up
    ? null
    : toppedUpPack
      ? `Top-up successful: ${toppedUpPack.units} ${toppedUpPack.kind === "ai" ? "AI" : "GP"} review${toppedUpPack.units === 1 ? "" : "s"} have been added to your balance.`
      : "Top-up successful. Your balance has been updated.";

  const admin = getSupabaseAdmin();
  const [recordingsResult, creditsResult, accessResult] = await Promise.all([
    admin
      ? admin
          .from("station_recordings")
          .select("id, station_number, station_title, started_at, status, ai_data_gathering, ai_clinical_management, ai_relating_to_others, examiner_data_gathering, examiner_clinical_management, examiner_relating_to_others, sent_to_candidate_at, candidate_viewed_at, ai_error")
          .eq("doctor_user_id", user.id)
          // A take that could not be marked is not a review. There is no
          // report behind it and nothing to decide about it, so listing it
          // only puts a dead row in the middle of someone's feedback. The
          // room tells them at the time, and the row stays in the database
          // for us to look at.
          // Failed rows are NOT hidden any more. A take that could not be
          // graded used to vanish from this list, so the candidate was left
          // choosing between two wrong explanations: that it was still
          // working, or that it had been deleted. It says what went wrong now.
          .order("started_at", { ascending: false })
          .limit(50)
      : Promise.resolve({ data: [] }),
    admin
      ? admin.from("gp_review_credits").select("balance").eq("user_id", user.id).single<{ balance: number }>()
      : Promise.resolve({ data: null }),
    // AI allowance is granted rather than decremented, so what is left is
    // allowance minus the lifetime count the pipeline keeps.
    admin
      ? admin.from("user_access").select("ai_allowance, ai_uses_count, has_case_bank, case_bank_expires_at").eq("user_id", user.id).single<AccessRow>()
      : Promise.resolve({ data: null }),
  ]);

  const recordings = (recordingsResult.data ?? []) as RecordingRow[];
  const credits = (creditsResult as { data: { balance: number } | null }).data?.balance ?? 0;
  const access = (accessResult as { data: AccessRow | null }).data;
  const aiRemaining = Math.max(0, (access?.ai_allowance ?? 0) - (access?.ai_uses_count ?? 0));

  // Expiry outranks either meter. Someone whose four months have ended cannot
  // record, so they cannot spend anything, and selling them gradings would be
  // taking money for something they have no way to use: the top-up shop was
  // being shown to them anyway, because this page had no access check at all.
  const expiresAt = access?.case_bank_expires_at ?? null;
  const accessLive = !!access?.has_case_bank && !!expiresAt && expiresAt > new Date().toISOString();

  const NAVY = "#333333";

  return (
    <div className="min-h-screen" style={{ background: "#FAFAF8" }}>
      <div className="max-w-[860px] mx-auto px-4 py-10">

        {/* Back to dashboard */}
        <div className="mb-5">
          <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-[12px] font-semibold no-underline" style={{ color: "rgba(51,51,51,0.45)" }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Dashboard
          </Link>
        </div>

        {/* Header */}
        <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="font-display font-extrabold text-[26px]" style={{ color: NAVY }}>
              My Recordings
            </h1>
            <p className="text-[13.5px] mt-1" style={{ color: "rgba(51,51,51,0.55)" }}>
              AI-graded consultations. Submit the ones you want read by a GP.
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div
              className="rounded-xl px-4 py-2 text-[13px]"
              style={{ background: "white", border: "1px solid rgba(51,51,51,0.1)", color: NAVY }}
            >
              <span className="font-bold text-[17px]">{credits}</span>{" "}
              <span style={{ color: "rgba(51,51,51,0.5)" }}>GP review{credits !== 1 ? "s" : ""} remaining</span>
            </div>
            {/* Two meters, because there are two costs. An AI grading is
                pennies and plentiful; a GP review is a person's time. */}
            <div
              className="rounded-xl px-4 py-2 text-[13px]"
              style={{ background: "white", border: "1px solid rgba(51,51,51,0.1)", color: NAVY }}
            >
              <span className="font-bold text-[17px]">{aiRemaining}</span>{" "}
              <span style={{ color: "rgba(51,51,51,0.5)" }}>AI review{aiRemaining !== 1 ? "s" : ""} remaining</span>
            </div>
            {/*
              One button, and which one depends on what has actually run out.
              It used to be a single "Renew Programme" shown whenever the GP
              balance hit zero, which meant every Starter customer saw it on
              every load: Starter grants no GP reviews by design, so zero is
              its normal state, not an exhausted one. It also pointed at
              /case-bank/upgrade, which redirects anyone with live access
              straight back here, so pressing it did nothing at all.

              Expiry first, because a plan is the only answer to it. Then the
              empty meter, which a top-up answers without resetting the clock.
              Nothing at all while there is stock in both.
            */}
            {!accessLive ? (
              <Link
                href="/case-bank/upgrade"
                className="rounded-xl px-3.5 py-2 text-[13px] font-bold no-underline"
                style={{ background: NAVY, color: "white" }}
              >
                Choose a plan
              </Link>
            ) : (
              <TopUpButton autoOpen={topup === "1"} />
            )}
          </div>
        </div>

        {toppedUpMessage && (
          <div className="mb-6 rounded-xl px-4 py-3 text-[13px] font-semibold" style={{ background: "rgba(34,197,94,0.1)", color: "#166534", border: "1px solid rgba(34,197,94,0.2)" }}>
            {toppedUpMessage}
          </div>
        )}

        {!accessLive && (
          <div className="rounded-2xl p-5 mb-6" style={{ background: "#F9F3D9", border: "1px solid #F6D44B" }}>
            <p className="font-display font-extrabold text-[15px] mb-1" style={{ color: NAVY }}>
              Your access has ended
            </p>
            <p className="text-[12.5px] leading-[1.55] mb-3" style={{ color: "rgba(51,51,51,0.6)" }}>
              {expiresAt
                ? `It ran to ${new Date(expiresAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}. Everything below is still here, and anything left on your balances is still yours when you come back.`
                : "Everything below is still here, and anything left on your balances is still yours when you come back."}
            </p>
            <Link
              href="/case-bank/upgrade"
              className="inline-block rounded-xl px-3.5 py-2 text-[13px] font-bold no-underline"
              style={{ background: NAVY, color: "white" }}
            >
              Choose a plan
            </Link>
          </div>
        )}

        {purchased === "1" && (
          <div className="mb-6 rounded-xl px-4 py-3 text-[13px] font-semibold" style={{ background: "rgba(34,197,94,0.1)", color: "#166534", border: "1px solid rgba(34,197,94,0.2)" }}>
            Purchase successful: your programme access is now active.
          </div>
        )}

        {recordings.length === 0 ? (
          <div
            className="rounded-2xl p-10 text-center"
            style={{ background: "white", border: "1px solid rgba(51,51,51,0.08)" }}
          >
            <p className="text-[15px] font-semibold mb-2" style={{ color: NAVY }}>No recordings yet</p>
            <p className="text-[13px]" style={{ color: "rgba(51,51,51,0.5)" }}>
              Open a station, start a study group, and press <strong>Record</strong> when you&apos;re ready.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {/*
              The key, once for the list rather than once per row.

              The list holds two vocabularies at the same time: an AI row
              reads G NI G, a reviewed one reads CP F P. Without a word of
              explanation that looks like an inconsistency rather than a
              distinction, and the AI letters are new, so nobody arrives
              knowing them.

              Not a card. It used to be a white rounded-xl wearing the same
              border as a recording, in the same vertical stack as the
              recordings, so it read as the first row of the list rather than
              as the thing explaining the list. Dropping the card is what
              fixes that, and it costs nothing: the rows are cards, the key is
              not, and neither has to be coloured or outlined to say so.

              px-5 rather than px-4 so its labels line up with the station
              labels underneath, against the cards' p-5 plus their 1px border.
              Measured at 0.8px apart; at px-4 it sat 16.8px to the left,
              which read as a box it had missed rather than a heading.
            */}
            <div className="px-5 py-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.07em] m-0 mb-2" style={{ color: "rgba(51,51,51,0.4)" }}>
                Key
              </p>
              <div className="flex flex-col gap-2">
                {([
                  { who: "AI Review:", bands: [ESTIMATE.good, ESTIMATE.needs_improvement] },
                  { who: "GP Review:", bands: [VERDICT.CP, VERDICT.P, VERDICT.F, VERDICT.CF] },
                ] as const).map(({ who, bands }) => (
                  <div key={who} className="flex items-center gap-x-3 gap-y-1.5 flex-wrap">
                    {/* Fixed width so the pills line up across both rows,
                        rather than starting wherever the label happens to
                        end. "GP Review:" is the wider of the two. */}
                    <strong className="text-[11.5px] shrink-0 w-[72px] whitespace-nowrap" style={{ color: NAVY }}>{who}</strong>
                    {bands.map((b) => (
                      <span key={b.short} className="flex items-center gap-1.5">
                        {/*
                          The real pill, not a description of one. Built from
                          the same bands the rows are, so the key cannot come
                          to disagree with the thing it is explaining.
                        */}
                        <span
                          className="text-[11px] font-bold px-2 py-0.5 rounded"
                          style={{ background: b.bg, color: b.color }}
                        >
                          {b.short}
                        </span>
                        <span className="text-[11.5px]" style={{ color: "rgba(51,51,51,0.55)" }}>{b.label}</span>
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {recordings.map((rec) => {
              const isFinal = !!rec.sent_to_candidate_at;
              const isReviewed = isFinal;
              // The same rule the navbar envelope counts by, read from one
              // place so the badge and this list cannot disagree.
              const isUnread = isUnreadReport(rec.sent_to_candidate_at, rec.candidate_viewed_at);
              const hasGrades = isFinal
                ? !!(rec.examiner_data_gathering && rec.examiner_clinical_management && rec.examiner_relating_to_others)
                : !!(rec.ai_data_gathering && rec.ai_clinical_management && rec.ai_relating_to_others);
              const grades = isFinal
                ? { dg: rec.examiner_data_gathering, cm: rec.examiner_clinical_management, ro: rec.examiner_relating_to_others }
                : { dg: rec.ai_data_gathering, cm: rec.ai_clinical_management, ro: rec.ai_relating_to_others };

              return (
                <Link
                  key={rec.id}
                  href={`/recordings/${rec.id}`}
                  className="block rounded-2xl p-5 transition hover:shadow-md"
                  style={{
                    background: "white",
                    border: isUnread ? "1.5px solid rgba(246,212,75,0.6)" : "1px solid rgba(51,51,51,0.08)",
                    textDecoration: "none",
                  }}
                >
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        {isUnread && (
                          <span
                            className="shrink-0 w-2 h-2 rounded-full"
                            style={{ background: "#F6D44B" }}
                            aria-label="Unread"
                          />
                        )}
                        <span className="text-[11px] font-bold uppercase tracking-[0.06em]" style={{ color: "rgba(51,51,51,0.4)" }}>
                          Station {rec.station_number}
                        </span>
                      </div>
                      <div className="text-[15px]" style={{ color: NAVY, fontWeight: isUnread ? 800 : 700 }}>{rec.station_title}</div>
                      <div className="text-[12px] mt-1" style={{ color: "rgba(51,51,51,0.45)" }}>
                        {new Date(rec.started_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      {/* Status */}
                      <span
                        className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-[0.05em]"
                        style={
                          isReviewed
                            ? { background: "rgba(34,197,94,0.1)", color: "#166534" }
                            : rec.status === "processing" || rec.status === "grading"
                            ? { background: "rgba(139,92,246,0.1)", color: "#6D28D9" }
                            : rec.status === "transcribed"
                            ? { background: "rgba(246,212,75,0.28)", color: "#333333" }
                            : rec.status === "failed"
                            ? { background: "rgba(239,68,68,0.09)", color: "#B91C1C" }
                            : rec.status === "discarded"
                            ? { background: "rgba(51,51,51,0.06)", color: "rgba(51,51,51,0.38)" }
                            : rec.status === "ai_graded"
                            ? { background: "rgba(59,130,246,0.1)", color: "#1D4ED8" }
                            : rec.status === "pending_examiner" || rec.status === "reviewing"
                            ? { background: "rgba(245,158,11,0.1)", color: "#92400E" }
                            : { background: "rgba(51,51,51,0.07)", color: "rgba(51,51,51,0.4)" }
                        }
                      >
                        {isReviewed
                          ? "Reviewed"
                          : rec.status === "processing"
                          ? "Transcribing…"
                          : rec.status === "grading"
                          ? "Grading…"
                          : rec.status === "transcribed"
                          ? "Your call"
                          : rec.status === "failed"
                          ? "Couldn't grade"
                          : rec.status === "discarded"
                          ? "Discarded"
                          : rec.status === "ai_graded"
                          ? "AI graded"
                          : rec.status === "pending_examiner" || rec.status === "reviewing"
                          ? "Awaiting examiner"
                          : rec.status}
                      </span>

                      {/* The bar, and the poll that keeps this row honest.
                          Renders nothing once the take has settled. */}
                      <RecordingProgress recordingId={rec.id} initialStatus={rec.status} />

                      {/* Why, in the candidate's words rather than a status
                          code. A take that could not be graded used to vanish
                          from this list entirely, which left two wrong
                          readings available — still working, or deleted. */}
                      {rec.status === "failed" && rec.ai_error && (
                        <p
                          className="text-[11.5px] leading-[1.5] m-0 text-right max-w-[320px]"
                          style={{ color: "rgba(51,51,51,0.5)" }}
                        >
                          {rec.ai_error}
                        </p>
                      )}

                      {/* Grades */}
                      {hasGrades && (
                        <div className="flex items-center gap-1.5 flex-wrap justify-end">
                          {(["dg", "cm", "ro"] as const).map((key) => {
                            /*
                              The same vocabulary the report uses, chosen by
                              the same test. This row said "CP F P" about a
                              consultation whose report said "Good, Needs
                              Improvement, Good" — the list and the report
                              contradicting each other about one set of
                              grades, which is worse than either wording on
                              its own.
                            */
                            const band = gradeDisplay(grades[key], !isReviewed);
                            return band ? (
                              <span
                                key={key}
                                title={band.label}
                                className="text-[11px] font-bold px-2 py-0.5 rounded"
                                style={{ background: band.bg, color: band.color }}
                              >
                                {band.short}
                              </span>
                            ) : null;
                          })}
                          <span className="text-[12px] font-bold" style={{ color: NAVY }}>
                            {totalPoints(rec)}
                          </span>
                        </div>
                      )}

                      {/* Transcribed and waiting on a decision. The safety
                          net for anything left undecided in the study room,
                          so no take can be stranded with nothing to press. */}
                      {rec.status === "transcribed" && (
                        <TranscribedChoice
                          recordingId={rec.id}
                          stationTitle={rec.station_title}
                          aiRemaining={aiRemaining}
                          gpRemaining={credits}
                        />
                      )}

                      {rec.status === "ai_graded" && (
                        <SubmitForReviewButton
                          recordingId={rec.id}
                          stationTitle={rec.station_title}
                          creditsRemaining={credits}
                        />
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
