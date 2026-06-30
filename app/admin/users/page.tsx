import { getSupabaseAdmin } from "@/lib/supabase";
import { longDate } from "@/lib/format";
import Link from "next/link";

export const dynamic = "force-dynamic";

const STATUS_COLOR: Record<string, string> = {
  confirmed: "bg-green-50 text-green-700",
  paid:       "bg-green-50 text-green-700",
  pending:    "bg-orange-50 text-orange-700",
  cancelled:  "bg-red-50 text-red-600",
};

type UserRow = {
  id: string;
  customer_name: string;
  customer_email: string;
  status: string;
  created_at: string;
  ticket_types: {
    name: string;
    events: { title: string; start_time: string; event_type: string } | null;
  } | null;
};

async function getUsers(upcomingOnly: boolean, confirmedOnly: boolean) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];

  let query = supabase
    .from("bookings")
    .select(
      `id, customer_name, customer_email, status, created_at,
       ticket_types!bookings_ticket_type_id_fkey (
         name,
         events!ticket_types_event_id_fkey ( title, start_time, event_type )
       )`
    )
    .order("created_at", { ascending: false });

  if (confirmedOnly) {
    query = query.in("status", ["confirmed", "paid"]);
  }

  const { data, error } = await query;
  if (error) {
    console.error("[admin/users]", error.message);
    return [];
  }

  let rows = (data ?? []) as unknown as UserRow[];

  if (upcomingOnly) {
    const now = new Date().toISOString();
    rows = rows.filter(
      (r) => (r.ticket_types?.events?.start_time ?? "") >= now
    );
  }

  return rows;
}

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ events?: string; status?: string }>;
}) {
  const { events: eventsFilter, status: statusFilter } = await searchParams;
  const upcomingOnly = eventsFilter !== "all";
  const confirmedOnly = statusFilter !== "all";

  const rows = await getUsers(upcomingOnly, confirmedOnly);

  return (
    <div>
      <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
        <div>
          <h1 className="font-display font-extrabold text-[26px] text-navy">Users</h1>
          <p className="text-[13px] text-navy/50 mt-0.5">{rows.length} {confirmedOnly ? "confirmed" : "total"} · {upcomingOnly ? "upcoming events" : "all events"}</p>
        </div>

        <div className="flex gap-2 flex-wrap">
          {/* Events filter */}
          <div className="flex rounded-lg border border-navy/15 overflow-hidden text-[12px] font-semibold">
            <Link href={`/admin/users${confirmedOnly ? "" : "?status=all"}`} className={["px-3.5 py-2 no-underline transition", upcomingOnly ? "bg-navy text-white" : "text-navy/60 hover:text-navy"].join(" ")}>Upcoming</Link>
            <Link href={`/admin/users?events=all${confirmedOnly ? "" : "&status=all"}`} className={["px-3.5 py-2 no-underline transition border-l border-navy/15", !upcomingOnly ? "bg-navy text-white" : "text-navy/60 hover:text-navy"].join(" ")}>All events</Link>
          </div>
          {/* Status filter */}
          <div className="flex rounded-lg border border-navy/15 overflow-hidden text-[12px] font-semibold">
            <Link href={`/admin/users${!upcomingOnly ? "?events=all" : ""}`} className={["px-3.5 py-2 no-underline transition", confirmedOnly ? "bg-navy text-white" : "text-navy/60 hover:text-navy"].join(" ")}>Confirmed</Link>
            <Link href={`/admin/users?status=all${!upcomingOnly ? "&events=all" : ""}`} className={["px-3.5 py-2 no-underline transition border-l border-navy/15", !confirmedOnly ? "bg-navy text-white" : "text-navy/60 hover:text-navy"].join(" ")}>All statuses</Link>
          </div>
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-navy/10 bg-white px-8 py-12 text-center">
          <p className="text-[14px] text-navy/50">No users found.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-navy/10 bg-white overflow-x-auto">
          <table className="w-full text-[13px] min-w-[640px]">
            <thead>
              <tr className="border-b border-navy/10 bg-navy/[0.03]">
                <th className="text-left px-5 py-3 text-[11px] font-bold tracking-[0.06em] uppercase text-navy/50">Name</th>
                <th className="text-left px-5 py-3 text-[11px] font-bold tracking-[0.06em] uppercase text-navy/50">Email</th>
                <th className="text-left px-5 py-3 text-[11px] font-bold tracking-[0.06em] uppercase text-navy/50">Event</th>
                <th className="text-left px-5 py-3 text-[11px] font-bold tracking-[0.06em] uppercase text-navy/50">Date</th>
                <th className="text-left px-5 py-3 text-[11px] font-bold tracking-[0.06em] uppercase text-navy/50">Ticket</th>
                <th className="text-left px-5 py-3 text-[11px] font-bold tracking-[0.06em] uppercase text-navy/50">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => {
                const event = row.ticket_types?.events;
                return (
                  <tr key={row.id} className={i < rows.length - 1 ? "border-b border-navy/[0.06]" : ""}>
                    <td className="px-5 py-3 font-semibold text-navy whitespace-nowrap">{row.customer_name}</td>
                    <td className="px-5 py-3 text-navy/70">
                      <a href={`mailto:${row.customer_email}`} className="no-underline hover:underline text-navy/70">{row.customer_email}</a>
                    </td>
                    <td className="px-5 py-3 text-navy/70">{event?.title ?? "—"}</td>
                    <td className="px-5 py-3 text-navy/70 whitespace-nowrap">
                      {event?.start_time ? longDate(event.start_time) : "—"}
                    </td>
                    <td className="px-5 py-3 text-navy/70">{row.ticket_types?.name ?? "—"}</td>
                    <td className="px-5 py-3">
                      <span className={["text-[11px] font-bold px-2 py-0.5 rounded", STATUS_COLOR[row.status] ?? "bg-navy/10 text-navy"].join(" ")}>
                        {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
