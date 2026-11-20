/**
 * The free trial: one case, no account, capped.
 *
 * A visitor to the homepage can do a single real consultation without signing
 * up — real study room, real recording, real AI grading, real report — and
 * then meets the plans. The friend they invite to play the patient sees the
 * same thing afterwards, which is the point: one trial sells to two people.
 *
 * WHAT MAKES THIS CHEAP TO BUILD is that almost none of it is new. The room,
 * the invite link, the guest join, the recorder, the pipeline and the report
 * are the shipping product, used unchanged. What lives here is only the part
 * that is specific to a trial: which station, how many a day, and how to tell
 * a trial apart from a paying session afterwards.
 *
 * THE NUMBERS ARE DELIBERATELY SMALL-PRINT-FREE. There is no per-user limit,
 * no cookie, no device fingerprint. One case out of 246 is not the product,
 * and someone redoing the same ear infection five times is having a worse
 * evening than someone who buys Starter. The only safeguard is the daily cap
 * below, which bounds the bill and nothing else.
 */

/**
 * The case everyone tries.
 *
 * Station 3, "Ear Discharge in a Child". Chosen because it is a TELEPHONE
 * consultation where the role is Karen Doyle, a worried mother — not a
 * patient speaking in clinical language. The role-player instruction is 520
 * characters of plain English, so the friend being invited can be a flatmate
 * rather than another registrar and still play it cold. It also lands on a
 * genuine dilemma, a parent expecting antibiotics for what is probably not
 * going to need them, which is the kind of case the product is for.
 */
export const TRIAL_STATION = 3;

/**
 * Free consultations of TRIAL_STATION per day, counted across everybody.
 *
 * Not per user. There is no per-user limit at all. This is a bound on the
 * bill, not a fairness rule: 50 consultations is about £5.41 of Deepgram,
 * Daily and Claude at the measured mean, so the worst month this can cost is
 * roughly £162 — and if it is ever actually hit, 50 people a day tried the
 * product, which is a good problem.
 *
 * Counted on the UTC day rather than Europe/London, which means the window
 * shifts by an hour in summer. That is a worse answer than it sounds only if
 * someone is watching the cap reset, and nobody is.
 */
export const TRIAL_DAILY_CAP = 50;

/**
 * How long a trial survives. Same 24 hours as a guest account, deliberately,
 * so the two can ride one sweep instead of two.
 */
export const TRIAL_MAX_AGE_MS = 24 * 60 * 60 * 1000;

/** Shown when the day's trials are gone. Not an error — a sales moment. */
export const TRIAL_CAP_MESSAGE =
  "We cap free sessions at 50 a day so everyone who tries one gets a good connection. Today's are gone — come back tomorrow, or take a look at the plans below.";

/** Start of the current UTC day, as an ISO string, for the cap count. */
export function trialDayStart(now: Date = new Date()): string {
  const d = new Date(now);
  d.setUTCHours(0, 0, 0, 0);
  return d.toISOString();
}
