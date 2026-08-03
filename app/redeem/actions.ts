"use server";

import { createSupabaseServerClient } from "@/lib/supabase-case-bank";
import { getSupabaseAdmin } from "@/lib/supabase";
import { redirect } from "next/navigation";

export interface RedeemResult {
  error?: string;
  success?: boolean;
}

// Used when already logged in — returns success state for in-page UI
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

  return redeemForUser(admin, user.id, raw);
}

// Used when not logged in — creates account, signs in, redeems, redirects
export async function redeemWithSignupAction(
  _prev: RedeemResult,
  formData: FormData
): Promise<RedeemResult> {
  const firstName = String(formData.get("first_name") ?? "").trim();
  const lastName  = String(formData.get("last_name")  ?? "").trim();
  const email     = String(formData.get("email")    ?? "").trim().toLowerCase();
  const password  = String(formData.get("password") ?? "");
  const raw       = String(formData.get("code")     ?? "").trim().toUpperCase();

  if (!firstName || !email || !password || !raw) {
    return { error: "All fields are required." };
  }
  if (password.length < 6) {
    return { error: "Password must be at least 6 characters." };
  }

  const admin = getSupabaseAdmin();
  if (!admin) return { error: "Service unavailable." };

  // Validate code before creating the account
  const { data: codeRow } = await admin
    .from("webinar_codes")
    .select("id, active, expires_at, use_count, max_uses")
    .eq("code", raw)
    .single<{ id: string; active: boolean; expires_at: string | null; use_count: number; max_uses: number }>();

  if (!codeRow)        return { error: "Invalid code. Please check and try again." };
  if (!codeRow.active) return { error: "This code is no longer active." };
  if (codeRow.expires_at && new Date(codeRow.expires_at) < new Date()) return { error: "This code has expired." };
  if (codeRow.use_count >= codeRow.max_uses) return { error: "This code has reached its maximum number of uses." };

  const displayName = lastName ? `${firstName} ${lastName}` : firstName;
  const initials    = `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase() || "?";

  // Create user via admin — email_confirm:true skips the verification email
  const { data: created, error: createErr } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { display_name: displayName },
  });

  let userId: string;

  if (createErr) {
    // User already exists — try to sign them in and redeem on their existing account
    if (createErr.message.toLowerCase().includes("already")) {
      const supabase = await createSupabaseServerClient();
      const { data: signIn, error: signInErr } = await supabase.auth.signInWithPassword({ email, password });
      if (signInErr || !signIn.user) {
        return { error: "An account with this email already exists. Sign in at /login instead." };
      }
      userId = signIn.user.id;
    } else {
      return { error: createErr.message };
    }
  } else {
    if (!created.user) return { error: "Failed to create account. Try again." };
    userId = created.user.id;

    // Insert profile
    await admin.from("user_profiles").upsert({
      id: userId,
      display_name: displayName,
      initials,
    });

    // Sign in to set session cookies
    const supabase = await createSupabaseServerClient();
    const { error: signInErr } = await supabase.auth.signInWithPassword({ email, password });
    if (signInErr) return { error: "Account created but sign-in failed. Try logging in manually." };
  }

  const result = await redeemForUser(admin, userId, raw);
  if (result.error) return result;

  redirect("/case-bank");
}

// Shared redemption logic
async function redeemForUser(
  admin: ReturnType<typeof getSupabaseAdmin>,
  userId: string,
  code: string
): Promise<RedeemResult> {
  if (!admin) return { error: "Service unavailable." };

  const { data: codeRow } = await admin
    .from("webinar_codes")
    .select("id, active, use_count, max_uses, expires_at, recording_credits")
    .eq("code", code)
    .single<{ id: string; active: boolean; use_count: number; max_uses: number; expires_at: string | null; recording_credits: number }>();

  if (!codeRow)        return { error: "Invalid code. Please check and try again." };
  if (!codeRow.active) return { error: "This code is no longer active." };
  if (codeRow.expires_at && new Date(codeRow.expires_at) < new Date()) return { error: "This code has expired." };
  if (codeRow.use_count >= (codeRow.max_uses ?? 10)) return { error: "This code has reached its maximum number of uses." };

  // Prevent same account from redeeming the same code twice
  const { data: alreadyRedeemed } = await admin
    .from("webinar_code_redemptions")
    .select("id")
    .eq("user_id", userId)
    .eq("code_id", codeRow.id)
    .maybeSingle();

  if (alreadyRedeemed) return { error: "You have already redeemed this code." };

  const credits = codeRow.recording_credits ?? 3;

  const { data: existing } = await admin
    .from("recording_credits")
    .select("balance, total_purchased")
    .eq("user_id", userId)
    .single<{ balance: number; total_purchased: number }>();

  const { error: upsertErr } = await admin.from("recording_credits").upsert(
    {
      user_id: userId,
      balance: (existing?.balance ?? 0) + credits,
      total_purchased: (existing?.total_purchased ?? 0) + credits,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );
  if (upsertErr) return { error: "Failed to add credits. Please try again." };

  // Record this redemption (prevents reuse + updates use_count)
  await admin.from("webinar_code_redemptions").insert({ user_id: userId, code_id: codeRow.id });
  await admin.from("webinar_codes").update({ use_count: codeRow.use_count + 1 }).eq("id", codeRow.id);

  return { success: true };
}
