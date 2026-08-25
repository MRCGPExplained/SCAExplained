"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSupabaseAdmin } from "@/lib/supabase";

export interface ActionResult {
  error?: string;
  success?: boolean;
}

// ── Station helpers ───────────────────────────────────────────────────────────

function parseLines(raw: string): string[] {
  return raw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

function stationFromForm(formData: FormData) {
  const imageUrlsRaw = String(formData.get("image_urls_manual") ?? "").trim();
  const imageUrls = imageUrlsRaw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  // Status is a single 3-way control (draft/published/archived) mapped onto the
  // two underlying booleans. Archived always implies unpublished.
  const status = String(formData.get("status") ?? "draft");

  // Trainer Q&A is submitted as a JSON array of {question, answer}. Keep only
  // rows where both sides have content.
  let trainerQa: { question: string; answer: string }[] = [];
  try {
    const parsed = JSON.parse(String(formData.get("trainer_qa") ?? "[]"));
    if (Array.isArray(parsed)) {
      trainerQa = parsed
        .map((r) => ({
          question: String(r?.question ?? "").trim(),
          answer: String(r?.answer ?? "").trim(),
        }))
        .filter((r) => r.question && r.answer);
    }
  } catch {
    trainerQa = [];
  }

  return {
    number: parseInt(String(formData.get("number") ?? "0"), 10),
    title: String(formData.get("title") ?? "").trim(),
    subject: String(formData.get("subject") ?? "").trim(),
    consultation_type: String(
      formData.get("consultation_type") ?? "Video Consultation"
    ),
    published: status === "published",
    archived: status === "archived",
    admin_note: String(formData.get("admin_note") ?? "").trim() || null,
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
    question_for_doctor: parseLines(String(formData.get("question_for_doctor") ?? "")),
    dilemma: String(formData.get("dilemma") ?? "").trim() || null,
    data_gathering: parseLines(String(formData.get("data_gathering") ?? "")),
    management: parseLines(String(formData.get("management") ?? "")),
    example_explanation: String(
      formData.get("example_explanation") ?? ""
    ).trim(),
    message: parseLines(String(formData.get("message") ?? "")),
    trainer_qa: trainerQa,
    audio_notes:
      String(formData.get("audio_notes") ?? "").trim() || null,
    image_urls: imageUrls.length > 0 ? imageUrls : null,
    marking_notes_data_gathering:
      String(formData.get("marking_notes_data_gathering") ?? "").trim() || null,
    marking_notes_clinical_management:
      String(formData.get("marking_notes_clinical_management") ?? "").trim() || null,
    marking_notes_relating_to_others:
      String(formData.get("marking_notes_relating_to_others") ?? "").trim() || null,
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

// ── Image Management ──────────────────────────────────────────────────────────

export async function uploadImageAction(
  stationId: string,
  filename: string,
  fileBuffer: ArrayBuffer
): Promise<{ imageUrl: string } | { error: string }> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Database not available." };

  const ext = filename.split(".").pop()?.toLowerCase() ?? "jpg";
  const timestamp = Date.now();
  const path = `${stationId}/${timestamp}.${ext}`;

  const { error: uploadErr } = await supabase.storage
    .from("station-images")
    .upload(path, new Uint8Array(fileBuffer), {
      contentType: `image/${ext === "jpg" ? "jpeg" : ext === "png" ? "png" : "webp"}`,
    });

  if (uploadErr) return { error: uploadErr.message };

  const { data: { publicUrl } } = supabase.storage
    .from("station-images")
    .getPublicUrl(path);

  return { imageUrl: publicUrl };
}

export async function deleteImageAction(
  stationId: string,
  imageUrl: string
): Promise<ActionResult> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Database not available." };

  const { data: station, error: fetchErr } = await supabase
    .from("stations")
    .select("number, image_urls")
    .eq("id", stationId)
    .single<{ number: number; image_urls: string[] | null }>();

  if (fetchErr) return { error: fetchErr.message };

  const marker = "/object/public/station-images/";
  const idx = imageUrl.indexOf(marker);
  if (idx !== -1) {
    const storagePath = imageUrl.slice(idx + marker.length);
    await supabase.storage.from("station-images").remove([storagePath]);
  }

  const updatedUrls = (station.image_urls ?? []).filter((url) => url !== imageUrl);

  const { error } = await supabase
    .from("stations")
    .update({ image_urls: updatedUrls })
    .eq("id", stationId);

  if (error) return { error: error.message };

  if (station?.number) revalidatePath(`/case-bank/${station.number}`);
  return { success: true };
}

// ── Audio Lesson Management ───────────────────────────────────────────────────

export async function getAudioUploadUrlAction(
  stationId: string,
  filename: string
): Promise<{ signedUrl: string; path: string } | { error: string }> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Database not available." };

  const ext = filename.split(".").pop()?.toLowerCase() ?? "mp3";
  const path = `${stationId}/lesson.${ext}`;

  const { data, error } = await supabase.storage
    .from("audio-lessons")
    .createSignedUploadUrl(path);

  if (error || !data) return { error: error?.message ?? "Failed to create upload URL." };
  return { signedUrl: data.signedUrl, path: data.path };
}

