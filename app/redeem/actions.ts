"use server";

import { createSupabaseServerClient } from "@/lib/supabase-case-bank";
import { getSupabaseAdmin } from "@/lib/supabase";

export interface RedeemResult {
  error?: string;
  success?: boolean;
  expiresAt?: string;
}

export async function redeemCodeAction(
  _prev: RedeemResult,
  formData: FormData
): Promise<RedeemResult> {
  const raw = String(formData.get("code") ?? "").trim().toUpperCase();
  if (!raw) return { error: "Please enter a code." };

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in to redeem a code." };

  const admin = getSupabaseAdmin();
  if (!admin) return { error: "Service unavailable." };

  // Look up code
  const { data: codeRow } = await admin
    .from("webinar_codes")
    .select("id, active, access_days")
    .eq("code", raw)
    .single<{ id: string; active: boolean; access_days: number }>();

  if (!codeRow) return { error: "Invalid code. Please check and try again." };
  if (!codeRow.active) return { error: "This code is no longer active." };

  // Calculate expiry: extend from current expiry if already active, else from now
  const { data: existing } = await admin
    .from("user_access")
    .select("expires_at")
    .eq("user_id", user.id)
    .single<{ expires_at: string }>();

  const baseline = existing?.expires_at && new Date(existing.expires_at) > new Date()
    ? new Date(existing.expires_at)
    : new Date();

  const expiresAt = new Date(baseline);
  expiresAt.setDate(expiresAt.getDate() + codeRow.access_days);

  // Grant access
  const { error: upsertErr } = await admin.from("user_access").upsert(
    { user_id: user.id, has_programme: true, expires_at: expiresAt.toISOString() },
    { onConflict: "user_id" }
  );
  if (upsertErr) return { error: "Failed to grant access. Please try again." };

  // Increment use count
  await admin.rpc("increment_webinar_code_use", { code_id: codeRow.id }).catch(() => {
    // Non-fatal — fall back to manual update
    admin.from("webinar_codes")
      .update({ use_count: (codeRow as unknown as { use_count: number }).use_count + 1 })
      .eq("id", codeRow.id);
  });

  return { success: true, expiresAt: expiresAt.toISOString() };
}
