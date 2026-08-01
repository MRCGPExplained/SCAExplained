import { NextRequest, NextResponse } from "next/server";
import { getExaminerFromCookie } from "@/lib/examiner-auth";
import { getSupabaseAdmin } from "@/lib/supabase";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  const examiner = await getExaminerFromCookie();
  if (!examiner) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const admin = getSupabaseAdmin();
  if (!admin) return NextResponse.json({ error: "Server error" }, { status: 500 });

  const form = await req.formData();
  const audio = form.get("audio") as Blob | null;
  const recordingId = String(form.get("recordingId") ?? "").trim();

  if (!audio || !recordingId) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const path = `${recordingId}/examiner-voice-note.webm`;
  const buf = Buffer.from(await audio.arrayBuffer());

  const { error: uploadErr } = await admin.storage
    .from("consultation-recordings")
    .upload(path, buf, { contentType: "audio/webm", upsert: true });

  if (uploadErr) return NextResponse.json({ error: uploadErr.message }, { status: 500 });

  await admin
    .from("station_recordings")
    .update({ examiner_voice_note_path: path })
    .eq("id", recordingId);

  return NextResponse.json({ path });
}

export async function DELETE(req: NextRequest) {
  const examiner = await getExaminerFromCookie();
  if (!examiner) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const admin = getSupabaseAdmin();
  if (!admin) return NextResponse.json({ error: "Server error" }, { status: 500 });

  const { searchParams } = new URL(req.url);
  const recordingId = searchParams.get("recordingId") ?? "";
  if (!recordingId) return NextResponse.json({ error: "Missing recordingId" }, { status: 400 });

  const path = `${recordingId}/examiner-voice-note.webm`;
  await admin.storage.from("consultation-recordings").remove([path]);
  await admin.from("station_recordings").update({ examiner_voice_note_path: null }).eq("id", recordingId);

  return NextResponse.json({ ok: true });
}
