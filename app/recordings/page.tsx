import { redirect } from "next/navigation";
import { isUnreadReport } from "@/lib/inbox";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase-case-bank";
import { getSupabaseAdmin } from "@/lib/supabase";
import { doctorPossessive } from "@/lib/doctor-name";
import { SubmitForReviewButton } from "./SubmitForReviewButton";
import { TranscribedChoice } from "./TranscribedChoice";
import { TopUpButton } from "./TopUpButton";
import { RecordingProgress } from "./RecordingProgress";
import { TOPUPS, isTopUpKey } from "@/lib/topups";

export const dynamic = "force-dynamic";

import { gradeDisplay, ESTIMATE, VERDICT } from "@/lib/grade-display";

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
  /** Which chair the viewer sat in. The three are mutually exclusive by
   *  construction: observer_user_ids is built in app/case-bank/actions.ts:1032
   *  with the doctor and patient filtered out. */
  doctor_user_id: string;
  patient_user_id: string | null;
  observer_user_ids: string[] | null;
  /** Whose consultation it is, for the rows that are not the viewer's own. */
  doctor_display_name: string | null;
};

/** One list, so the two queries below cannot come to disagree about it. */
const ROW_COLUMNS =
  "id, station_number, station_title, started_at, status, " +
  "ai_data_gathering, ai_clinical_management, ai_relating_to_others, " +
  "examiner_data_gathering, examiner_clinical_management, examiner_relating_to_others, " +
  "sent_to_candidate_at, candidate_viewed_at, ai_error, " +
  "doctor_user_id, patient_user_id, observer_user_ids, doctor_display_name";

/*
  Separate budgets, because the two kinds of row are not interchangeable.

  A trainee sits in more consultations than they lead: in a pair, each person
  is the doctor once and the patient once per station, and a four-seat room puts
  them in three chairs out of four. Against the live table that comes to 1.75x
  and 2.33x their own doctor rows for the two heaviest users, and ~3x in a trio.
  Under a single limit, other people's consultations would push a trainee's own
  marked attempts off the bottom of a page called My Recordings — and
  lib/inbox.ts:207 drops read reviews from the envelope on the explicit grounds
  that this list keeps them for good. So the viewer's own work gets a budget
  peer rows cannot spend.
*/
const OWN_CAP = 200;
const PEER_CAP = 100;

type Role = "doctor" | "patient" | "observer";

/*
  Doctor first, then patient, then observer — the same order and the same
  else-branch as app/case-bank/lastAttempts.ts:85.

  The order is not cosmetic. A solo practice take writes the same person into
  both chairs (app/betatest/actions.ts:35 sets patient_user_id to the doctor's
  own id), so testing patient first would label somebody's own graded attempt
  "as patient" and hide their own marks from them, on the one row whose entire
  point is their mark.
*/
function roleOf(rec: RecordingRow, userId: string): Role {
  if (rec.doctor_user_id === userId) return "doctor";
  if (rec.patient_user_id === userId) return "patient";
  return "observer";
}

interface Chip {
  bg: string;
  color: string;
  label: string;
}

/**
 * The status chip, in the viewer's own terms.
 *
 * Peer rows get a shorter vocabulary than the doctor's, for two reasons. The
 * doctor's version answers "what do I do next", which is a question a peer
 * cannot act on — "Your call" is flatly false on a row where
 * loadTranscribedForOwner (app/case-bank/actions.ts:1291) refuses them. And a
 * peer row carries no RecordingProgress poller, so anything in-flight would
 * freeze at whatever the page load happened to catch; saying "No report yet"
 * cannot go stale in a way that misleads, where "Grading…" can.
 */
