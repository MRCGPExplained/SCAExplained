"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSupabaseAdmin } from "@/lib/supabase";

export interface ActionResult {
  error?: string;
}

// ── helpers ──────────────────────────────────────────────────────────────────

/**
 * Given a YYYY-MM-DD date and HH:MM time, return a full ISO timestamp in
 * Europe/London local time (handles BST / GMT automatically).
 */
function ukTimestamp(date: string, time: string): string {
  // Probe midday UTC on the given date to find the UK offset
  const probe = new Date(`${date}T12:00:00Z`);
  const ukHour = parseInt(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/London",
      hour: "numeric",
      hour12: false,
    }).format(probe),
    10
  );
  const offsetHours = ukHour - 12; // 0 = GMT, 1 = BST
  const sign = offsetHours >= 0 ? "+" : "-";
  const pad = String(Math.abs(offsetHours)).padStart(2, "0");
  return `${date}T${time}:00${sign}${pad}:00`;
}

// ── create event ─────────────────────────────────────────────────────────────

export async function createEvent(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Database not available." };

  const eventType = String(formData.get("event_type") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const date = String(formData.get("date") ?? "");
  const startTime = String(formData.get("start_time") ?? "");
  const endTime = String(formData.get("end_time") ?? "");
  const zoomLink = String(formData.get("zoom_link") ?? "").trim() || null;
  const status = String(formData.get("status") ?? "scheduled");

  if (!eventType || !title || !date || !startTime || !endTime) {
    return { error: "Title, date, start time, and end time are required." };
  }

  const startTs = ukTimestamp(date, startTime);
  const endTs = ukTimestamp(date, endTime);

  const { data: event, error: eventErr } = await supabase
    .from("events")
    .insert({
      event_type: eventType,
      title,
      description: description || null,
      start_time: startTs,
      end_time: endTs,
      zoom_link: zoomLink,
      status,
    })
    .select("id")
    .single<{ id: string }>();

  if (eventErr || !event) {
    return { error: eventErr?.message ?? "Failed to create event." };
  }

  if (eventType === "webinar") {
    const capacity = parseInt(String(formData.get("webinar_capacity") ?? "200"), 10);
    await supabase.from("ticket_types").insert({
      event_id: event.id,
      name: "Webinar (Free)",
      capacity,
      price: 0,
    });
  } else {
    const activeCapacity = parseInt(String(formData.get("active_capacity") ?? "2"), 10);
    const activePricePounds = parseFloat(String(formData.get("active_price") ?? "200"));
    const observerCapacity = parseInt(String(formData.get("observer_capacity") ?? "8"), 10);
    const observerPricePounds = parseFloat(String(formData.get("observer_price") ?? "50"));

    await supabase.from("ticket_types").insert([
      {
        event_id: event.id,
        name: "Active Candidate",
        capacity: activeCapacity,
        price: Math.round(activePricePounds * 100),
      },
      {
        event_id: event.id,
        name: "Observer",
        capacity: observerCapacity,
        price: Math.round(observerPricePounds * 100),
      },
    ]);
  }

  revalidatePath("/admin");
  revalidatePath("/");
  redirect("/admin");
}

// ── update event ─────────────────────────────────────────────────────────────

export async function updateEvent(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Database not available." };

  const id = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const date = String(formData.get("date") ?? "");
  const startTime = String(formData.get("start_time") ?? "");
  const endTime = String(formData.get("end_time") ?? "");
  const zoomLink = String(formData.get("zoom_link") ?? "").trim() || null;
  const status = String(formData.get("status") ?? "scheduled");

  if (!id || !title || !date || !startTime || !endTime) {
    return { error: "Title, date, start time, and end time are required." };
  }

  const startTs = ukTimestamp(date, startTime);
  const endTs = ukTimestamp(date, endTime);

  const { error: eventErr } = await supabase
    .from("events")
    .update({ title, description: description || null, start_time: startTs, end_time: endTs, zoom_link: zoomLink, status })
    .eq("id", id);

  if (eventErr) return { error: eventErr.message };

  // Update ticket type fields
  const eventType = String(formData.get("event_type") ?? "");
  if (eventType === "webinar") {
    const capacity = parseInt(String(formData.get("webinar_capacity") ?? "200"), 10);
    await supabase
      .from("ticket_types")
      .update({ capacity })
      .eq("event_id", id)
      .eq("name", "Webinar (Free)");
  } else {
    const activeCapacity = parseInt(String(formData.get("active_capacity") ?? "2"), 10);
    const activePricePounds = parseFloat(String(formData.get("active_price") ?? "200"));
    const observerCapacity = parseInt(String(formData.get("observer_capacity") ?? "8"), 10);
    const observerPricePounds = parseFloat(String(formData.get("observer_price") ?? "50"));

    await supabase
      .from("ticket_types")
      .update({ capacity: activeCapacity, price: Math.round(activePricePounds * 100) })
      .eq("event_id", id)
      .eq("name", "Active Candidate");

    await supabase
      .from("ticket_types")
      .update({ capacity: observerCapacity, price: Math.round(observerPricePounds * 100) })
      .eq("event_id", id)
      .eq("name", "Observer");
  }

  revalidatePath("/admin");
  revalidatePath("/");
  redirect("/admin");
}

// ── delete event ─────────────────────────────────────────────────────────────

export async function deleteEvent(id: string): Promise<ActionResult> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Database not available." };

  // Fetch ticket type IDs to clean up bookings (no cascade on bookings FK)
  const { data: tickets } = await supabase
    .from("ticket_types")
    .select("id")
    .eq("event_id", id);

  const ttIds = (tickets ?? []).map((t) => t.id);
  if (ttIds.length > 0) {
    await supabase.from("bookings").delete().in("ticket_type_id", ttIds);
  }
  await supabase.from("bookings").delete().eq("event_id", id);

  const { error } = await supabase.from("events").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin");
  revalidatePath("/");
  return {};
}

// ── update settings ───────────────────────────────────────────────────────────

export async function updateSettings(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Database not available." };

  const entries = Array.from(formData.entries()) as [string, string][];
  const upserts = entries
    .filter(([key]) => key.startsWith("setting_"))
    .map(([key, value]) => ({ key: key.replace("setting_", ""), value: String(value).trim() }));

  if (upserts.length === 0) return {};

  const { error } = await supabase
    .from("settings")
    .upsert(upserts, { onConflict: "key" });

  if (error) return { error: error.message };

  revalidatePath("/admin/settings");
  return {};
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
    youtube_url: String(formData.get("youtube_url") ?? "").trim() || null,
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
