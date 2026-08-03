"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseAdmin } from "@/lib/supabase";

function randomCode(len = 8) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

export async function createWebinarCodeAction(_prev: unknown, formData: FormData) {
  const label = String(formData.get("label") ?? "").trim();
  const recording_credits = parseInt(String(formData.get("recording_credits") ?? "2"), 10);
  const max_uses = parseInt(String(formData.get("max_uses") ?? "10"), 10);
  const customCode = String(formData.get("code") ?? "").trim().toUpperCase();
  const expiresAtRaw = String(formData.get("expires_at") ?? "").trim();

  if (!label) return { error: "Label is required." };
  if (isNaN(recording_credits) || recording_credits < 1) return { error: "Recording credits must be at least 1." };
  if (isNaN(max_uses) || max_uses < 1) return { error: "Max uses must be at least 1." };

  const code = customCode || randomCode();
  const expires_at = expiresAtRaw ? new Date(expiresAtRaw + "T23:59:59Z").toISOString() : null;

  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Admin client unavailable." };

  const { error } = await supabase.from("webinar_codes").insert({ code, label, recording_credits, max_uses, expires_at });
  if (error) {
    if (error.code === "23505") return { error: `Code "${code}" already exists — try a different one.` };
    return { error: error.message };
  }

  revalidatePath("/admin/webinar-codes");
  return { success: true, code };
}

export async function toggleWebinarCodeAction(id: string, active: boolean) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Admin client unavailable." };

  const { error } = await supabase.from("webinar_codes").update({ active }).eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/webinar-codes");
  return { success: true };
}

export async function deleteWebinarCodeAction(id: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return;

  await supabase.from("webinar_codes").delete().eq("id", id);
  revalidatePath("/admin/webinar-codes");
}
