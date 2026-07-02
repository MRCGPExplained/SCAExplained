"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function createLiveSessionAction(_prev: unknown, formData: FormData) {
  const zoom_url = String(formData.get("zoom_url") ?? "").trim();
  const scheduled_at = String(formData.get("scheduled_at") ?? "").trim();
  if (!zoom_url || !scheduled_at) return { error: "Zoom URL and date/time are required." };

  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Admin client unavailable." };

  const { error } = await supabase.from("live_sessions").insert({ zoom_url, scheduled_at });
  if (error) return { error: error.message };

  revalidatePath("/admin/live-sessions");
  revalidatePath("/live-session");
  return { success: true };
}

export async function deleteLiveSessionAction(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();
  if (!id) return;

  const supabase = getSupabaseAdmin();
  if (!supabase) return;

  await supabase.from("live_sessions").delete().eq("id", id);
  revalidatePath("/admin/live-sessions");
  revalidatePath("/live-session");
}
