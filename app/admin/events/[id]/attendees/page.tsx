import { notFound } from "next/navigation";
import { getSupabaseAdmin } from "@/lib/supabase";
import { longDate, timeRange } from "@/lib/format";

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<string, string> = {
  confirmed: "Confirmed",
  paid: "Paid",
  pending: "Pending",
  cancelled: "Cancelled",
};
const STATUS_COLOR: Record<string, string> = {
  confirmed: "bg-green-50 text-green-700",
  paid: "bg-green-50 text-green-700",
  pending: "bg-orange-50 text-orange-700",
  cancelled: "bg-red-50 text-red-600",
};

export default async function AttendeesPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ show?: string }>;
}) {
  const { id } = await params;
  const { show } = await searchParams;
  const showAll = show === "all";

  const supabase = getSupabaseAdmin();
  if (!supabase) notFound();

  const { data: event } = await supabase
    .from("events")
    .select("id, title, start_time, end_time")
    .eq("id", id)
    .single<{ id: string; title: string; start_time: string; end_time: string }>();

  if (!event) notFound();

  let bookingQuery = supabase
    .from("bookings")
    .select(
      `id, customer_name, customer_email, status, created_at,
       ticket_types ( name, price )`
    )
    .eq("event_id", id)
    .order("created_at", { ascending: true });

  if (!showAll) {
    bookingQuery = bookingQuery.in("status", ["confirmed", "paid"]);
  }

  const { data: bookings } = await bookingQuery;

  type Booking = {
    id: string;
    customer_name: string;
    customer_email: string;
    status: string;
    created_at: string;
    ticket_types: { name: string; price: number } | null;
  };

  const rows = (bookings ?? []) as unknown as Booking[];
  const confirmed = rows.filter((b) => ["confirmed", "paid"].includes(b.status));

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
          {event.title}
        </h1>
        <p className="text-[13px] text-navy/50 mt-0.5">
          {longDate(event.start_time)} · {timeRange(event.start_time, event.end_time)}
        </p>
      </div>

      {/* Summary */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <div className="rounded-xl border border-navy/10 bg-white px-5 py-3">
          <p className="text-[11px] font-bold tracking-[0.06em] uppercase text-navy/40">Confirmed</p>
          <p className="text-[22px] font-extrabold text-navy font-display">{confirmed.length}</p>
        </div>
      </div>

      {/* Filter toggle */}
      <div className="flex items-center justify-between mb-4 gap-4">
        <p className="text-[13px] font-semibold text-navy/60">
          {showAll ? `All bookings (${rows.length})` : `Confirmed attendees (${confirmed.length})`}
        </p>
        <div className="flex rounded-lg border border-navy/15 overflow-hidden text-[12px] font-semibold">
          <a
            href={`/admin/events/${id}/attendees`}
            className={[
              "px-3.5 py-2 no-underline transition",
              !showAll ? "bg-navy text-white" : "text-navy/60 hover:text-navy",
            ].join(" ")}
          >
            Confirmed
          </a>
          <a
            href={`/admin/events/${id}/attendees?show=all`}
            className={[
              "px-3.5 py-2 no-underline transition border-l border-navy/15",
              showAll ? "bg-navy text-white" : "text-navy/60 hover:text-navy",
            ].join(" ")}
          >
            All
          </a>
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-navy/10 bg-white px-8 py-10 text-center">
          <p className="text-[14px] text-navy/50">
            {showAll ? "No bookings yet." : "No confirmed bookings yet."}
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-navy/10 bg-white overflow-hidden">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-navy/10 bg-navy/[0.03]">
                <th className="text-left px-5 py-3 text-[11px] font-bold tracking-[0.06em] uppercase text-navy/50">Name</th>
                <th className="text-left px-5 py-3 text-[11px] font-bold tracking-[0.06em] uppercase text-navy/50">Email</th>
                <th className="text-left px-5 py-3 text-[11px] font-bold tracking-[0.06em] uppercase text-navy/50">Ticket</th>
                <th className="text-left px-5 py-3 text-[11px] font-bold tracking-[0.06em] uppercase text-navy/50">Status</th>
                <th className="text-left px-5 py-3 text-[11px] font-bold tracking-[0.06em] uppercase text-navy/50">Booked</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((b, i) => (
                <tr
                  key={b.id}
                  className={i < rows.length - 1 ? "border-b border-navy/[0.06]" : ""}
                >
                  <td className="px-5 py-3 font-semibold text-navy">{b.customer_name}</td>
                  <td className="px-5 py-3 text-navy/70">
                    <a
                      href={`mailto:${b.customer_email}`}
                      className="no-underline hover:underline text-navy/70"
                    >
                      {b.customer_email}
                    </a>
                  </td>
                  <td className="px-5 py-3 text-navy/70">{b.ticket_types?.name ?? "—"}</td>
                  <td className="px-5 py-3">
                    <span
                      className={[
                        "text-[11px] font-bold px-2 py-0.5 rounded",
                        STATUS_COLOR[b.status] ?? "bg-navy/10 text-navy",
                      ].join(" ")}
                    >
                      {STATUS_LABEL[b.status] ?? b.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-navy/50">
                    {new Date(b.created_at).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
