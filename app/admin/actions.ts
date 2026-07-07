"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSupabaseAdmin } from "@/lib/supabase";

export interface ActionResult {
  error?: string;
}

// ── Station helpers ───────────────────────────────────────────────────────────

function parseLines(raw: string): string[] {
  return raw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

function stationFromForm(formData: FormData) {
  return {
    number: parseInt(String(formData.get("number") ?? "0"), 10),
    title: String(formData.get("title") ?? "").trim(),
    subject: String(formData.get("subject") ?? "").trim(),
    consultation_type: String(
      formData.get("consultation_type") ?? "Video Consultation"
    ),
    published: formData.get("published") === "true",
    patient_name: String(formData.get("patient_name") ?? "").trim(),
    patient_age: String(formData.get("patient_age") ?? "").trim(),
    pmh: parseLines(String(formData.get("pmh") ?? "")),
    medications_and_allergies: parseLines(String(formData.get("medications_and_allergies") ?? "")),
    recent_notes: String(formData.get("recent_notes") ?? "").trim() || null,
    reason_for_consultation: String(
      formData.get("reason_for_consultation") ?? ""
    ).trim(),
    opening_statement: String(formData.get("opening_statement") ?? "").trim(),
    if_asked_further: String(formData.get("if_asked_further") ?? "").trim(),
    only_if_asked: parseLines(String(formData.get("only_if_asked") ?? "")),
    social_history: String(formData.get("social_history") ?? "").trim(),
    ice_ideas: String(formData.get("ice_ideas") ?? "").trim(),
    ice_concerns: String(formData.get("ice_concerns") ?? "").trim(),
    ice_expectations: String(formData.get("ice_expectations") ?? "").trim(),
    scenarios: parseLines(String(formData.get("scenarios") ?? "")),
    question_for_doctor:
      String(formData.get("question_for_doctor") ?? "").trim() || null,
    role_player_instruction:
      String(formData.get("role_player_instruction") ?? "").trim() || null,
    data_gathering: parseLines(String(formData.get("data_gathering") ?? "")),
    management: parseLines(String(formData.get("management") ?? "")),
    example_explanation: String(
      formData.get("example_explanation") ?? ""
    ).trim(),
    key_takeaways: parseLines(String(formData.get("key_takeaways") ?? "")),
    editor_video_url:
      String(formData.get("editor_video_url") ?? "").trim() || null,
  };
}

// ── Create station ─────────────────────────────────────────────────────────────

export async function createStationAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Database not available." };

  const payload = stationFromForm(formData);
  if (!payload.title || !payload.subject || !payload.number) {
    return { error: "Number, title, and subject are required." };
  }

  const { error } = await supabase.from("stations").insert(payload);
  if (error) return { error: error.message };

  revalidatePath("/admin/stations");
  revalidatePath("/case-bank");
  redirect("/admin/stations");
}

// ── Update station ─────────────────────────────────────────────────────────────

export async function updateStationAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Database not available." };

  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Station ID missing." };

  const payload = stationFromForm(formData);

  const { error } = await supabase
    .from("stations")
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/stations");
  revalidatePath(`/case-bank/${payload.number}`);
  redirect("/admin/stations");
}

// ── Toggle published ──────────────────────────────────────────────────────────

export async function toggleStationPublishedAction(
  formData: FormData
): Promise<void> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return;

  const id = String(formData.get("id") ?? "");
  const published = formData.get("published") === "true";

  await supabase.from("stations").update({ published }).eq("id", id);

  revalidatePath("/admin/stations");
  revalidatePath("/case-bank");
}

// ── Delete station ─────────────────────────────────────────────────────────────

export async function deleteStationAction(id: string): Promise<ActionResult> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Database not available." };

  await supabase.from("station_notes").delete().eq("station_id", id);
  await supabase.from("station_stars").delete().eq("station_id", id);
  await supabase.from("station_attempts").delete().eq("station_id", id);
  await supabase.from("station_reports").delete().eq("station_id", id);

  const { error } = await supabase.from("stations").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/stations");
  revalidatePath("/case-bank");
  return {};
}

// ── Video Course Management ────────────────────────────────────────────────────