export async function confirmAudioUploadAction(
  stationId: string,
  path: string
): Promise<{ audioUrl: string } | { error: string }> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Database not available." };

  const { data: { publicUrl } } = supabase.storage
    .from("audio-lessons")
    .getPublicUrl(path);

  const { data: station, error: fetchErr } = await supabase
    .from("stations")
    .select("number")
    .eq("id", stationId)
    .single<{ number: number }>();

  if (fetchErr) return { error: fetchErr.message };

  const { error } = await supabase
    .from("stations")
    .update({ audio_url: publicUrl })
    .eq("id", stationId);

  if (error) return { error: error.message };

  revalidatePath(`/case-bank/${station.number}`);
  return { audioUrl: publicUrl };
}

export async function deleteAudioAction(stationId: string): Promise<ActionResult> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Database not available." };

  const { data: station } = await supabase
    .from("stations")
    .select("audio_url, number")
    .eq("id", stationId)
    .single<{ audio_url: string | null; number: number }>();

  if (station?.audio_url) {
    const marker = "/object/public/audio-lessons/";
    const idx = station.audio_url.indexOf(marker);
    if (idx !== -1) {
      const storagePath = station.audio_url.slice(idx + marker.length);
      await supabase.storage.from("audio-lessons").remove([storagePath]);
    }
  }

  const { error } = await supabase
    .from("stations")
    .update({ audio_url: null })
    .eq("id", stationId);

  if (error) return { error: error.message };

  if (station?.number) revalidatePath(`/case-bank/${station.number}`);
  return { success: true };
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
  const firstName = String(formData.get("first_name") ?? "").trim();
  const lastName = String(formData.get("last_name") ?? "").trim();
  const expiresAtRaw = String(formData.get("expires_at") ?? "").trim();

  if (!email || !password || !firstName || !lastName) {
    return { error: "Email, password, first name, and last name are required." };
  }

  const displayName = `${firstName} ${lastName}`;
  const initials = `${firstName[0]}${lastName[0]}`.toUpperCase();

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

  if (expiresAtRaw) {
    const expiry = new Date(expiresAtRaw + "T23:59:59Z").toISOString();
    const { error: accessErr } = await supabase.from("user_access").upsert({
      user_id: userId,
      has_programme: true,
      expires_at: expiry,
      has_case_bank: true,
      case_bank_expires_at: expiry,
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
    .select("expires_at, case_bank_expires_at")
    .eq("user_id", userId)
    .single<{ expires_at: string | null; case_bank_expires_at: string | null }>();

  const newExpiry =
    existing?.expires_at && existing.expires_at > expiresAt
      ? existing.expires_at
      : expiresAt;
  const newCaseBankExpiry =
    existing?.case_bank_expires_at && existing.case_bank_expires_at > expiresAt
      ? existing.case_bank_expires_at
      : expiresAt;

  const { error } = await supabase.from("user_access").upsert({
    user_id: userId,
    has_programme: true,
    expires_at: newExpiry,
    has_case_bank: true,
    case_bank_expires_at: newCaseBankExpiry,
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
  await supabase.from("station_stars").delete().eq("user_id", userId);
  await supabase.from("user_access").delete().eq("user_id", userId);
  await supabase.from("user_profiles").delete().eq("id", userId);

  const { error } = await supabase.auth.admin.deleteUser(userId);
  if (error) return { error: error.message };

  revalidatePath("/admin/case-bank-users");
  return {};
}

// ── Recorded Consultations ────────────────────────────────────────────────────

function recordedConsultationFromForm(formData: FormData) {
  return {
    title: String(formData.get("title") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim() || null,
    bunny_video_id: String(formData.get("bunny_video_id") ?? "").trim() || null,
    thumbnail_url: String(formData.get("thumbnail_url") ?? "").trim() || null,
    duration_minutes: parseInt(String(formData.get("duration_minutes") ?? ""), 10) || null,
    display_order: parseInt(String(formData.get("display_order") ?? "1"), 10),
    published: formData.get("published") === "true",
  };
}

export async function createRecordedConsultationAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Database not available." };

  const payload = recordedConsultationFromForm(formData);
  if (!payload.title) return { error: "Title is required." };

  const { error } = await supabase.from("recorded_consultations").insert(payload);
  if (error) return { error: error.message };

  revalidatePath("/admin/recorded-consultations");
  redirect("/admin/recorded-consultations");
}

export async function updateRecordedConsultationAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Database not available." };

  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "ID missing." };

  const payload = recordedConsultationFromForm(formData);

  const { error } = await supabase
    .from("recorded_consultations")
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/recorded-consultations");
  redirect("/admin/recorded-consultations");
}

export async function toggleRecordedConsultationPublishedAction(formData: FormData) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return;

  const id = String(formData.get("id") ?? "");
  const published = formData.get("published") === "true";

  await supabase.from("recorded_consultations").update({ published }).eq("id", id);
  revalidatePath("/admin/recorded-consultations");
}

export async function deleteRecordedConsultationAction(id: string): Promise<ActionResult> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Database not available." };

  const { error } = await supabase.from("recorded_consultations").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/recorded-consultations");
  return {};
}

