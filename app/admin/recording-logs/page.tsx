import Link from "next/link";
import { getSupabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

/**
 * What the recording flow actually did, per take.
 *
 * Station 75 on 28 Oct lost one of its two tracks and nothing anywhere could
 * say why: the lines that would have explained it went to a browser console
 * that was closed before anyone looked. recording_events keeps them now, and
 * this is where to read them without a database client.
 *
 * Grouped by take and ordered oldest-first WITHIN a take, because what is
 * being read is a sequence — did the recorder start, did a blob exist, did
 * the upload begin, did it throw. A reverse-ordered list of the same rows
 * answers none of that.
 *
 * The question is almost always "which side failed", so every line leads with
 * its role.
 */

const LEVEL_STYLE: Record<string, { bg: string; color: string }> = {
  error: { bg: "rgba(239,68,68,0.10)", color: "#B91C1C" },
  duration: { bg: "rgba(59,130,246,0.10)", color: "#1D4ED8" },
  status: { bg: "rgba(51,51,51,0.06)", color: "rgba(51,51,51,0.55)" },
};

interface EventRow {
  id: number;
  recording_id: string | null;
  user_id: string | null;
  role: string | null;
  level: string;
  event: string;
  data: unknown;
  created_at: string;
}

function clock(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "Europe/London",
  });
}

function day(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    timeZone: "Europe/London",
  });
}

export default async function RecordingLogsPage() {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return <p className="text-[13px] text-navy/50">Database not available.</p>;
  }

  // Newest 600 lines. A single take is ~15-30 of them, so this is roughly the
  // last few evenings — enough to look into something that happened last
  // night, which is when anyone looks.
  const { data: eventData, error } = await supabase
    .from("recording_events")
    .select("id, recording_id, user_id, role, level, event, data, created_at")
    .order("created_at", { ascending: false })
    .limit(600);

  // supabase-js returns { data, error }. Unread, a broken query would render
  // as "nothing has ever been logged" — the exact false reassurance this page
  // exists to stop.
  if (error) {
    return (
      <div>
        <h1 className="font-display font-bold text-[22px] text-navy mb-1">Recording logs</h1>
        <p className="text-[13px] mt-4" style={{ color: "#B91C1C" }}>
          Could not load the logs: {error.message}
        </p>
      </div>
    );
  }

  const events = (eventData ?? []) as unknown as EventRow[];

  // Name the takes these lines belong to, so a group is a consultation rather
  // than a uuid.
  const ids = [...new Set(events.map((e) => e.recording_id).filter(Boolean))] as string[];
  const { data: recData } = ids.length
    ? await supabase
        .from("station_recordings")
        .select("id, station_number, station_title, doctor_display_name, patient_display_name, status, created_at")
        .in("id", ids)
    : { data: [] };

  const recs = new Map(
    ((recData ?? []) as unknown as {
      id: string;
      station_number: number;
      station_title: string;
      doctor_display_name: string | null;
      patient_display_name: string | null;
      status: string;
      created_at: string;
    }[]).map((r) => [r.id, r])
  );

  // Group, newest take first, but oldest line first inside each one.
  const groups = new Map<string, EventRow[]>();
  for (const e of events) {
    const key = e.recording_id ?? "unattached";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(e);
  }
  for (const list of groups.values()) {
    list.sort((a, b) => +new Date(a.created_at) - +new Date(b.created_at));
  }

  const errorCount = events.filter((e) => e.level === "error").length;

  return (
    <div>
      <h1 className="font-display font-bold text-[22px] text-navy mb-1">Recording logs</h1>
      <p className="text-[13px] text-navy/50 mb-6 max-w-[760px]">
        What each take actually did, in order: whether the recorder started, whether there was
        a blob to send, whether the upload began, and whether it threw. Kept because a lost
        track on 28 Oct could not be explained — everything that would have explained it was in
        a browser console nobody could reach. Errors are red; every line says which side it
        came from.
      </p>

      <div className="flex gap-4 mb-6 text-[12px] text-navy/50">
        <span>{events.length} lines</span>
        <span>·</span>
        <span>{groups.size} takes</span>
        <span>·</span>
        <span style={{ color: errorCount > 0 ? "#B91C1C" : undefined }}>{errorCount} errors</span>
      </div>

      {groups.size === 0 ? (
        <p className="text-[13px] text-navy/50">
          Nothing logged yet. Lines appear here the next time a consultation is recorded.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {[...groups.entries()].map(([key, list]) => {
            const rec = key === "unattached" ? null : recs.get(key);
            const hasError = list.some((e) => e.level === "error");
            return (
              <details
                key={key}
                // Anything with an error starts open. A log you have to go
                // hunting in is a log nobody reads.
                open={hasError}
                className="rounded-xl border border-navy/10 bg-white"
              >
                <summary className="px-5 py-3.5 cursor-pointer select-none flex items-center justify-between gap-4 flex-wrap">
                  <span className="flex items-center gap-2.5 min-w-0">
                    {hasError && (
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0"
                        style={LEVEL_STYLE.error}
                      >
                        ERROR
                      </span>
                    )}
                    <span className="text-[13.5px] font-semibold text-navy truncate">
                      {rec
                        ? `Station ${rec.station_number}: ${rec.station_title}`
                        : key === "unattached"
                          ? "Before a recording existed"
                          : "Take no longer in the database"}
                    </span>
                  </span>
                  <span className="text-[11.5px] text-navy/45 shrink-0">
                    {rec ? `${rec.doctor_display_name} · ${rec.status} · ` : ""}
                    {day(list[0].created_at)} {clock(list[0].created_at)} · {list.length} lines
                  </span>
                </summary>

                <div className="border-t border-navy/8">
                  {rec && (
                    <div className="px-5 py-2 border-b border-navy/8">
                      <Link
                        href={`/recordings/${key}`}
                        className="text-[11.5px] font-semibold no-underline"
                        style={{ color: "#1A1B52" }}
                      >
                        Open the report →
                      </Link>
                    </div>
                  )}
                  <table className="w-full text-[12px]">
                    <tbody>
                      {list.map((e) => {
                        const style = LEVEL_STYLE[e.level] ?? LEVEL_STYLE.status;
                        return (
                          <tr key={e.id} className="border-b border-navy/5 align-top">
                            <td className="px-5 py-2 font-mono tabular-nums text-navy/40 whitespace-nowrap w-[90px]">
                              {clock(e.created_at)}
                            </td>
                            <td className="py-2 w-[78px]">
                              <span className="text-[10px] font-bold uppercase tracking-[0.04em] text-navy/45">
                                {e.role ?? "—"}
                              </span>
                            </td>
                            <td className="py-2 w-[68px]">
                              <span
                                className="text-[9.5px] font-bold px-1.5 py-0.5 rounded uppercase"
                                style={style}
                              >
                                {e.level}
                              </span>
                            </td>
                            <td className="py-2 pr-5">
                              <span
                                className="text-[12.5px]"
                                style={{ color: e.level === "error" ? "#B91C1C" : "rgba(26,27,82,0.8)" }}
                              >
                                {e.event}
                              </span>
                              {e.data !== null && e.data !== undefined && (
                                <pre
                                  className="mt-1 text-[11px] whitespace-pre-wrap break-words m-0 rounded p-2"
                                  style={{ background: "rgba(26,27,82,0.03)", color: "rgba(26,27,82,0.6)" }}
                                >
                                  {JSON.stringify(e.data, null, 1)}
                                </pre>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </details>
            );
          })}
        </div>
      )}
    </div>
  );
}
