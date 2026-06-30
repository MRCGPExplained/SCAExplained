import Link from "next/link";
import { getSupabaseAdmin } from "@/lib/supabase";
import { longDate, timeRange, formatPrice } from "@/lib/format";
import { DeleteButton } from "./DeleteButton";

export const dynamic = "force-dynamic";

type Booking = { status: string };
type TicketType = {
  id: string;
  name: string;
  capacity: number;
  price: number;
  bookings: Booking[];
};
type AdminEvent = {
  id: string;
  event_type: string;
  title: string;
  start_time: string;
  end_time: string;
  status: string;
  zoom_link: string | null;
  ticket_types: TicketType[];
};

async function getAdminEvents(upcomingOnly: boolean): Promise<AdminEvent[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];

  let query = supabase
    .from("events")
    .select(
      `id, event_type, title, start_time, end_time, status, zoom_link,
       ticket_types (
         id, name, capacity, price,
         bookings!bookings_ticket_type_id_fkey ( status )
       )`
    )
    .order("start_time", { ascending: true });

  if (upcomingOnly) {
    query = query
      .gte("start_time", new Date().toISOString())
      .eq("status", "scheduled");
  }

  const { data, error } = await query;
  if (error) {
    console.error("[admin] events query failed:", error.message);
    return [];
  }
  return (data ?? []) as AdminEvent[];
}

function bookingSummary(tickets: TicketType[]) {
  return tickets.map((tt) => {
    const sold = tt.bookings.filter((b) =>
      ["confirmed", "paid"].includes(b.status)
    ).length;
    const pending = tt.bookings.filter((b) => b.status === "pending").length;
    const revenue = sold * tt.price;
    return { ...tt, sold, pending, revenue };
  });
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ show?: string }>;
}) {
  const { show } = await searchParams;
  const upcomingOnly = show !== "all";

  const events = await getAdminEvents(upcomingOnly);

  const totalRevenue = events.flatMap((e) =>
    e.ticket_types.map(
      (tt) =>
        tt.bookings.filter((b) => ["confirmed", "paid"].includes(b.status))
          .length * tt.price
    )
  ).reduce((a, b) => a + b, 0);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
        <div>
          <h1 className="font-display font-extrabold text-[26px] text-navy">
            Events
          </h1>
          <p className="text-[13px] text-navy/50 mt-0.5">
            {events.length} {upcomingOnly ? "upcoming" : "total"} ·{" "}
            {formatPrice(totalRevenue)} revenue
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Filter toggle */}
          <div className="flex rounded-lg border border-navy/15 overflow-hidden text-[12px] font-semibold">
            <Link
              href="/admin"
              className={[
                "px-3.5 py-2 no-underline transition",
                upcomingOnly
                  ? "bg-navy text-white"
                  : "text-navy/60 hover:text-navy",
              ].join(" ")}
            >
              Upcoming
            </Link>
            <Link
              href="/admin?show=all"
              className={[
                "px-3.5 py-2 no-underline transition border-l border-navy/15",
                !upcomingOnly
                  ? "bg-navy text-white"
                  : "text-navy/60 hover:text-navy",
              ].join(" ")}
            >
              All
            </Link>
          </div>
          <Link
            href="/admin/events/new"
            className="bg-yellow text-navy text-[13px] font-bold px-4 py-2 rounded-lg hover:bg-yellow/90 transition no-underline"
          >
            + Add event
          </Link>
        </div>
      </div>

      {events.length === 0 && (
        <div className="rounded-2xl border border-navy/10 bg-white px-8 py-12 text-center">
          <p className="text-[15px] font-semibold text-navy/50">
            {upcomingOnly ? "No upcoming events." : "No events found."}
          </p>
          <Link
            href="/admin/events/new"
            className="inline-block mt-4 text-[13px] font-bold text-navy no-underline border-b border-yellow"
          >
            Create the first one →
          </Link>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {events.map((event) => {
          const tickets = bookingSummary(event.ticket_types);
          const totalRevForEvent = tickets.reduce((a, t) => a + t.revenue, 0);

          return (
            <div
              key={event.id}
              className="rounded-2xl border border-navy/10 bg-white px-6 py-5"
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                {/* Left: info */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span
                      className={[
                        "text-[10px] font-bold tracking-[0.08em] uppercase px-2 py-0.5 rounded",
                        event.event_type === "webinar"
                          ? "bg-yellow/30 text-navy"
                          : "bg-navy/10 text-navy",
                      ].join(" ")}
                    >
                      {event.event_type === "webinar" ? "Webinar" : "Intensive"}
                    </span>
                    {event.status !== "scheduled" && (
                      <span className="text-[10px] font-bold tracking-[0.08em] uppercase px-2 py-0.5 rounded bg-red-100 text-red-700">
                        {event.status}
                      </span>
                    )}
                    {event.zoom_link ? (
                      <span className="text-[10px] font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded">
                        Zoom ✓
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded">
                        No Zoom link
                      </span>
                    )}
                  </div>
                  <h2 className="font-display font-bold text-[16px] text-navy">
                    {event.title}
                  </h2>
                  <p className="text-[13px] text-navy/55 mt-0.5">
                    {longDate(event.start_time)} ·{" "}
                    {timeRange(event.start_time, event.end_time)}
                  </p>
                </div>

                {/* Right: actions */}
                <div className="flex items-center gap-4 shrink-0">
                  {totalRevForEvent > 0 && (
                    <span className="text-[13px] font-bold text-navy">
                      {formatPrice(totalRevForEvent)}
                    </span>
                  )}
                  <Link
                    href={`/admin/events/${event.id}/attendees`}
                    className="text-[12px] font-semibold text-navy/60 hover:text-navy transition no-underline"
                  >
                    Attendees
                  </Link>
                  <Link
                    href={`/admin/events/${event.id}/edit`}
                    className="text-[12px] font-semibold text-navy/60 hover:text-navy transition no-underline"
                  >
                    Edit
                  </Link>
                  <DeleteButton id={event.id} label={event.title} />
                </div>
              </div>

              {/* Ticket breakdown */}
              {tickets.length > 0 && (
                <div className="mt-4 flex gap-3 flex-wrap">
                  {tickets.map((tt) => (
                    <div
                      key={tt.id}
                      className="rounded-lg border border-navy/10 px-4 py-2.5 flex gap-5 items-center"
                    >
                      <span className="text-[12px] font-bold text-navy">
                        {tt.name}
                      </span>
                      <div className="flex gap-3 text-[12px]">
                        <span>
                          <span className="font-bold text-navy">{tt.sold}</span>
                          <span className="text-navy/40">/{tt.capacity}</span>
                          <span className="text-navy/40 ml-1">confirmed</span>
                        </span>
                        {tt.pending > 0 && (
                          <span className="text-orange-600">
                            +{tt.pending} pending
                          </span>
                        )}
                        {tt.price > 0 && (
                          <span className="text-navy/40">
                            {formatPrice(tt.price)} each
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
