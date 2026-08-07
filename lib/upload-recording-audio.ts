"use client";

import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

/**
 * Uploads a recorded audio blob straight to Supabase Storage using a signed
 * upload URL, then tells the server it landed. A long consultation (10+ min)
 * comfortably exceeds Vercel's ~4.5MB request body limit for serverless
 * functions, so the blob can no longer go through our own API route body —
 * only the two small JSON round-trips do.
 */
export async function uploadRecordingAudio(
  recordingId: string,
  role: "doctor" | "patient",
  blob: Blob
): Promise<void> {
  const urlRes = await fetch(`/api/recordings/${recordingId}/upload-url?role=${role}`, {
    method: "POST",
  });
  if (!urlRes.ok) {
    const body = await urlRes.json().catch(() => ({ error: "Could not start upload" }));
    throw new Error(body.error ?? "Could not start upload");
  }
  const { path, token } = (await urlRes.json()) as { path: string; token: string };

  const supabase = createSupabaseBrowserClient();
  const { error: uploadError } = await supabase.storage
    .from("consultation-recordings")
    .uploadToSignedUrl(path, token, blob, { contentType: "audio/webm" });
  if (uploadError) throw new Error(uploadError.message || "Upload failed");

  const completeRes = await fetch(`/api/recordings/${recordingId}/upload-complete?role=${role}`, {
    method: "POST",
  });
  if (!completeRes.ok) {
    const body = await completeRes.json().catch(() => ({ error: "Upload failed to finalise" }));
    throw new Error(body.error ?? "Upload failed to finalise");
  }
}