export async function reorderRecordedConsultationsAction(
  items: { id: string; display_order: number }[]
): Promise<ActionResult> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Database not available." };

  for (const item of items) {
    const { error } = await supabase
      .from("recorded_consultations")
      .update({ display_order: item.display_order })
      .eq("id", item.id);
    if (error) return { error: error.message };
  }

  revalidatePath("/admin/recorded-consultations");
  return {};
}

// ── Recording credits management ──────────────────────────────────────────────

export async function setRecordingCreditsAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult & { ok?: boolean }> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Database not available." };

  const userId = String(formData.get("user_id") ?? "").trim();
  const mode = String(formData.get("mode") ?? "set"); // "set" | "add" | "subtract"
  const amount = parseInt(String(formData.get("amount") ?? "0"), 10);

  if (!userId || isNaN(amount) || amount < 0) return { error: "Invalid input." };

  if (mode === "set") {
    const { error } = await supabase.from("recording_credits").upsert({
      user_id: userId,
      balance: amount,
      total_purchased: amount,
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id" });
    if (error) return { error: error.message };
  } else {
    const { data: existing } = await supabase
      .from("recording_credits")
      .select("balance, total_purchased")
      .eq("user_id", userId)
      .single<{ balance: number; total_purchased: number }>();

    const current = existing?.balance ?? 0;
    const newBalance = mode === "add" ? current + amount : Math.max(0, current - amount);
    const newTotal = mode === "add" ? (existing?.total_purchased ?? 0) + amount : (existing?.total_purchased ?? 0);

    const { error } = await supabase.from("recording_credits").upsert({
      user_id: userId,
      balance: newBalance,
      total_purchased: newTotal,
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id" });
    if (error) return { error: error.message };
  }

  revalidatePath("/admin/examiners");
  return { ok: true };
}

// ── Examiner management ───────────────────────────────────────────────────────

async function findAuthUserByEmail(supabase: ReturnType<typeof getSupabaseAdmin>, email: string): Promise<string | null> {
  if (!supabase) return null;
  const { data } = await supabase.auth.admin.listUsers({ perPage: 1000 });
  const found = (data?.users ?? []).find((u: { email?: string; id: string }) => u.email?.toLowerCase() === email.toLowerCase());
  return found?.id ?? null;
}

export async function createExaminerAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Database not available." };

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const passcode = String(formData.get("passcode") ?? "").trim();

  if (!name || !email || !passcode) return { error: "Name, email and passcode are all required." };

  // Insert examiner row
  const { error: examErr } = await supabase.from("examiners").insert({ name, email, passcode });
  if (examErr) return { error: examErr.message };

  // Create Supabase auth user (passcode is their password)
  const nameParts = name.trim().split(" ");
  const initials = nameParts.map((p: string) => p[0]).join("").toUpperCase().slice(0, 2);

  const { data: authData, error: authErr } = await supabase.auth.admin.createUser({
    email,
    password: passcode,
    email_confirm: true,
    user_metadata: { display_name: name },
  });

  if (!authErr && authData?.user) {
    const userId = authData.user.id;
    await supabase.from("user_profiles").upsert({ id: userId, display_name: name, initials, beta: false });
    await supabase.from("user_access").upsert({
      user_id: userId,
      has_programme: true,
      expires_at: "2099-12-31T23:59:59Z",
      has_case_bank: true,
      case_bank_expires_at: "2099-12-31T23:59:59Z",
      renewal_reminder_sent_at: null,
    });
  }

  revalidatePath("/admin/examiners");
  return { success: true };
}

export async function updateExaminerAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Database not available." };

  const id = String(formData.get("id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const passcode = String(formData.get("passcode") ?? "").trim();

  if (!id || !name || !email || !passcode) return { error: "All fields required." };

  // Fetch current email to find auth user
  const { data: current } = await supabase
    .from("examiners")
    .select("email")
    .eq("id", id)
    .single<{ email: string }>();

  const { error } = await supabase.from("examiners").update({ name, email, passcode }).eq("id", id);
  if (error) return { error: error.message };

  // Sync auth user
  const lookupEmail = current?.email ?? email;
  const authUserId = await findAuthUserByEmail(supabase, lookupEmail);
  if (authUserId) {
    const updates: Record<string, unknown> = { password: passcode, user_metadata: { display_name: name } };
    if (email !== lookupEmail) updates.email = email;
    await supabase.auth.admin.updateUserById(authUserId, updates);
  }

  revalidatePath("/admin/examiners");
  return { success: true };
}

export async function toggleExaminerIsAdminAction(id: string, isAdmin: boolean): Promise<ActionResult> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Database not available." };

  const { error } = await supabase.from("examiners").update({ is_admin: isAdmin }).eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/examiners");
  return {};
}

export async function deleteExaminerAction(id: string): Promise<ActionResult> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Database not available." };

  // Fetch email before deleting so we can clean up auth
  const { data: examiner } = await supabase
    .from("examiners")
    .select("email")
    .eq("id", id)
    .single<{ email: string }>();

  const { error } = await supabase.from("examiners").delete().eq("id", id);
  if (error) return { error: error.message };

  // Delete matching auth user
  if (examiner?.email) {
    const authUserId = await findAuthUserByEmail(supabase, examiner.email);
    if (authUserId) await supabase.auth.admin.deleteUser(authUserId);
  }

  revalidatePath("/admin/examiners");
  return {};
}

// ── Recording bypass settings ─────────────────────────────────────────────────

export async function updateBypassSettingsAction(
  _prev: unknown,
  formData: FormData
): Promise<ActionResult> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Database not available." };

  const enabled = formData.get("bypass_enabled") === "true";
  const emails = String(formData.get("bypass_emails") ?? "").trim();

  const { error } = await supabase.from("site_settings").upsert([
    { key: "recording_bypass_enabled", value: enabled ? "true" : "false" },
    { key: "recording_bypass_emails", value: emails },
  ]);

  if (error) return { error: error.message };

  revalidatePath("/admin/examiners");
  return {};
}

