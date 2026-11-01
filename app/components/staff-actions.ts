"use server";

import { getSupabaseAdmin } from "@/lib/supabase";
import { resolveStaff, type ReviewWaiting, type FeedbackWaiting } from "@/lib/staff-nav";

/**
 * The two staff panels' contents, fetched when the icon is opened.
 *
 * Both re-check entitlement here rather than trusting that the navbar only
 * rendered the icon for staff. The icon is client-side; a server action is a
 * public endpoint that anyone signed in can POST to, and these return other
 * people's consultations and other people's feedback.
 *
 * Nothing is taken as an argument. There is no id or filter the browser can
 * set, so there is nothing to tamper with.
 */

export async function fetchReviewQueueAction(): Promise<ReviewWaiting[] | null> {
  const staff = await resolveStaff();
  if (!staff.isExaminer && !staff.isAdmin) return null;

  const admin = getSupabaseAdmin();
  if (!admin) return null;

  const { data, error } = await admin
    .from("station_recordings")
    .select(
      "id, station_number, station_title, doctor_display_name, status, submitted_for_review_at, examiner_reviewed_at, created_at, examiners!station_recordings_examiner_id_fkey(name)"
    )
    /*
      Asked of the columns that record the GP's work, not of `status`.

      This filtered status in ('pending_examiner','reviewing'). The pipeline
      owns `status` and writes it freely, so re-grading a consultation a GP
      was reviewing moved it to "processing" and it left this list, the badge
      and the portal at once, with no way back through the UI. Six of the
      eleven statuses appear in no list at all.

      submitted_for_review_at is the superset: every path that asks for a GP
      review sets it, and nothing ever clears it. A consultation now leaves
      this queue only by being sent or discarded, which are the two things
      that actually finish it. See lib/recording-state.
    */
    .not("submitted_for_review_at", "is", null)
    .is("sent_to_candidate_at", null)
    .is("discarded_at", null)
    .order("submitted_for_review_at", { ascending: true, nullsFirst: false })
    // Was 30, against a badge that counts without a limit, so the number and
    // the list could disagree. Still a cap, but far above any real queue.
    .limit(200);

  // supabase-js returns { data, error }. Unread, a failure would render as an
  // empty queue — which for a GP looks exactly like being up to date.
  if (error) {
    console.error("[staff] review queue failed", error.message);
    return null;
  }

  return ((data ?? []) as unknown as {
    id: string;
    station_number: number;
    station_title: string;
    doctor_display_name: string;
    status: string;
    submitted_for_review_at: string | null;
    examiner_reviewed_at: string | null;
    created_at: string;
    // A to-one embed, so an object and not an array, which is the shape the
    // portal and the report page already read this relationship as.
    examiners: { name: string } | null;
  }[]).map((r) => ({
    id: r.id,
    stationNumber: r.station_number,
    stationTitle: r.station_title,
    candidate: r.doctor_display_name,
    // A GP has saved marks against it. Read from the timestamp that records
    // exactly that, rather than from a status the pipeline can overwrite.
    started: !!r.examiner_reviewed_at,
    examiner: r.examiners?.name ?? null,
    waitingSince: r.submitted_for_review_at ?? r.created_at,
  }));
}

export async function fetchFeedbackQueueAction(): Promise<FeedbackWaiting[] | null> {
  const staff = await resolveStaff();
  if (!staff.isAdmin) return null;

  const admin = getSupabaseAdmin();
  if (!admin) return null;

  const { data, error } = await admin
    .from("station_reports")
    .select("id, type, user_name, station_number, station_title, content, created_at")
    .eq("resolved", false)
    .order("created_at", { ascending: true })
    .limit(30);

  if (error) {
    console.error("[staff] feedback queue failed", error.message);
    return null;
  }

  return ((data ?? []) as unknown as {
    id: string;
    type: "feedback" | "help";
    user_name: string | null;
    station_number: number | null;
    station_title: string | null;
    content: string;
    created_at: string;
  }[]).map((r) => ({
    id: r.id,
    topic: r.type,
    from: r.user_name,
    stationNumber: r.station_number,
    stationTitle: r.station_title,
    content: r.content,
    sentAt: r.created_at,
  }));
}
