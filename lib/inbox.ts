import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * The inbox: things addressed to a candidate that arrive after they have gone.
 *
 * Two kinds, and the test for both is the same — did this land while they
 * were not looking?
 *
 *   - A GP review. Lands days after the consultation, when they have left.
 *   - A reply to feedback or a help request. Same: they asked, went away, and
 *     an answer turned up later.
 *
 * An AI report is deliberately NOT here. It arrives about a minute after the
 * recording stops, while the candidate is still sitting in the room looking
 * at it, so there is nothing to come and find them about. Nothing in this
 * file touches the AI path.
 *
 * Neither kind needed a new table. `sent_to_candidate_at`/`candidate_viewed_at`
 * and `replied_at`/`reply_viewed_at` already carry exactly this meaning, so
 * the envelope clears itself through writes the product already makes.
 */

interface InboxBase {
  /** Stable key for React and for marking one read. */
  id: string;
  sentAt: string;
  unread: boolean;
}

/** A GP review. Opens the report. */
export interface InboxReview extends InboxBase {
  kind: "review";
  recordingId: string;
  stationNumber: number;
  stationTitle: string;
}

/** An answer to something they asked. Opens nowhere — it reads in place. */
export interface InboxReply extends InboxBase {
  kind: "reply";
  topic: "feedback" | "help";
  stationNumber: number | null;
  stationTitle: string | null;
  /** What they originally wrote, so the answer has something to answer. */
  question: string;
  reply: string;
  repliedBy: string | null;
}

export type InboxMessage = InboxReview | InboxReply;

export interface Inbox {
  messages: InboxMessage[];
  unread: number;
  /**
   * The read failed, as opposed to finding nothing.
   *
   * These are the same shape and must never render the same way. "Nothing
   * yet" is the true state for every Starter customer, and a lie to someone
   * whose messages simply could not be fetched — a lie they cannot detect,
   * because it is exactly what they would expect to see.
   */
  failed: boolean;
}

/**
 * Unread means sent and not seen since. The second half matters: a review can
 * be edited and re-sent after the candidate has read the first one, and an
 * admin can reply twice. A bare "never viewed" check would call both read.
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
 * Fired on `window` by the report page once it has stamped
 * candidate_viewed_at, carrying the recording id as `detail`.
 *
 * The envelope is in the root layout, and Next refetches only the segment a
 * navigation changes, never the shared layout. A report opened from the list
 * therefore cannot clear the badge by rendering: the page has to say so.
 *
 * Declared here because both ends import it, and an event name written out
 * twice is a listener that quietly never fires.
 */
export const REPORT_READ_EVENT = "sca:report-read";

/** The sentence shown in the envelope. */
export function inboxLine(m: InboxMessage): string {
  if (m.kind === "review") {
    // "Examiner", not the GP's name. The report page names them, which is the
    // right place for it; the navbar is read over shoulders and in
    // notification previews, and a name there is a person identified as
    // having marked somebody.
    return `Examiner has reviewed your case on Station ${m.stationNumber}: ${m.stationTitle}.`;
  }
  // A reply names who answered, because unlike marking, answering a question
  // is a person doing you a favour and it should read like one.
  const who = m.repliedBy ?? "SCA Focus";
  const about = m.topic === "help" ? "help request" : "feedback";
  const where = m.stationNumber !== null ? ` on Station ${m.stationNumber}` : "";
  return `${who} replied to your ${about}${where}.`;
}

interface ReviewRow {
  id: string;
  station_number: number;
  station_title: string;
  sent_to_candidate_at: string;
  candidate_viewed_at: string | null;
}

interface ReplyRow {
  id: string;
  type: "feedback" | "help";
  station_number: number | null;
  station_title: string | null;
  content: string;
  reply_text: string;
  replied_at: string;
  replied_by_name: string | null;
  reply_viewed_at: string | null;
}

/**
 * Everything ever sent to this candidate, newest first.
 *
 * Everything, not a page of it, because the badge counts over this list and a
 * page would make the count a lie: an older unread item past the cut-off
 * would show as zero, which is worse than no badge at all. Both sets are
 * small by construction — the largest plan grants 20 GP reviews — so CAP sits
 * far above any real inbox and exists only so a runaway query cannot happen.
 * If it is ever hit the count becomes a floor, which is worth knowing, so it
 * says so rather than quietly truncating.
 */
const CAP = 200;

export async function loadInbox(admin: SupabaseClient, userId: string): Promise<Inbox> {
  const [reviews, replies] = await Promise.all([
    admin
      .from("station_recordings")
      .select("id, station_number, station_title, sent_to_candidate_at, candidate_viewed_at")
      .eq("doctor_user_id", userId)
      .not("sent_to_candidate_at", "is", null)
      .is("discarded_at", null)
      .order("sent_to_candidate_at", { ascending: false })
      .limit(CAP),
    admin
      .from("station_reports")
      .select("id, type, station_number, station_title, content, reply_text, replied_at, replied_by_name, reply_viewed_at")
      .eq("user_id", userId)
      .not("replied_at", "is", null)
      .not("reply_text", "is", null)
      .order("replied_at", { ascending: false })
      .limit(CAP),
  ]);

  // supabase-js returns { data, error } rather than throwing, so this has to
  // be read. Reported rather than swallowed — see Inbox.failed. Either source
  // failing fails the whole inbox: a half-inbox shown as whole is the same
  // lie in a smaller size.
  if (reviews.error || replies.error) {
    console.error("[inbox] load failed", userId, reviews.error?.message ?? replies.error?.message);
    return { messages: [], unread: 0, failed: true };
  }

  const reviewRows = (reviews.data ?? []) as unknown as ReviewRow[];
  const replyRows = (replies.data ?? []) as unknown as ReplyRow[];
  if (reviewRows.length === CAP || replyRows.length === CAP) {
    console.warn("[inbox] hit the cap, so the unread count is a floor", userId, CAP);
  }

  const messages: InboxMessage[] = [
    ...reviewRows.map((r): InboxReview => ({
      kind: "review",
      id: r.id,
      recordingId: r.id,
      stationNumber: r.station_number,
      stationTitle: r.station_title,
      sentAt: r.sent_to_candidate_at,
      unread: isUnreadReport(r.sent_to_candidate_at, r.candidate_viewed_at),
    })),
    ...replyRows.map((r): InboxReply => ({
      kind: "reply",
      id: r.id,
      topic: r.type,
      stationNumber: r.station_number,
      stationTitle: r.station_title,
      question: r.content,
      reply: r.reply_text,
      repliedBy: r.replied_by_name,
      sentAt: r.replied_at,
      unread: isUnreadReport(r.replied_at, r.reply_viewed_at),
    })),
  ].sort((a, b) => +new Date(b.sentAt) - +new Date(a.sentAt));

  return { messages, unread: messages.filter((m) => m.unread).length, failed: false };
}
