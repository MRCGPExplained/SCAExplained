"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseAdmin } from "@/lib/supabase";

function randomCode(len = 8) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

export async function createWebinarCodeAction(_prev: unknown, formData: FormData) {
  const label = String(formData.get("label") ?? "").trim();
  const access_days = parseInt(String(formData.get("access_days") ?? "30"), 10);
  const customCode = String(formData.get("code") ?? "").trim().toUpperCase();
  const expiresAtRaw = String(formData.get("expires_at") ?? "").trim();

  if (!label) return { error: "Label is required." };
  if (isNaN(access_days) || access_days < 1) return { error: "Access days must be a positive number." };

  const code = customCode || randomCode();
  const expires_at = expiresAtRaw ? new Date(expiresAtRaw + "T23:59:59Z").toISOString() : null;

  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Admin client unavailable." };

  const { error } = await supabase.from("webinar_codes").insert({ code, label, access_days, expires_at });
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
