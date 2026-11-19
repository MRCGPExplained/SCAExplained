import { NextResponse } from "next/server";
import { pruneCandidateAudioBefore, findOldCandidateAudio } from "@/lib/audio-retention";

export const dynamic = "force-dynamic";

/**
 * Deletes consultation audio nobody can still reach, on a schedule.
 *
 * The sweep already existed as a button in /admin/cleanup. Nobody pressed it,
 * because there was no reason to think about storage until something said it
 * was full — and on 17 Nov Supabase did, with 989 MB of the 1 GB Free limit
 * used. Audio is effectively all of that: a consultation recorded at the
 * browser's default came to 22.2 MB, measured. (It is now 7.1 MB; see
 * AUDIO_BITS_PER_SECOND in the study room for the measurements.) That was
 * not enough on its own - the bucket passed 1 GB on 19 Nov regardless,
 * because nothing in it was old enough for this sweep to touch.
 *
 * So the point of this route is not that deleting old audio is new. It is
 * that a retention policy which depends on somebody remembering is not a
 * retention policy.
 *
 * THE POLICY IS NOT HERE. It is KEEP_AFTER_EXPIRY_DAYS in
 * lib/audio-retention.ts: audio goes three months after the candidate's
 * access ends. That is the sentence to change if the keeping period should
 * change, and the one to put in the Terms.
 */

/**
 * The age floor, and ONLY a floor.
 *
 * Nothing is deleted before a recording is this old, whatever any date says.
 * It is deliberately the same number as the keeping period, because that
 * makes it provably redundant for every customer whose dates make sense: a
 * recording can only be made while access is live, so created_at is never
 * after the expiry date, so created_at + 90 is never after expiry + 90. The
 * expiry test is always the binding one.
 *
 * What it is for is the dates that do NOT make sense. The expiry column is
 * hand-typed on an admin form with no minimum, is nulled outright when an
 * account is revoked, and is absent entirely for anyone who never bought.
 * Without this floor, each of those reads as "expired long ago" and the next
 * sweep deletes that account's audio - including a consultation recorded the
 * same morning. With it, the worst case costs three months rather than
 * everything, which is the difference between a mistake and a catastrophe.
 */
const FLOOR_DAYS = 90;

/** A cron that deletes files is not something to leave open to the web.
 *  Vercel sends this header when CRON_SECRET is set in the project. */
function authorised(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return request.headers.get("authorization") === `Bearer ${secret}`;
}

export async function GET(request: Request) {
  if (!authorised(request)) {
    // Loud, because the failure mode is silence: no secret means no sweep,
    // and storage would go back to growing until a quota email arrives.
    console.error("[cron/prune-audio] refused. Set CRON_SECRET in the Vercel project or old audio will never be deleted.");
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const before = new Date(Date.now() - FLOOR_DAYS * 86_400_000).toISOString();

  // Counted before deleting so the log says what was held back as well as what
  // went. "0 deleted" alone cannot tell a working access check apart from a
  // broken query, and those are the two states it most matters to separate.
  const { sweep } = await findOldCandidateAudio(before);
  const result = await pruneCandidateAudioBefore(before);

  if (result.error) {
    console.error("[cron/prune-audio] failed", result.error);
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  console.log("[cron/prune-audio] swept", {
    before,
    floorDays: FLOOR_DAYS,
    deleted: result.deleted ?? 0,
    heldForLiveAccess: sweep.heldForLiveAccess,
    heldForRecentExpiry: sweep.heldForRecentExpiry,
  });

  return NextResponse.json({
    ok: true,
    before,
    deleted: result.deleted ?? 0,
    heldForLiveAccess: sweep.heldForLiveAccess,
    heldForRecentExpiry: sweep.heldForRecentExpiry,
  });
}
