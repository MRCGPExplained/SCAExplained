import { NextResponse, after } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-case-bank";
import { getSupabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(req: Request, { params }: RouteParams) {
  const { id: recordingId } = await params;
  const url = new URL(req.url);
  const role = url.searchParams.get("role") as "doctor" | "patient" | null;

  if (!role || !["doctor", "patient"].includes(role)) {
    return NextResponse.json({ error: "role must be doctor or patient" }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });

  const admin = getSupabaseAdmin();
  if (!admin) return NextResponse.json({ error: "Server config error" }, { status: 500 });

  const { data: recording } = await admin
    .from("station_recordings")
    .select("id, doctor_user_id, patient_user_id")
    .eq("id", recordingId)
    .single<{ id: string; doctor_user_id: string; patient_user_id: string }>();

  if (!recording) return NextResponse.json({ error: "Recording not found" }, { status: 404 });

  const expectedUserId = role === "doctor" ? recording.doctor_user_id : recording.patient_user_id;
  if (user.id !== expectedUserId) {
    return NextResponse.json({ error: "Not authorised for this role" }, { status: 403 });
  }

  const storagePath = `${recordingId}/${role}.webm`;

  // Confirm the file actually landed before trusting the client's say-so.
  const { data: listing } = await admin.storage
    .from("consultation-recordings")
    .list(recordingId, { search: `${role}.webm` });
  if (!listing || listing.length === 0) {
    return NextResponse.json({ error: "Uploaded file not found in storage" }, { status: 400 });
  }

  const pathColumn = role === "doctor" ? "doctor_audio_path" : "patient_audio_path";
  await admin
    .from("station_recordings")
    .update({ [pathColumn]: storagePath })
    .eq("id", recordingId);

  /*
    Claiming the recording, in one statement, instead of reading it and then
    deciding.

    Both halves of a consultation call this route, each with its own role.
    It used to re-read the row, see both audio paths present, set
    "processing" and fire the pipeline. When the two uploads landed together
    BOTH requests saw both paths, both set the status and both fired — and
    the pipeline's own guard could not help, because it reads the status and
    by then it genuinely said "processing" for both of them.

    Station 72 on 27 Oct was transcribed twice: four Deepgram calls with four
    different request ids inside 85ms, one consultation, billed twice.

    Postgres settles it now. Both conditions are in the WHERE clause, so the
    second UPDATE blocks on the row lock, re-reads the row as "processing"
    and matches nothing. Exactly one caller is handed a row back, and only
    that one starts the pipeline. "uploading" rather than != "processing" so
    a late duplicate cannot re-fire a recording that has already moved on.
  */
  const { data: claimed, error: claimErr } = await admin
    .from("station_recordings")
    .update({ status: "processing", ended_at: new Date().toISOString() })
    .eq("id", recordingId)
    .eq("status", "uploading")
    .not("doctor_audio_path", "is", null)
    .not("patient_audio_path", "is", null)
    .select("id");

  // supabase-js returns { data, error } and does not throw, so an unread
  // error here would be indistinguishable from losing the claim: silence,
  // and a consultation that is never processed.
  if (claimErr) {
    console.error("[recording/upload-complete] claim failed", recordingId, claimErr.message);
    return NextResponse.json({ error: "Could not start processing" }, { status: 500 });
  }

  if (claimed && claimed.length > 0) {
    const origin = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    after(async () => {
      try {
        const res = await fetch(`${origin}/api/recordings/${recordingId}/process`, {
          method: "POST",
          headers: { "x-internal-key": process.env.INTERNAL_API_KEY ?? "" },
        });
        if (!res.ok) {
          console.error("[recording/upload-complete] process trigger returned non-OK:", res.status);
        }
      } catch (e) {
        console.error("[recording/upload-complete] failed to trigger process:", e);
      }
    });
  }

  return NextResponse.json({ ok: true, path: storagePath });
}