function statusChip(rec: RecordingRow, mine: boolean): Chip {
  const reviewed = !!rec.sent_to_candidate_at;

  if (!mine) {
    if (reviewed) return { bg: "rgba(34,197,94,0.1)", color: "#166534", label: "Reviewed" };
    if (rec.status === "ai_graded") return { bg: "rgba(59,130,246,0.1)", color: "#1D4ED8", label: "AI graded" };
    return { bg: "rgba(51,51,51,0.07)", color: "rgba(51,51,51,0.4)", label: "No report yet" };
  }

  if (reviewed) return { bg: "rgba(34,197,94,0.1)", color: "#166534", label: "Reviewed" };
  switch (rec.status) {
    case "processing":
      return { bg: "rgba(139,92,246,0.1)", color: "#6D28D9", label: "Transcribing…" };
    case "grading":
      return { bg: "rgba(139,92,246,0.1)", color: "#6D28D9", label: "Grading…" };
    case "transcribed":
      return { bg: "rgba(246,212,75,0.28)", color: "#333333", label: "Your call" };
    case "failed":
      return { bg: "rgba(239,68,68,0.09)", color: "#B91C1C", label: "Couldn't grade" };
    case "discarded":
      return { bg: "rgba(51,51,51,0.06)", color: "rgba(51,51,51,0.38)", label: "Discarded" };
    case "ai_graded":
      return { bg: "rgba(59,130,246,0.1)", color: "#1D4ED8", label: "AI graded" };
    case "pending_examiner":
    case "reviewing":
      return { bg: "rgba(245,158,11,0.1)", color: "#92400E", label: "Awaiting examiner" };
    default:
      return { bg: "rgba(51,51,51,0.07)", color: "rgba(51,51,51,0.4)", label: rec.status };
  }
}

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
  const [ownResult, peerResult, creditsResult, accessResult] = await Promise.all([
    admin
      ? admin
          .from("station_recordings")
          .select(ROW_COLUMNS)
          .eq("doctor_user_id", user.id)
          // Failed rows are NOT hidden. A take that could not be graded used
          // to vanish from this list, so the candidate was left choosing
          // between two wrong explanations: that it was still working, or
          // that it had been deleted. It says what went wrong now.
          .order("started_at", { ascending: false })
          .limit(OWN_CAP)
      : Promise.resolve({ data: [], error: null }),
    admin
      ? admin
          .from("station_recordings")
          .select(ROW_COLUMNS)
          /*
            Identity terms only inside the or(), and nothing else ever.

            PostgREST renders or() as (a OR b OR c) and ANDs each separately
            chained predicate with the whole group. A discarded_at or status
            test written inside this string would therefore be OR-ed with the
            identity terms and match every row in the table. This page reads
            through the service-role client, which bypasses RLS — and RLS could
            not save it anyway: station_recordings has a policy for the doctor
            and the patient and none at all for an observer — so this one
            string is the entire access check.

            The id is interpolated, which is safe only because both halves
            hold: it comes from supabase.auth.getUser(), which validates
            against the Auth server rather than decoding the cookie, so it is a
            real uuid; and all three columns are uuid-typed, so anything that
            could change the filter's meaning fails the cast and PostgREST
            returns 400. Nothing but a server-validated uuid may ever go in
            here.
          */
          .or(`patient_user_id.eq.${user.id},observer_user_ids.cs.{${user.id}}`)
          /*
            Discarded rows are dropped from other people's consultations and
            kept on the viewer's own. For the doctor, "Discarded" is a legible
            record of a decision they took. For a peer it is a row with no
            report behind it — discardRecordingAction deletes both audio tracks
            at app/case-bank/actions.ts:1394 — about a take they did not throw
            away and can do nothing about.
          */
          .is("discarded_at", null)
          .order("started_at", { ascending: false })
          .limit(PEER_CAP)
      : Promise.resolve({ data: [], error: null }),
    admin
      ? admin.from("gp_review_credits").select("balance").eq("user_id", user.id).single<{ balance: number }>()
      : Promise.resolve({ data: null }),
    // AI allowance is granted rather than decremented, so what is left is
    // allowance minus the lifetime count the pipeline keeps.
    admin
      ? admin.from("user_access").select("ai_allowance, ai_uses_count, has_case_bank, case_bank_expires_at").eq("user_id", user.id).single<AccessRow>()
      : Promise.resolve({ data: null }),
  ]);

  /*
    supabase-js returns { data, error } rather than throwing, so this has to be
    read. It matters more now than it did as one query: if the peer read fails
    on its own the page still renders a full-looking list of the viewer's own
    work, which is the same lie lib/inbox.ts:56 refuses to tell — a short list
    shown as the whole list, undetectable by the person reading it.
  */
  const ownError = (ownResult as { error?: { message: string } | null }).error ?? null;
  const peerError = (peerResult as { error?: { message: string } | null }).error ?? null;
  if (ownError || peerError) {
    console.error("[recordings] load failed", user.id, ownError?.message, peerError?.message);
  }

  const ownRows = ((ownResult.data ?? []) as unknown as RecordingRow[]);
  const peerRows = ((peerResult.data ?? []) as unknown as RecordingRow[]);

  /*
    Deduplicated, because the two filters can match the same row. A solo
    practice take puts the viewer in both chairs (app/betatest/actions.ts:35),
    so it answers to both. The viewer's own copy wins, which is the same answer
    roleOf gives.
  */
  const ownIds = new Set(ownRows.map((r) => r.id));
  const recordings = [...ownRows, ...peerRows.filter((r) => !ownIds.has(r.id))].sort(
    (a, b) => +new Date(b.started_at) - +new Date(a.started_at)
  );

  const credits = (creditsResult as { data: { balance: number } | null }).data?.balance ?? 0;
  const access = (accessResult as { data: AccessRow | null }).data;
  const aiRemaining = Math.max(0, (access?.ai_allowance ?? 0) - (access?.ai_uses_count ?? 0));

  // Expiry outranks either meter. Someone whose four months have ended cannot
  // record, so they cannot spend anything, and selling them gradings would be
  // taking money for something they have no way to use: the top-up shop was
  // being shown to them anyway, because this page had no access check at all.
  const expiresAt = access?.case_bank_expires_at ?? null;
  const accessLive = !!access?.has_case_bank && !!expiresAt && expiresAt > new Date().toISOString();

  /*
    Everything the row render needs, decided once.

    Derived up here rather than inside the map because the Key legend below has
    to know whether any row will actually show a grade pill, and a second copy
    of the role test to answer that is a second copy that can disagree with the
    first.
  */
  const rows = recordings.map((rec) => {
    const role = roleOf(rec, user.id);
    const mine = role === "doctor";
    const isFinal = !!rec.sent_to_candidate_at;
    /*
      Unread is the doctor's read state and nobody else's. candidate_viewed_at
      is a single column for the whole row and app/recordings/[id]/page.tsx:267
      stamps it only for the doctor, so on a peer's row the dot, the yellow
      border and the heavier title would all claim their mail was unread — and
      opening the report would not clear it, because there is nothing for them
      to press. It would then clear itself later, without them doing anything,
      the moment the real doctor read theirs.

      Per-person read state is a later change. Until it exists, a peer row has
      no unread state at all, which is the honest value rather than a
      placeholder.
    */
    const isUnread = mine && isUnreadReport(rec.sent_to_candidate_at, rec.candidate_viewed_at);
    const hasGrades =
      mine &&
      (isFinal
        ? !!(rec.examiner_data_gathering && rec.examiner_clinical_management && rec.examiner_relating_to_others)
        : !!(rec.ai_data_gathering && rec.ai_clinical_management && rec.ai_relating_to_others));
    const grades = isFinal
      ? { dg: rec.examiner_data_gathering, cm: rec.examiner_clinical_management, ro: rec.examiner_relating_to_others }
      : { dg: rec.ai_data_gathering, cm: rec.ai_clinical_management, ro: rec.ai_relating_to_others };

    return {
      rec,
      role,
      mine,
      isFinal,
      isUnread,
      hasGrades,
      grades,
      chip: statusChip(rec, mine),
      // Whose consultation it is, named only on the rows that are not the
      // viewer's own. Null when the stored name cannot safely be shortened —
      // see lib/doctor-name.ts — and the row then simply does not say.
      whose: mine ? null : doctorPossessive(rec.doctor_display_name),
    };
  });

  const showKey = rows.some((r) => r.hasGrades);

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
            {/* All three chairs, because the list now holds all three. The old
                subtitle described only the rows with a mark on them. */}
            <p className="text-[13.5px] mt-1" style={{ color: "rgba(51,51,51,0.55)" }}>
              Consultations you led, played the patient in, or watched. Submit your own to be read by a GP.
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

        {/* Said rather than swallowed. A list that is short because a query
            failed looks exactly like a list that is short. */}
        {(ownError || peerError) && (
          <div className="mb-6 rounded-xl px-4 py-3 text-[13px]" style={{ background: "rgba(239,68,68,0.07)", color: "#B91C1C", border: "1px solid rgba(239,68,68,0.18)" }}>
            Some of your recordings could not be loaded just now, so this list may be incomplete. Nothing has been lost — please refresh.
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

        {rows.length === 0 ? (
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

              Only when some row will actually show a pill. Grades are the
              viewer's own or nothing, so a list of consultations they only
              sat in as the patient would otherwise carry a six-pill legend
              explaining colours that appear nowhere beneath it.

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
            {showKey && (
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
            )}

            {rows.map(({ rec, role, mine, isFinal, isUnread, hasGrades, grades, chip, whose }) => (
              <Link
                key={rec.id}
                href={`/recordings/${rec.id}`}
                className="block rounded-2xl p-5 transition hover:shadow-md"
                style={{
                  /*
                    Recessed, not just labelled. The viewer's own consultations
                    are the white cards; the ones they sat in beside someone
                    else sit back from them. The difference is carried by
                    background and border rather than by type weight, because
                    weight 800 already means "unread" on this list and two
                    meanings on one pixel can be read off as neither.
                  */
                  background: mine ? "white" : "#F4F4F2",
                  border: isUnread
                    ? "1.5px solid rgba(246,212,75,0.6)"
                    : mine
                      ? "1px solid rgba(51,51,51,0.08)"
                      : "1px solid rgba(51,51,51,0.05)",
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
                    <div
                      className="text-[15px]"
                      style={{
                        color: mine ? NAVY : "rgba(51,51,51,0.72)",
                        fontWeight: isUnread ? 800 : 700,
                      }}
                    >
                      {rec.station_title}
                    </div>
                    <div className="text-[12px] mt-1" style={{ color: "rgba(51,51,51,0.45)" }}>
                      {/* Whose it is, then when. Named only on a row that is
                          not the viewer's own, and dropped silently when the
                          stored name is an email or a placeholder. */}
                      {whose && <>{whose} consultation · </>}
                      {new Date(rec.started_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    {/* Status */}
                    <span
                      className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-[0.05em]"
                      style={{ background: chip.bg, color: chip.color }}
                    >
                      {chip.label}
                    </span>

                    {/*
                      The bar, and the poll that keeps this row honest.
                      Renders nothing once the take has settled.

                      The viewer's own rows only. The poll's endpoint admits
                      the doctor and the patient and not the observer
                      (app/api/recordings/[id]/status/route.ts:27), so on an
                      observer's row every request 404s, RecordingProgress
                      swallows it, and the bar freezes for the full fifteen
                      minutes while re-requesting every four seconds. The
                      pipeline is the doctor's to watch in any case; a peer's
                      row says "No report yet" and means it.
                    */}
                    {mine && <RecordingProgress recordingId={rec.id} initialStatus={rec.status} />}

                    {/*
                      Why, in the candidate's words rather than a status code.
                      A take that could not be graded used to vanish from this
                      list entirely, which left two wrong readings available —
                      still working, or deleted.

                      The doctor's row only. The column holds two kinds of
                      text, and neither belongs on a peer's screen: the sweep
                      writes "The patient's audio never reached us…", which
                      reads to the patient as an accusation about themselves
                      followed by a reassurance about a charge they never
                      faced, and the pipeline writes a raw exception message.
                    */}
                    {mine && rec.status === "failed" && rec.ai_error && (
                      <p
                        className="text-[11.5px] leading-[1.5] m-0 text-right max-w-[320px]"
                        style={{ color: "rgba(51,51,51,0.5)" }}
                      >
                        {rec.ai_error}
                      </p>
                    )}

                    {/*
                      Grades, or the chair they sat in — never both, and never
                      somebody else's marks. A peer gets the consultation to
                      revisit and talk about; the mark on it is the doctor's.

                      "As patient" / "As observer" is the wording already in
                      use for exactly this on the station list
                      (app/case-bank/components/StationListClient.tsx:174),
                      down to the muted grey, so the two places agree.
                    */}
                    {mine ? (
                      hasGrades && (
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
                            const band = gradeDisplay(grades[key], !isFinal);
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
                      )
                    ) : (
                      <span className="text-[11.5px]" style={{ color: "rgba(51,51,51,0.38)" }}>
                        As {role}
                      </span>
                    )}

                    {/*
                      Both decisions are the doctor's, so both controls are the
                      doctor's. The server already refuses a peer —
                      loadTranscribedForOwner at app/case-bank/actions.ts:1291
                      and submitForReviewAction at :1167 — but offering a
                      patient a "Discard" that would delete someone else's
                      audio, or a dialog counting down their own credits
                      against a consultation those credits can never be spent
                      on, is a lie on screen whether or not it is one in the
                      database.
                    */}
                    {mine && rec.status === "transcribed" && (
                      <TranscribedChoice
                        recordingId={rec.id}
                        stationTitle={rec.station_title}
                        aiRemaining={aiRemaining}
                        gpRemaining={credits}
                      />
                    )}

                    {mine && rec.status === "ai_graded" && (
                      <SubmitForReviewButton
                        recordingId={rec.id}
                        stationTitle={rec.station_title}
                        creditsRemaining={credits}
                      />
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