export async function saveAiPromptAction(
  _prev: unknown,
  formData: FormData
): Promise<ActionResult> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Database not available." };

  const prompt = String(formData.get("ai_prompt") ?? "").trim();
  if (!prompt) return { error: "Prompt cannot be empty." };

  const { error } = await supabase.from("site_settings").upsert([
    { key: "ai_grading_prompt", value: prompt },
  ]);

  if (error) return { error: error.message };
  revalidatePath("/admin/examiners");
  return { success: true };
}

export async function clearAiPromptAction(): Promise<ActionResult> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Database not available." };

  await supabase.from("site_settings").delete().eq("key", "ai_grading_prompt");
  revalidatePath("/admin/examiners");
  return { success: true };
}

export async function toggleDeepgramAction(enabled: boolean): Promise<ActionResult> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Database not available." };

  const { error } = await supabase
    .from("site_settings")
    .upsert([{ key: "deepgram_enabled", value: enabled ? "true" : "false" }]);

  if (error) return { error: error.message };
  revalidatePath("/admin/examiners");
  return { success: true };
}

export async function setVercelPlanAction(plan: "hobby" | "pro"): Promise<ActionResult> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Database not available." };

  const { error } = await supabase
    .from("site_settings")
    .upsert([{ key: "vercel_plan", value: plan }]);

  if (error) return { error: error.message };
  revalidatePath("/admin/examiners");
  return { success: true };
}