function videoCourseSystemFromForm(formData: FormData) {
  return {
    title: String(formData.get("title") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim() || null,
    bunny_video_id: String(formData.get("bunny_video_id") ?? "").trim() || null,
    thumbnail_url: String(formData.get("thumbnail_url") ?? "").trim() || null,
    duration_minutes: parseInt(String(formData.get("duration_minutes") ?? ""), 10) || null,
    display_order: parseInt(String(formData.get("display_order") ?? "0"), 10),
    published: formData.get("published") === "true",
  };
}

export async function createVideoSystemAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Database not available." };

  const payload = videoCourseSystemFromForm(formData);
  if (!payload.title) return { error: "Title is required." };

  const { error } = await supabase.from("video_course_systems").insert(payload);
  if (error) return { error: error.message };

  revalidatePath("/admin/video-course");
  revalidatePath("/video-course");
  redirect("/admin/video-course");
}

export async function updateVideoSystemAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Database not available." };

  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "System ID missing." };

  const payload = videoCourseSystemFromForm(formData);

  const { error } = await supabase
    .from("video_course_systems")
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/video-course");
  revalidatePath("/video-course");
  redirect("/admin/video-course");
}

export async function toggleVideoSystemPublishedAction(
  formData: FormData
): Promise<void> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return;

  const id = String(formData.get("id") ?? "");
  const published = formData.get("published") === "true";

  await supabase.from("video_course_systems").update({ published }).eq("id", id);

  revalidatePath("/admin/video-course");
  revalidatePath("/video-course");
}

export async function deleteVideoSystemAction(id: string): Promise<ActionResult> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Database not available." };

  const { error } = await supabase.from("video_course_systems").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/video-course");
  revalidatePath("/video-course");
  return {};
}

export async function reorderVideoLessonsAction(
  items: { id: string; display_order: number }[]
): Promise<ActionResult> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Database not available." };

  for (const item of items) {
    const { error } = await supabase
      .from("video_course_systems")
      .update({ display_order: item.display_order })
      .eq("id", item.id);
    if (error) return { error: error.message };
  }

  revalidatePath("/admin/video-course");
  revalidatePath("/video-course");
  return {};
}

// ── Promo Code Settings ───────────────────────────────────────────────────────

export async function savePromoCodeSettingsAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult & { ok?: boolean }> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Database not available." };

  const newCode = String(formData.get("PROMO_CODE_VALUE") ?? "").trim().toUpperCase();
  const active = formData.get("PROMO_CODE_ACTIVE") === "true" ? "true" : "false";
  const expiry = String(formData.get("PROMO_CODE_EXPIRY") ?? "").trim();
  const maxUses = String(formData.get("PROMO_CODE_MAX_USES") ?? "10").trim();

  // Check if code changed → reset uses
  const { data: existing } = await supabase
    .from("settings")
    .select("value")
    .eq("key", "PROMO_CODE_VALUE")
    .maybeSingle();
  const codeChanged = existing?.value !== newCode;

  const upserts = [
    { key: "PROMO_CODE_VALUE", value: newCode },
    { key: "PROMO_CODE_ACTIVE", value: active },
    { key: "PROMO_CODE_EXPIRY", value: expiry },
    { key: "PROMO_CODE_MAX_USES", value: maxUses },
    ...(codeChanged ? [{ key: "PROMO_CODE_USES", value: "0" }] : []),
  ];

  const { error } = await supabase.from("settings").upsert(upserts, { onConflict: "key" });
  if (error) return { error: error.message };

  revalidatePath("/admin/promo-codes");
  return { ok: true };
}

// ── Homepage Videos ───────────────────────────────────────────────────────────

function homepageVideoFromForm(formData: FormData) {
  return {
    title: String(formData.get("title") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim() || null,
    bunny_video_id: String(formData.get("bunny_video_id") ?? "").trim() || null,
    display_order: parseInt(String(formData.get("display_order") ?? "1"), 10) || 1,
    published: formData.get("published") === "true",
  };
}

export async function createHomepageVideoAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Database not available." };

  const payload = homepageVideoFromForm(formData);
  if (!payload.title) return { error: "Title is required." };

  const { error } = await supabase.from("homepage_videos").insert(payload);
  if (error) return { error: error.message };

  revalidatePath("/admin/homepage-videos");
  revalidatePath("/");
  redirect("/admin/homepage-videos");
}

export async function updateHomepageVideoAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Database not available." };

  const id = String(formData.get("id") ?? "");
  const payload = homepageVideoFromForm(formData);
  if (!payload.title) return { error: "Title is required." };

  const { error } = await supabase.from("homepage_videos").update(payload).eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/homepage-videos");
  revalidatePath("/");
  redirect("/admin/homepage-videos");
}

