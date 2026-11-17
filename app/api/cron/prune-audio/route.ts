import { NextResponse } from "next/server";
import { pruneCandidateAudioBefore, findOldCandidateAudio } from "@/lib/audio-retention";

export const dynamic = "force-dynamic";

/**
 * Deletes consultation audio nobody can still reach, on a schedule.
 *
 * The sweep already existed as a button in /admin/cleanup. Nobody pressed it,
 * because there was no reason to think about storage until something said it
 * was full — and on 17 Nov Supabase did, with 989 MB of the 1 GB Free limit
 * used. Audio is effectively all of that: a consultation was recorded at the
 * browser's default 144 kbps and came to about 19 MB. (It is now 48 kbps and
 * about 6 MB; see AUDIO_BITS_PER_SECOND in the study room.)
 *
 * So the point of this route is not that deleting old audio is new. It is
 * that a retention policy which depends on somebody remembering is not a
 * retention policy.
 *
 * WHAT IT WILL NOT DELETE is the thing to understand before changing the
 * window below. findOldCandidateAudio holds back any recording whose
 * candidate still has live case_bank_access, however old it is. The window is
 * therefore a floor and not a ceiling: audio survives until it is older than
 * the window AND the candidate it belongs to has run out of access. A
 * candidate in month four of a plan keeps everything.
 */

/**
 * How old audio has to be before it is considered at all.
 *
 * Plans run four months, about 122 days, so 180 is the longest plan plus two
 * months. The access check is what actually protects a paying candidate; this
 * number is the grace period AFTER they stop paying, during which they can
 * still be sent a link to their own consultation. Shortening it saves storage
 * sooner and is a product decision, not a technical one.
 */
const RETAIN_DAYS = 180;

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

  const before = new Date(Date.now() - RETAIN_DAYS * 86_400_000).toISOString();

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
    retainDays: RETAIN_DAYS,
    deleted: result.deleted ?? 0,
    heldForLiveAccess: sweep.heldForLiveAccess,
  });

  return NextResponse.json({
    ok: true,
    before,
    deleted: result.deleted ?? 0,
    heldForLiveAccess: sweep.heldForLiveAccess,
  });
}
