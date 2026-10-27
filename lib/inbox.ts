import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * The inbox: GP reviews that have been sent to a candidate.
 *
 * Deliberately only GP reviews. An AI report arrives about a minute after the
 * recording stops, while the candidate is still in the room looking at it —
 * there is nothing to notify them of. A GP review lands days later, when they
 * have gone, which is the only case where something needs to come and find
 * them. Nothing in here touches the AI path.
 *
 * `sent_to_candidate_at` and `candidate_viewed_at` already carry exactly this
 * meaning, so the inbox needs no new column and no new write: the envelope
 * clears itself when the candidate opens the report, through the stamp that
 * /recordings/[id] has always made.
 */

export interface InboxMessage {
  recordingId: string;
  stationNumber: number;
  stationTitle: string;
  sentAt: string;
  unread: boolean;
}

/**
 * Unread means sent and not seen since. The second half matters: a review can
 * be edited and re-sent after the candidate has read the first one, and a bare
 * `!candidate_viewed_at` would call that one read.
 *
 * Exported because /recordings decides the same thing about the same row, and
 * two copies of a rule like this drift.
 */
export function isUnreadReport(sentAt: string | null, viewedAt: string | null): boolean {
  if (!sentAt) return false;
  if (!viewedAt) return true;
  return new Date(viewedAt) < new Date(sentAt);
}

/**
 * The sentence shown in the envelope.
 *
 * "Examiner", not the GP's name. The report page names them, which is the
 * right place for it; the navbar is read over shoulders and in notification
 * previews, and a name there is a person identified as having marked
 * somebody.
 *
 * Number and title both, the way the rest of the product refers to a case.
 */
export function inboxLine(m: InboxMessage): string {
  return `Examiner has reviewed your case on Station ${m.stationNumber}: ${m.stationTitle}.`;
}

interface Row {
  id: string;
  station_number: number;
  station_title: string;
  sent_to_candidate_at: string;
  candidate_viewed_at: string | null;
}

export interface Inbox {
  messages: InboxMessage[];
  unread: number;
  /**
   * The read failed, as opposed to finding nothing.
   *
   * These are the same shape and must never render the same way. "Nothing
   * yet" is the true state for every Starter customer, and a lie to someone
   * whose reviews simply could not be fetched — a lie they cannot detect,
   * because it is exactly what they would expect to see.
   */
  failed: boolean;
}

/**
 * Every GP review ever sent to this candidate, newest first.
 *
 * Every one, not a page of them, because the badge counts over this list and
 * a page would make the count a lie: one older unread review sitting past the
 * cut-off would show as zero, which is worse than showing no badge at all.
 * The set is small by construction — the largest plan grants 20 GP reviews —
 * so CAP sits far above any real inbox and exists only so that a runaway
 * query cannot happen. If it is ever hit the count becomes a floor, which is
 * worth knowing, so it says so rather than quietly truncating.
 */
const CAP = 200;

export async function loadInbox(admin: SupabaseClient, userId: string): Promise<Inbox> {
  const { data, error } = await admin
    .from("station_recordings")
    .select("id, station_number, station_title, sent_to_candidate_at, candidate_viewed_at")
    .eq("doctor_user_id", userId)
    .not("sent_to_candidate_at", "is", null)
    .is("discarded_at", null)
    .order("sent_to_candidate_at", { ascending: false })
    .limit(CAP);

  // supabase-js returns { data, error } rather than throwing, so this has to
  // be read. Reported rather than swallowed — see Inbox.failed.
  if (error) {
    console.error("[inbox] load failed", userId, error.message);
    return { messages: [], unread: 0, failed: true };
  }

  const rows = (data ?? []) as unknown as Row[];
  if (rows.length === CAP) {
    console.warn("[inbox] hit the cap, so the unread count is a floor", userId, CAP);
  }

  const messages = rows.map((r) => ({
    recordingId: r.id,
    stationNumber: r.station_number,
    stationTitle: r.station_title,
    sentAt: r.sent_to_candidate_at,
    unread: isUnreadReport(r.sent_to_candidate_at, r.candidate_viewed_at),
  }));

  return { messages, unread: messages.filter((m) => m.unread).length, failed: false };
}
