"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSupabaseAdmin } from "@/lib/supabase";
import { createSupabaseServerClient } from "@/lib/supabase-case-bank";

export async function unlockBetatest(
  _prev: { error?: string },
  formData: FormData
): Promise<{ error?: string }> {
  const password = String(formData.get("password") ?? "");
  const expected = process.env.BETATEST_PASSWORD;

  if (!expected) return { error: "BETATEST_PASSWORD env var not configured." };
  if (password !== expected) return { error: "Incorrect password." };

  const cookieStore = await cookies();
  cookieStore.set("betatest_unlocked", "1", {
    httpOnly: true,
    maxAge: 60 * 60 * 24,
    path: "/",
  });

  redirect("/betatest");
}

// Fire the AI marking pipeline with a sample transcript — no audio required.
// Creates the recording row, sets it to processing, then calls process?spike=1.
export async function runMarkingSpikeAction(args: {
  stationNumber: number;
  stationTitle: string;
}): Promise<{ error?: string; recordingId?: string }> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const admin = getSupabaseAdmin();
  if (!admin) return { error: "Server config error." };

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("display_name")
    .eq("id", user.id)
    .single<{ display_name: string }>();

  const displayName = profile?.display_name ?? user.email ?? "Tester";

  const { data: recording, error: insertErr } = await admin
    .from("station_recordings")
    .insert({
      room_id: null,
      station_number: args.stationNumber,
      station_title: args.stationTitle,
      doctor_user_id: user.id,
      patient_user_id: user.id,
      doctor_display_name: displayName,
      patient_display_name: "Solo test",
      candidate_email: user.email ?? null,
      status: "processing",
      ended_at: new Date().toISOString(),
    })
    .select("id")
    .single<{ id: string }>();

  if (insertErr || !recording) return { error: "Could not create recording." };

  // Fire-and-forget — process route will run in its own request
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  fetch(`${origin}/api/recordings/${recording.id}/process?spike=1`, {
    method: "POST",
    headers: { "x-internal-key": process.env.INTERNAL_API_KEY ?? "" },
  }).catch((e) => console.error("[runMarkingSpikeAction] failed to trigger:", e));

  return { recordingId: recording.id };
}
