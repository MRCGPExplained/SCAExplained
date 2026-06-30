import { getSupabaseAdmin } from "@/lib/supabase";
import { longDate, timeRange, formatPrice } from "@/lib/format";
import Link from "next/link";

export const dynamic = "force-dynamic";

type Booking = { status: string };
type TicketType = { id: string; name: string; capacity: number; price: number; bookings: Booking[] };
type SalesEvent = {
  id: string;
  event_type: string;
  title: string;
  start_time: string;
  end_time: string;
  status: string;
  ticket_types: TicketType[];
};

async function getSalesEvents(upcomingOnly: boolean) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];

  let query = supabase
    .from("events")
    .select(
      `id, event_type, title, start_time, end_time, status,
       ticket_types (
         id, name, capacity, price,
         bookings!bookings_ticket_type_id_fkey ( status )
       )`
    )
    .order("start_time", { ascending: false });

  if (upcomingOnly) {
    query = query
      .gte("start_time", new Date().toISOString())
      .eq("status", "scheduled");
  }

  const { data, error } = await query;
  if (error) {
    console.error("[admin/sales]", error.message);
    return [];
  }
  return (data ?? []) as unknown as SalesEvent[];
}

function confirmed(bookings: Booking[]) {
  return bookings.filter((b) => ["confirmed", "paid"].includes(b.status)).length;
}

