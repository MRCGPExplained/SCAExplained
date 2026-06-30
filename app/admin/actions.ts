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
