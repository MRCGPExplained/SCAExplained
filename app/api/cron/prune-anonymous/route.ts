import { NextResponse } from "next/server";
import { purgeExpiredAnonymous } from "@/lib/anonymous-cleanup";

export const dynamic = "force-dynamic";

/**
 * Deletes expired guest and trial accounts, and the content of expired
 * trials, once an hour.
 *
 * THE SWEEP EXISTED AND NOTHING RAN IT. deleteExpiredGuestAccountsAction was
 * reachable only from a button on /admin/cleanup, so anonymous accounts
 * accumulated for as long as nobody thought to press it. That was tolerable
 * while guests were a trickle off invite links. It stops being tolerable
 * with a free trial on the homepage minting one per visitor, which is the
 * whole reason this route exists.
 *
 * HOURLY, NOT DAILY. The accounts themselves are cheap; what is not is the
 * audio, and a trial's audio is deleted on the same 24-hour clock. Running
 * hourly means content goes within an hour of expiring rather than waiting
 * up to a day for the next pass, which is the difference between promising
 * someone their free session is not kept and actually not keeping it.
 */

/** A cron that deletes accounts is not something to leave open to the web.
 *  Vercel sends this header when CRON_SECRET is set in the project. */
function authorised(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return request.headers.get("authorization") === `Bearer ${secret}`;
}

export async function GET(request: Request) {
  if (!authorised(request)) {
    console.error("[cron/prune-anonymous] refused. Set CRON_SECRET in the Vercel project or guest and trial accounts will never be deleted.");
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const result = await purgeExpiredAnonymous();

  /*
    Failures are logged individually and loudly.

    The sweep this replaces counted successes and discarded every error, so
    a blocked account looked exactly like an account that was never there.
    An FK this code does not know about is the likeliest way it breaks, and
    the only symptom would be a number quietly smaller than it should be.
  */
  for (const f of result.failures) {
    console.error("[cron/prune-anonymous] could not purge", f.userId, "—", f.reason);
  }

  console.log("[cron/prune-anonymous] swept", {
    found: result.found,
    deleted: result.deleted,
    failed: result.failures.length,
    contentPruned: result.contentPruned,
  });

  // A partial sweep is not a server error — the ones that worked, worked —
  // but it must not report 200 OK with no hint either.
  return NextResponse.json({
    ok: result.failures.length === 0,
    found: result.found,
    deleted: result.deleted,
    failed: result.failures.length,
    contentPruned: result.contentPruned,
  });
}
