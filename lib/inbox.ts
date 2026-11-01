import type { SupabaseClient } from "@supabase/supabase-js";
import { doctorPossessive } from "@/lib/doctor-name";
import { recordingRole, type RecordingRole } from "@/lib/recording-roles";

/**
 * The inbox: things addressed to a candidate that arrive after they have gone.
 *
 * Two kinds, and the test for both is the same — did this land while they
 * were not looking?
 *
 *   - A GP review of a consultation they were in. Any chair: the one they led,
 *     the one they played the patient in, the one they watched. It lands days
 *     later, when everybody has left.
 *   - A reply to feedback or a help request. They asked, went away, and an
 *     answer turned up later.
 *
 * An AI report is deliberately NOT here, for any chair. It arrives about a
 * minute after the recording stops, and the people who want it go and look.
 *
 * Read state lives in recording_reads, one row per person per report. It used
 * to be station_recordings.candidate_viewed_at, a single column for the whole
 * row, which was correct while a report was only ever addressed to the one
 * person who had sat it. It is not any more: a consultation now reaches the
 * patient and the observers too, and one column would have let whoever opened
 * it first clear the badge for everyone in the room.
 */

interface InboxBase {
  /** Stable key for React and for marking one read. */
  id: string;
  sentAt: string;
  unread: boolean;
}

/** A GP review of a consultation they were in. Opens the report. */
export interface InboxReview extends InboxBase {
  kind: "review";
  recordingId: string;
  stationNumber: number;
  stationTitle: string;
  /** Which chair they sat in. "doctor" means the mark on it is theirs. */
  role: RecordingRole;
  /** "Jon’s", for the chairs that are not their own. Null when the stored
   *  name cannot safely be shortened — see lib/doctor-name.ts. */
  whose: string | null;
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
 * Unread means arrived and not seen since. The second half matters: a review
 * can be edited and re-sent after the candidate has read the first one, an
 * admin can reply twice, and for the patient and the observers a GP review
 * arrives on a report they may already have read as an AI one. A bare "never
 * viewed" check would call all three read.
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
 * Fired on `window` by the report page once it has stamped the viewer's row in
 * recording_reads, carrying the recording id as `detail`.
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
    const where = `Station ${m.stationNumber}: ${m.stationTitle}`;

    if (m.role === "doctor") return `Examiner has reviewed your case on ${where}.`;

    /*
      Whose it is, in place of "your".

      The one thing a patient or an observer must not read is "your case": the
      consultation is not theirs, and the grades on it belong to whoever sat in
      the doctor's chair. The name drops out silently when doctor_display_name
      cannot safely be shortened — it falls back to an email address at insert
      time — and the sentence still reads.
    */
    return `Examiner has reviewed ${m.whose ?? "the"} case on ${where}.`;
  }
  // A reply names who answered, because unlike marking, answering a question
  // is a person doing you a favour and it should read like one.
  const who = m.repliedBy ?? "SCA Focus";
  const about = m.topic === "help" ? "help request" : "feedback";
  const where = m.stationNumber !== null ? ` on Station ${m.stationNumber}` : "";
  return `${who} replied to your ${about}${where}.`;
}

const REVIEW_COLUMNS =
  "id, station_number, station_title, sent_to_candidate_at, " +
  "doctor_user_id, patient_user_id, observer_user_ids, doctor_display_name";

