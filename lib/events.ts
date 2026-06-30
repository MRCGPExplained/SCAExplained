import { getSupabaseAdmin } from "./supabase";
import { isoDay } from "./format";
import type { EventType, UpcomingEvent, TicketAvailability } from "./types";

/**
 * THE shared events query. Both the homepage date lists and the per-date
 * booking pages read upcoming events through here, so availability can never
 * drift between "available on the homepage" and "sold out on the booking page".
 *
 * Past-date filtering (`start_time >= now()`) happens at the query level, so
 * past sessions disappear automatically everywhere. `zoom_link` is never
 * selected — it stays server-internal and is emailed on confirmation only.
 *
 * Returns [] (not an error) when Supabase isn't configured yet, so the site
 * renders the empty "no upcoming dates" state rather than crashing pre-launch.
 */
export async function getUpcomingEvents(
  type?: EventType
): Promise<UpcomingEvent[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];

  let query = supabase
    .from("events")
    .select("id, event_type, title, description, start_time, end_time")
    .eq("status", "scheduled")
    .gte("start_time", new Date().toISOString())
    .order("start_time", { ascending: true });

  if (type) query = query.eq("event_type", type);

  const { data: events, error } = await query;
  if (error) {
    console.error("[events] failed to load events:", error.message);
    return [];
  }
  if (!events || events.length === 0) return [];

  const ids = events.map((e) => e.id);
  const { data: avail, error: availErr } = await supabase
    .from("ticket_availability")
    .select("ticket_type_id, event_id, name, capacity, price, remaining")
    .in("event_id", ids);

  if (availErr) {
    console.error("[events] failed to load availability:", availErr.message);
  }

  const byEvent = new Map<string, TicketAvailability[]>();
  for (const row of avail ?? []) {
    const list = byEvent.get(row.event_id) ?? [];
    list.push({
      ticketTypeId: row.ticket_type_id,
      name: row.name,
      capacity: row.capacity,
      price: row.price,
      remaining: row.remaining,
    });
    byEvent.set(row.event_id, list);
  }

  return events.map((e) => ({
    id: e.id,
    eventType: e.event_type as EventType,
    title: e.title,
    description: e.description,
    startTime: e.start_time,
    endTime: e.end_time,
    isoDate: isoDay(e.start_time),
    tickets: byEvent.get(e.id) ?? [],
  }));
}

/**
 * Find the single upcoming event of a given type whose UK-local date matches
 * the [date] route param (YYYY-MM-DD). Reuses getUpcomingEvents so it inherits
 * the same upcoming-only filtering and availability data. Returns null for a
 * past, cancelled, sold-out-of-existence, or unknown date.
 *
 * Assumes at most one event per type per calendar day (true for this product;
 * if two are ever scheduled on the same day, the earlier one wins).
 */
export async function getEventForBooking(
  type: EventType,
  date: string
): Promise<UpcomingEvent | null> {
  const events = await getUpcomingEvents(type);
  return events.find((e) => e.isoDate === date) ?? null;
}
