"use server";

import { getSupabaseAdmin } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function updateSettingAction(key: string, value: string): Promise<{ error?: string }> {
  const admin = getSupabaseAdmin();
  if (!admin) return { error: "Server config error." };

  const { error } = await admin
    .from("site_settings")
    .upsert({ key, value }, { onConflict: "key" });

  if (error) return { error: error.message };
  revalidatePath("/admin/settings");
  return {};
}