interface ReviewRow {
  id: string;
  station_number: number;
  station_title: string;
  /** Non-null on every row either query returns — both filter on it. */
  sent_to_candidate_at: string;
  doctor_user_id: string | null;
  patient_user_id: string | null;
  observer_user_ids: string[] | null;
  doctor_display_name: string | null;
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

/**
 * Their own reads, which grow with use rather than with what is unread.
 *
 * Set well clear of CAP because a truncated read set shows something already
 * read as unread, and the newest reads are kept, which are the ones a current
 * inbox is most likely to be asking about.
 */
const READS_CAP = 1000;

export async function loadInbox(admin: SupabaseClient, userId: string): Promise<Inbox> {
  const [own, peers, reads, replies] = await Promise.all([
    // Their own consultations.
    admin
      .from("station_recordings")
      .select(REVIEW_COLUMNS)
      .eq("doctor_user_id", userId)
      .not("sent_to_candidate_at", "is", null)
      .is("discarded_at", null)
      .order("sent_to_candidate_at", { ascending: false })
      .limit(CAP),
    /*
      Consultations they were in but did not lead.

      Identity terms only inside the or(), and nothing else ever. PostgREST
      renders or() as (a OR b) and ANDs each separately chained predicate with
      the whole group, so a discarded_at or status test written inside this
      string would be OR-ed with the identity terms and match every row in the
      table. This read goes through the service-role client, and
      station_recordings has a policy for the doctor and the patient and none
      at all for an observer, so RLS could not catch the mistake either: this
      one string is the whole of the access check.

      The id is interpolated, which is safe only because both halves hold — it
      comes from a server-validated session, and all three columns are
      uuid-typed, so anything that could change the filter's meaning fails the
      cast. Nothing but a server-validated uuid may ever go in here.

      The sent/discarded tests are chained rather than written into that
      string, which is what makes them AND rather than widen it.
    */
    admin
      .from("station_recordings")
      .select(REVIEW_COLUMNS)
      .or(`patient_user_id.eq.${userId},observer_user_ids.cs.{${userId}}`)
      .not("sent_to_candidate_at", "is", null)
      .is("discarded_at", null)
      .order("sent_to_candidate_at", { ascending: false })
      .limit(CAP),
    admin
      .from("recording_reads")
      .select("recording_id, viewed_at")
      .eq("user_id", userId)
      .order("viewed_at", { ascending: false })
      .limit(READS_CAP),
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
  // be read. Reported rather than swallowed — see Inbox.failed. Any source
  // failing fails the whole inbox: a half-inbox shown as whole is the same
  // lie in a smaller size, and a missing read set would show read reports as
  // unread, which is the same lie pointing the other way.
  if (own.error || peers.error || reads.error || replies.error) {
    console.error(
      "[inbox] load failed",
      userId,
      own.error?.message ?? peers.error?.message ?? reads.error?.message ?? replies.error?.message
    );
    return { messages: [], unread: 0, failed: true };
  }

  const ownRows = (own.data ?? []) as unknown as ReviewRow[];
  const peerRows = (peers.data ?? []) as unknown as ReviewRow[];
  const readRows = (reads.data ?? []) as unknown as { recording_id: string; viewed_at: string }[];
  const replyRows = (replies.data ?? []) as unknown as ReplyRow[];

  if (ownRows.length === CAP || peerRows.length === CAP || replyRows.length === CAP) {
    console.warn("[inbox] hit the cap, so the unread count is a floor", userId, CAP);
  }
  if (readRows.length === READS_CAP) {
    console.warn("[inbox] hit the reads cap, so something read may show unread", userId, READS_CAP);
  }

  const readAt = new Map(readRows.map((r) => [r.recording_id, r.viewed_at]));

  /*
    Their own copy wins where both reads return the same row. A solo practice
    take puts one person in both chairs (app/betatest/actions.ts:35), so it
    answers to both filters, and recordingRole gives the same answer.
  */
  const ownIds = new Set(ownRows.map((r) => r.id));
  const reviewRows = [...ownRows, ...peerRows.filter((r) => !ownIds.has(r.id))];

  const reviews: InboxReview[] = [];
  for (const r of reviewRows) {
    const role = recordingRole(r, userId);
    // Only reachable if a filter above matched a row this test does not, which
    // would mean one of them is wrong. Skipped rather than guessed at.
    if (!role) continue;

    reviews.push({
      kind: "review",
      id: r.id,
      recordingId: r.id,
      stationNumber: r.station_number,
      stationTitle: r.station_title,
      role,
      whose: role === "doctor" ? null : doctorPossessive(r.doctor_display_name),
      sentAt: r.sent_to_candidate_at,
      unread: isUnreadReport(r.sent_to_candidate_at, readAt.get(r.id) ?? null),
    });
  }

  const messages: InboxMessage[] = [
    ...reviews,
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

  /*
    Unread only. The envelope is a list of what is still to be dealt with
    rather than an archive, and everything dropped here has somewhere better
    to be found:

      - Their own reviews stay on /recordings for good, which is where anyone
        would look for an old one anyway.
      - A consultation they sat in beside someone else stays on the station it
        belongs to, in the case bank, where the row for that station links
        straight to the report. That is a deliberately lighter record than
        /recordings — one link per station, the chair they sat in rather than a
        mark — because the page is called My Recordings and these are not.
      - A reply was emailed before it existed here at all. In replyToReport,
        sendFeedbackReplyEmail runs first and reply_text is written only if it
        returned true, so every reply this list can hold is one that was
        provably delivered, carrying its own text and the original question.

    That last point is the entire licence for dropping replies. Without it
    this would destroy the only copy of one: a reply has no page of its own,
    and it is marked read merely by being expanded, so half-reading one in the
    panel would lose it.

    Filtered here rather than in the query because unread is a comparison
    between two columns in two different tables.
  */
  const stillUnread = messages.filter((m) => m.unread);
  return { messages: stillUnread, unread: stillUnread.length, failed: false };
}
