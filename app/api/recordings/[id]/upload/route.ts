import { NextResponse, after } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-case-bank";
import { getSupabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
// 12-min consultation audio can be ~10MB. maxDuration also covers the
// after() callback below — /process now acks quickly and does the real
// grading work in its own after(), so this only needs to survive that ack,
// but the extra headroom is cheap insurance against a slow ack round-trip.
export const maxDuration = 300;

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

  // Verify caller is a participant in this recording
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });

  const admin = getSupabaseAdmin();
  if (!admin) return NextResponse.json({ error: "Server config error" }, { status: 500 });

  const { data: recording } = await admin
    .from("station_recordings")
    .select("id, doctor_user_id, patient_user_id, status")
    .eq("id", recordingId)
    .single<{ id: string; doctor_user_id: string; patient_user_id: string; status: string }>();

  if (!recording) return NextResponse.json({ error: "Recording not found" }, { status: 404 });

  const expectedUserId = role === "doctor" ? recording.doctor_user_id : recording.patient_user_id;
  if (user.id !== expectedUserId) {
    return NextResponse.json({ error: "Not authorised for this role" }, { status: 403 });
  }

  // Receive audio blob
  const formData = await req.formData();
  const audioFile = formData.get("audio");
  if (!audioFile || !(audioFile instanceof Blob)) {
    return NextResponse.json({ error: "No audio file received" }, { status: 400 });
  }

  const audioBuffer = Buffer.from(await audioFile.arrayBuffer());
  const storagePath = `${recordingId}/${role}.webm`;

  // Upload to Supabase Storage (consultation-recordings bucket)
  const { error: uploadError } = await admin.storage
    .from("consultation-recordings")
    .upload(storagePath, audioBuffer, {
      contentType: "audio/webm",
      upsert: true,
    });

  if (uploadError) {
    console.error("[recording/upload] storage error:", uploadError.message);
    return NextResponse.json({ error: "Storage upload failed" }, { status: 500 });
  }

  // Update the recording row with the audio path
  const pathColumn = role === "doctor" ? "doctor_audio_path" : "patient_audio_path";
  await admin
    .from("station_recordings")
    .update({ [pathColumn]: storagePath })
    .eq("id", recordingId);

  // Check if both files are now uploaded → trigger processing
  const { data: updated } = await admin
    .from("station_recordings")
    .select("doctor_audio_path, patient_audio_path")
    .eq("id", recordingId)
    .single<{ doctor_audio_path: string | null; patient_audio_path: string | null }>();

  if (updated?.doctor_audio_path && updated?.patient_audio_path) {
    // Mark as processing and kick off the pipeline asynchronously
    await admin
      .from("station_recordings")
      .update({ status: "processing", ended_at: new Date().toISOString() })
      .eq("id", recordingId);

    // Trigger the pipeline after the response is sent — using `after()`
    // instead of a bare fire-and-forget fetch, since Vercel can freeze/tear
    // down the function as soon as the response is returned, silently
    // dropping an un-awaited outbound request before it ever goes out.
    const origin = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    after(async () => {
      try {
        const res = await fetch(`${origin}/api/recordings/${recordingId}/process`, {
          method: "POST",
          headers: { "x-internal-key": process.env.INTERNAL_API_KEY ?? "" },
        });
        if (!res.ok) {
          console.error("[recording/upload] process trigger returned non-OK:", res.status);
        }
      } catch (e) {
        console.error("[recording/upload] failed to trigger process:", e);
      }
    });
  }

  return NextResponse.json({ ok: true, path: storagePath });
}