export default async function SalesPage({
  searchParams,
}: {
  searchParams: Promise<{ show?: string }>;
}) {
  const { show } = await searchParams;
  const upcomingOnly = show !== "all";

  const events = await getSalesEvents(upcomingOnly);

  // Totals
  let totalRevenue = 0;
  let totalActive = 0;
  let totalObserver = 0;
  let totalWebinar = 0;

  for (const e of events) {
    for (const tt of e.ticket_types) {
      const sold = confirmed(tt.bookings);
      totalRevenue += sold * tt.price;
      if (tt.name === "Active Candidate") totalActive += sold;
      else if (tt.name === "Observer") totalObserver += sold;
      else totalWebinar += sold;
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
        <div>
          <h1 className="font-display font-extrabold text-[26px] text-navy">Sales</h1>
          <p className="text-[13px] text-navy/50 mt-0.5">{events.length} events · {formatPrice(totalRevenue)} total revenue</p>
        </div>
        <div className="flex rounded-lg border border-navy/15 overflow-hidden text-[12px] font-semibold">
          <Link href="/admin/sales" className={["px-3.5 py-2 no-underline transition", upcomingOnly ? "bg-navy text-white" : "text-navy/60 hover:text-navy"].join(" ")}>Upcoming</Link>
          <Link href="/admin/sales?show=all" className={["px-3.5 py-2 no-underline transition border-l border-navy/15", !upcomingOnly ? "bg-navy text-white" : "text-navy/60 hover:text-navy"].join(" ")}>All</Link>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-3 mb-8 max-sm:grid-cols-2">
        {[
          { label: "Revenue", value: formatPrice(totalRevenue) },
          { label: "Active Candidates", value: String(totalActive) },
          { label: "Observers", value: String(totalObserver) },
          { label: "Webinar registrations", value: String(totalWebinar) },
        ].map((c) => (
          <div key={c.label} className="rounded-xl border border-navy/10 bg-white px-5 py-4">
            <p className="text-[11px] font-bold tracking-[0.06em] uppercase text-navy/40 mb-1">{c.label}</p>
            <p className="text-[22px] font-extrabold text-navy font-display">{c.value}</p>
          </div>
        ))}
      </div>

      {events.length === 0 ? (
        <div className="rounded-2xl border border-navy/10 bg-white px-8 py-12 text-center">
          <p className="text-[14px] text-navy/50">No events found.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-navy/10 bg-white overflow-x-auto">
          <table className="w-full text-[13px] min-w-[640px]">
            <thead>
              <tr className="border-b border-navy/10 bg-navy/[0.03]">
                <th className="text-left px-5 py-3 text-[11px] font-bold tracking-[0.06em] uppercase text-navy/50">Event</th>
                <th className="text-left px-5 py-3 text-[11px] font-bold tracking-[0.06em] uppercase text-navy/50">Date &amp; time</th>
                <th className="text-left px-5 py-3 text-[11px] font-bold tracking-[0.06em] uppercase text-navy/50">Active</th>
                <th className="text-left px-5 py-3 text-[11px] font-bold tracking-[0.06em] uppercase text-navy/50">Observer</th>
                <th className="text-left px-5 py-3 text-[11px] font-bold tracking-[0.06em] uppercase text-navy/50">Free registrations</th>
                <th className="text-right px-5 py-3 text-[11px] font-bold tracking-[0.06em] uppercase text-navy/50">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event, i) => {
                const activeTt  = event.ticket_types.find((t) => t.name === "Active Candidate");
                const observerTt = event.ticket_types.find((t) => t.name === "Observer");
                const webinarTt  = event.ticket_types.find((t) => t.name === "Webinar (Free)");

                const activeSold   = activeTt   ? confirmed(activeTt.bookings)   : null;
                const observerSold = observerTt ? confirmed(observerTt.bookings) : null;
                const webinarSold  = webinarTt  ? confirmed(webinarTt.bookings)  : null;

                const revenue =
                  (activeSold   ?? 0) * (activeTt?.price   ?? 0) +
                  (observerSold ?? 0) * (observerTt?.price ?? 0);

                return (
                  <tr key={event.id} className={i < events.length - 1 ? "border-b border-navy/[0.06]" : ""}>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <span className={["text-[10px] font-bold px-1.5 py-0.5 rounded", event.event_type === "webinar" ? "bg-yellow/30 text-navy" : "bg-navy/10 text-navy"].join(" ")}>
                          {event.event_type === "webinar" ? "Webinar" : "Intensive"}
                        </span>
                        <span className="font-semibold text-navy">{event.title}</span>
                      </div>
                      {event.status !== "scheduled" && (
                        <span className="text-[11px] text-red-600 font-semibold capitalize mt-0.5 block">{event.status}</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-navy/60 whitespace-nowrap">
                      <span className="block">{longDate(event.start_time)}</span>
                      <span className="text-[11px] text-navy/40">{timeRange(event.start_time, event.end_time)}</span>
                    </td>
                    <td className="px-5 py-3">
                      {activeSold !== null ? (
                        <span className="font-bold text-navy">{activeSold}</span>
                      ) : <span className="text-navy/25">—</span>}
                      {activeTt && <span className="text-navy/40">/{activeTt.capacity}</span>}
                    </td>
                    <td className="px-5 py-3">
                      {observerSold !== null ? (
                        <span className="font-bold text-navy">{observerSold}</span>
                      ) : <span className="text-navy/25">—</span>}
                      {observerTt && <span className="text-navy/40">/{observerTt.capacity}</span>}
                    </td>
                    <td className="px-5 py-3">
                      {webinarSold !== null ? (
                        <span className="font-bold text-navy">{webinarSold}</span>
                      ) : <span className="text-navy/25">—</span>}
                      {webinarTt && <span className="text-navy/40">/{webinarTt.capacity}</span>}
                    </td>
                    <td className="px-5 py-3 text-right font-bold text-navy">
                      {revenue > 0 ? formatPrice(revenue) : <span className="text-navy/25">—</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            {/* Totals row */}
            <tfoot>
              <tr className="border-t border-navy/15 bg-navy/[0.03]">
                <td className="px-5 py-3 text-[12px] font-bold text-navy/60" colSpan={2}>Total</td>
                <td className="px-5 py-3 font-bold text-navy">{totalActive}</td>
                <td className="px-5 py-3 font-bold text-navy">{totalObserver}</td>
                <td className="px-5 py-3 font-bold text-navy">{totalWebinar}</td>
                <td className="px-5 py-3 text-right font-bold text-navy">{formatPrice(totalRevenue)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
}
