import { notFound } from "next/navigation";
import { getSupabaseAdmin } from "@/lib/supabase";
import { isoDay } from "@/lib/format";
import { EventForm } from "../../EventForm";
import { updateEvent } from "../../../actions";

export const dynamic = "force-dynamic";

function toUKTime(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(iso));
}

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = getSupabaseAdmin();
  if (!supabase) notFound();

  const { data: event } = await supabase
    .from("events")
    .select(
      `id, event_type, title, description, start_time, end_time, zoom_link, status,
       ticket_types ( id, name, capacity, price )`
    )
    .eq("id", id)
    .single<{
      id: string;
      event_type: string;
      title: string;
      description: string | null;
      start_time: string;
      end_time: string;
      zoom_link: string | null;
      status: string;
      ticket_types: { id: string; name: string; capacity: number; price: number }[];
    }>();

  if (!event) notFound();

  const tickets = event.ticket_types;
  const webinarTt = tickets.find((t) => t.name === "Webinar (Free)");
  const activeTt = tickets.find((t) => t.name === "Active Candidate");
  const observerTt = tickets.find((t) => t.name === "Observer");

  const initial = {
    id: event.id,
    event_type: event.event_type,
    title: event.title,
    description: event.description ?? "",
    date: isoDay(event.start_time),
    start_time: toUKTime(event.start_time),
    end_time: toUKTime(event.end_time),
    zoom_link: event.zoom_link ?? "",
    status: event.status,
    webinar_capacity: webinarTt?.capacity,
    active_capacity: activeTt?.capacity,
    active_price_pounds: activeTt ? activeTt.price / 100 : undefined,
    observer_capacity: observerTt?.capacity,
    observer_price_pounds: observerTt ? observerTt.price / 100 : undefined,
  };

  // Defaults for any missing ticket fields
  const defaults = {
    webinarCapacity: 200,
    activeCapacity: 2,
    activePricePounds: 200,
    observerCapacity: 8,
    observerPricePounds: 50,
  };

  return (
    <div>
      <div className="mb-8">
        <a
          href="/admin"
          className="text-[12px] text-navy/40 hover:text-navy/70 transition no-underline"
        >
          ← Events
        </a>
        <h1 className="font-display font-extrabold text-[24px] text-navy mt-2">
          Edit event
        </h1>
        <p className="text-[13px] text-navy/50 mt-0.5">{event.title}</p>
      </div>
      <EventForm
        mode="edit"
        action={updateEvent}
        defaults={defaults}
        initial={initial}
      />
    </div>
  );
}