export async function toggleHomepageVideoPublishedAction(formData: FormData) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return;

  const id = String(formData.get("id"));
  const published = formData.get("published") === "true";
  await supabase.from("homepage_videos").update({ published }).eq("id", id);
  revalidatePath("/admin/homepage-videos");
  revalidatePath("/");
}

export async function deleteHomepageVideoAction(id: string): Promise<ActionResult> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Database not available." };

  const { error } = await supabase.from("homepage_videos").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/homepage-videos");
  revalidatePath("/");
  return {};
}

export async function reorderHomepageVideosAction(
  items: { id: string; display_order: number }[]
): Promise<ActionResult> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Database not available." };

  for (const item of items) {
    const { error } = await supabase
      .from("homepage_videos")
      .update({ display_order: item.display_order })
      .eq("id", item.id);
    if (error) return { error: error.message };
  }

  revalidatePath("/admin/homepage-videos");
  revalidatePath("/");
  return {};
}

// ── Case Bank User Management ──────────────────────────────────────────────────

export async function createCaseBankUser(
  _prev: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Database not available." };

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const displayName = String(formData.get("display_name") ?? "").trim();
  const initials = String(formData.get("initials") ?? "").trim().toUpperCase().slice(0, 2);
  const grantAccess = formData.get("grant_access") === "true";
  const expiresAtRaw = String(formData.get("expires_at") ?? "").trim();

  if (!email || !password || !displayName || !initials) {
    return { error: "Email, password, display name, and initials are required." };
  }

  const { data: authData, error: authErr } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (authErr || !authData.user) {
    return { error: authErr?.message ?? "Failed to create auth user." };
  }

  const userId = authData.user.id;

  const { error: profileErr } = await supabase
    .from("user_profiles")
    .insert({ id: userId, display_name: displayName, initials });

  if (profileErr) {
    await supabase.auth.admin.deleteUser(userId);
    return { error: profileErr.message };
  }

  if (grantAccess && expiresAtRaw) {
    const { error: accessErr } = await supabase.from("user_access").upsert({
      user_id: userId,
      has_programme: true,
      expires_at: new Date(expiresAtRaw + "T23:59:59Z").toISOString(),
    });
    if (accessErr) {
      return { error: `User created but access grant failed: ${accessErr.message}` };
    }
  }

  revalidatePath("/admin/case-bank-users");
  return {};
}

export async function grantUserAccess(
  _prev: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Database not available." };

  const userId = String(formData.get("user_id") ?? "");
  const expiresAtRaw = String(formData.get("expires_at") ?? "").trim();

  if (!userId || !expiresAtRaw) {
    return { error: "User and expiry date are required." };
  }

  const expiresAt = new Date(expiresAtRaw + "T23:59:59Z").toISOString();

  const { data: existing } = await supabase
    .from("user_access")
    .select("expires_at")
    .eq("user_id", userId)
    .single<{ expires_at: string | null }>();

  const newExpiry =
    existing?.expires_at && existing.expires_at > expiresAt
      ? existing.expires_at
      : expiresAt;

  const { error } = await supabase.from("user_access").upsert({
    user_id: userId,
    has_programme: true,
    expires_at: newExpiry,
    renewal_reminder_sent_at: null,
  });

  if (error) return { error: error.message };

  revalidatePath("/admin/case-bank-users");
  return {};
}

export async function revokeUserAccess(userId: string): Promise<ActionResult> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Database not available." };

  const { error } = await supabase.from("user_access").delete().eq("user_id", userId);
  if (error) return { error: error.message };

  revalidatePath("/admin/case-bank-users");
  return {};
}

export async function deleteCaseBankUser(userId: string): Promise<ActionResult> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Database not available." };

  await supabase.from("room_participants").delete().eq("user_id", userId);
  await supabase.from("study_rooms").delete().eq("host_user_id", userId);
  await supabase
    .from("friend_requests")
    .delete()
    .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`);
  await supabase.from("station_reports").delete().eq("user_id", userId);
  await supabase.from("station_attempts").delete().eq("user_id", userId);
  await supabase.from("station_notes").delete().eq("user_id", userId);
  await supabase.from("station_stars").delete().eq("user_id", userId);
  await supabase.from("user_access").delete().eq("user_id", userId);
  await supabase.from("user_profiles").delete().eq("id", userId);

  const { error } = await supabase.auth.admin.deleteUser(userId);
  if (error) return { error: error.message };

  revalidatePath("/admin/case-bank-users");
  return {};
}
