import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

/**
 * Recordings that stopped at "uploading" and will never move on their own.
 *
 * A take only goes forward when BOTH tracks have landed — upload-complete
 * claims the row and fires the pipeline on the second one. If one side never
 * arrives, that claim is never made and nothing anywhere notices. No error,
 * no retry, no timeout. On 28 Oct a consultation sat exactly like that: the
 * doctor's 13.6MB track in storage, the patient's missing, status "uploading",
 * ai_error null, and the candidate watching a progress bar at stage one.
 *
 * The browser that failed is not a reliable reporter of its own failure. It
 * may have been closed, slept, killed by the phone, or driven out of signal.
 * That is what makes this a backstop rather than better error handling: it
 * runs somewhere else and notices on its own.
 *
 * It decides on STORAGE, not on the clock, which is what lets it rescue as
 * well as bury:
 *
 *   both files present  → the upload worked and only the claim failed. Set
 *                         the paths, claim it, run the pipeline. Nothing is
 *                         lost — this is exactly the shape of the duplicate
 *                         -trigger race fixed on 27 Oct, from the other side.
 *   one or none         → that side genuinely never uploaded. Fail it and say
 *                         which, but only after the grace window.
 *
 * Two thresholds on purpose. Recovery is free, so it happens as soon as the
 * sweep sees it. Declaring something dead is not, so it waits: measured
 * uploads on these accounts ran 5-7s on a good night and 61-100s on a bad
 * one, and a worse connection than that is ordinary. Killing a slow upload
 * that was going to succeed would be worse than the bug being fixed.
 */

/** Old enough that both uploads should have finished. Only gates when we
 *  LOOK; what we conclude comes from storage. */
const LOOK_AFTER_MINUTES = 5;

/** Old enough to call a missing track permanently missing. Far past the
 *  slowest upload ever measured here (100s), with room for far worse. */
const GIVE_UP_AFTER_MINUTES = 30;

/** A cron that rewrites recordings is not something to leave open to the web.
 *  Vercel sends this header when CRON_SECRET is set in the project. */
function authorised(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return request.headers.get("authorization") === `Bearer ${secret}`;
}

export async function GET(request: Request) {
  if (!authorised(request)) {
    // Loud, because the failure mode is silence: no secret means no sweep,
    // and a stuck recording would go back to being invisible forever.
    console.error("[cron/stuck-uploads] refused. Set CRON_SECRET in the Vercel project or stuck uploads will never be caught.");
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const admin = getSupabaseAdmin();
  if (!admin) return NextResponse.json({ error: "Server config error" }, { status: 500 });

  const lookBefore = new Date(Date.now() - LOOK_AFTER_MINUTES * 60_000).toISOString();
  const giveUpBefore = new Date(Date.now() - GIVE_UP_AFTER_MINUTES * 60_000).toISOString();

  const { data: stuck, error: findErr } = await admin
    .from("station_recordings")
    .select("id, created_at, station_number, doctor_audio_path, patient_audio_path")
    .eq("status", "uploading")
    .lt("created_at", lookBefore)
    .is("discarded_at", null)
    .limit(50);

  // supabase-js returns { data, error }. Unread, this would report a clean
  // sweep that never looked at anything.
  if (findErr) {
    console.error("[cron/stuck-uploads] could not list stuck recordings", findErr.message);
    return NextResponse.json({ error: findErr.message }, { status: 500 });
  }

  const rows = (stuck ?? []) as unknown as {
    id: string;
    created_at: string;
    station_number: number;
    doctor_audio_path: string | null;
    patient_audio_path: string | null;
  }[];

  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.scafocus.com";
  let recovered = 0;
  let failed = 0;
  let waiting = 0;

  for (const r of rows) {
    const { data: files, error: listErr } = await admin.storage
      .from("consultation-recordings")
      .list(r.id);

    if (listErr) {
      console.error("[cron/stuck-uploads] storage list failed", r.id, listErr.message);
      continue;
    }

    const names = new Set((files ?? []).map((f) => f.name));
    const haveDoctor = names.has("doctor.webm");
    const havePatient = names.has("patient.webm");

    if (haveDoctor && havePatient) {
      /*
        Both tracks are there, so nothing is lost — only the claim was missed.
        Set the paths as well as the status: a file can be in storage while
        its path column is null, because the column is written by the same
        upload-complete call that never ran.

        Conditional on status so this cannot fight a claim that lands in the
        same second as the sweep.
      */
      const { data: claimed, error: claimErr } = await admin
        .from("station_recordings")
        .update({
          doctor_audio_path: `${r.id}/doctor.webm`,
          patient_audio_path: `${r.id}/patient.webm`,
          status: "processing",
          ended_at: new Date().toISOString(),
        })
        .eq("id", r.id)
        .eq("status", "uploading")
        .select("id");

      if (claimErr) {
        console.error("[cron/stuck-uploads] claim failed", r.id, claimErr.message);
        continue;
      }
      if (!claimed || claimed.length === 0) continue; // someone else got there

      try {
        const res = await fetch(`${origin}/api/recordings/${r.id}/process`, {
          method: "POST",
          headers: { "x-internal-key": process.env.INTERNAL_API_KEY ?? "" },
        });
        if (!res.ok) console.error("[cron/stuck-uploads] process trigger non-OK", r.id, res.status);
      } catch (e) {
        console.error("[cron/stuck-uploads] could not trigger process", r.id, e);
      }

      recovered += 1;
      console.log("[cron/stuck-uploads] recovered", { id: r.id, station: r.station_number });
      continue;
    }

    // A track is genuinely missing. Wait out the grace window before saying so
    // — the other side may still be uploading on a bad connection.
    if (r.created_at >= giveUpBefore) {
      waiting += 1;
      continue;
    }

    const missing = !haveDoctor && !havePatient
      ? "Neither side's audio reached us"
      : haveDoctor
        ? "The patient's audio never reached us"
        : "The doctor's audio never reached us";

    const { error: failErr } = await admin
      .from("station_recordings")
      .update({
        status: "failed",
        ai_error: `${missing}, so this consultation could not be graded. Nothing was charged for it.`,
        ai_failed_at: new Date().toISOString(),
      })
      .eq("id", r.id)
      .eq("status", "uploading");

    if (failErr) {
      console.error("[cron/stuck-uploads] could not mark failed", r.id, failErr.message);
      continue;
    }

    failed += 1;
    console.log("[cron/stuck-uploads] marked failed", { id: r.id, station: r.station_number, missing });
  }

  return NextResponse.json({ ok: true, looked: rows.length, recovered, failed, waiting });
}