export async function toggleResendAction(enabled: boolean): Promise<ActionResult> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Database not available." };

  const { error } = await supabase
    .from("site_settings")
    .upsert([{ key: "resend_enabled", value: enabled ? "true" : "false" }]);

  if (error) return { error: error.message };
  revalidatePath("/admin/examiners");
  return { success: true };
}

export async function toggleDailyCoAction(enabled: boolean): Promise<ActionResult> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Database not available." };

  const { error } = await supabase
    .from("site_settings")
    .upsert([{ key: "daily_co_enabled", value: enabled ? "true" : "false" }]);

  if (error) return { error: error.message };
  revalidatePath("/admin/examiners");
  return { success: true };
}

// ── Admin passcodes ───────────────────────────────────────────────────────────

export async function createAdminPasscodeAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Database not available." };

  const name = String(formData.get("name") ?? "").trim();
  const passcode = String(formData.get("passcode") ?? "").trim();
  if (!name || !passcode) return { error: "Name and passcode are required." };

  const { error } = await supabase.from("admin_passcodes").insert({ name, passcode });
  if (error) return { error: error.message };

  revalidatePath("/admin/examiners");
  return { success: true };
}

export async function updateAdminPasscodeAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Database not available." };

  const id = String(formData.get("id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const passcode = String(formData.get("passcode") ?? "").trim();
  if (!id || !name || !passcode) return { error: "All fields required." };

  const { error } = await supabase.from("admin_passcodes").update({ name, passcode }).eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/examiners");
  return { success: true };
}

export async function deleteAdminPasscodeAction(id: string): Promise<ActionResult> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Database not available." };

  const { error } = await supabase.from("admin_passcodes").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/examiners");
  return {};
}

// ── Beta flag ─────────────────────────────────────────────────────────────────

