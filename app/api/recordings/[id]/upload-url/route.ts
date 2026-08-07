import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-case-bank";
import { getSupabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

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
  const { data, error } = await admin.storage
    .from("consultation-recordings")
    .createSignedUploadUrl(storagePath, { upsert: true });

  if (error || !data) {
    console.error("[recording/upload-url] failed to create signed upload URL:", error?.message);
    return NextResponse.json({ error: "Could not create upload URL" }, { status: 500 });
  }

  return NextResponse.json({ path: data.path, token: data.token });
}