export async function toggleBetaAction(userId: string, beta: boolean): Promise<ActionResult> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Database not available." };

  const { error } = await supabase
    .from("user_profiles")
    .update({ beta })
    .eq("id", userId);

  if (error) return { error: error.message };

  revalidatePath("/admin/case-bank-users");
  return {};
}

export async function bulkMarkExaminerPaidAction(ids: string[]): Promise<ActionResult> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Database not available." };
  if (!ids.length) return { error: "No recordings selected." };

  const { error } = await supabase
    .from("station_recordings")
    .update({ examiner_paid_at: new Date().toISOString() })
    .in("id", ids);

  if (error) return { error: error.message };

  revalidatePath("/admin/examiners");
  return { success: true };
}

// ── Testimonials ─────────────────────────────────────────────────────────────

function testimonialFromForm(formData: FormData) {
  return {
    quote: String(formData.get("quote") ?? "").trim(),
    name: String(formData.get("name") ?? "").trim(),
    vts: String(formData.get("vts") ?? "").trim() || null,
    sca_date: String(formData.get("sca_date") ?? "").trim() || null,
    photo_url: String(formData.get("photo_url") ?? "").trim() || null,
    initials: String(formData.get("initials") ?? "").trim().slice(0, 2).toUpperCase() || null,
    published: formData.get("published") === "true",
  };
}

export async function createTestimonialAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Database not available." };

  const payload = testimonialFromForm(formData);
  if (!payload.quote) return { error: "Quote is required." };
  if (!payload.name) return { error: "Name is required." };
  if (!payload.initials) return { error: "Initials are required — they're the fallback shown when there's no photo." };

  const { data: last } = await supabase
    .from("testimonials")
    .select("display_order")
    .order("display_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const display_order = (last?.display_order ?? 0) + 1;

  const { error } = await supabase.from("testimonials").insert({ ...payload, display_order });
  if (error) return { error: error.message };

  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  redirect("/admin/testimonials");
}

export async function updateTestimonialAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Database not available." };

  const id = String(formData.get("id") ?? "");
  const payload = testimonialFromForm(formData);
  if (!payload.quote) return { error: "Quote is required." };
  if (!payload.name) return { error: "Name is required." };
  if (!payload.initials) return { error: "Initials are required — they're the fallback shown when there's no photo." };

  const { error } = await supabase.from("testimonials").update(payload).eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  redirect("/admin/testimonials");
}

export async function toggleTestimonialPublishedAction(formData: FormData) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return;

  const id = String(formData.get("id"));
  const published = formData.get("published") === "true";
  await supabase.from("testimonials").update({ published }).eq("id", id);
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
}

export async function deleteTestimonialAction(id: string): Promise<ActionResult> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Database not available." };

  const { error } = await supabase.from("testimonials").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  return {};
}

export async function reorderTestimonialsAction(
  items: { id: string; display_order: number }[]
): Promise<ActionResult> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Database not available." };

  for (const item of items) {
    const { error } = await supabase
      .from("testimonials")
      .update({ display_order: item.display_order })
      .eq("id", item.id);
    if (error) return { error: error.message };
  }

  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  return {};
}

export async function uploadTestimonialPhotoAction(
  formData: FormData
): Promise<{ url?: string; error?: string }> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Database not available." };

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return { error: "No file provided." };
  if (!file.type.startsWith("image/")) return { error: "File must be an image." };

  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const path = `${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage
    .from("testimonial-photos")
    .upload(path, file, { contentType: file.type, upsert: false });
  if (error) return { error: error.message };

  const { data } = supabase.storage.from("testimonial-photos").getPublicUrl(path);
  return { url: data.publicUrl };
}

export async function deleteTestimonialPhotoAction(url: string): Promise<ActionResult> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Database not available." };

  const path = url.split("/testimonial-photos/")[1];
  if (path) await supabase.storage.from("testimonial-photos").remove([decodeURIComponent(path)]);

  return {};
}
