import Link from "next/link";
import { getSupabaseAdmin } from "@/lib/supabase";
import { toggleStationPublishedAction } from "../actions";
import type { StationListRow } from "@/lib/case-bank-types";

export const dynamic = "force-dynamic";

export default async function AdminStationsPage() {
  const supabase = getSupabaseAdmin();

  const { data: stations } = await supabase
    ?.from("stations")
    .select("id,number,title,subject,consultation_type,published")
    .order("number", { ascending: true })
    .returns<StationListRow[]>() ?? { data: [] };

  const published = (stations ?? []).filter((s) => s.published).length;
  const draft = (stations ?? []).length - published;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-[22px] text-navy mb-1">Stations</h1>
          <p className="text-[13px] text-navy/50">
            {published} published · {draft} draft · {(stations ?? []).length} total
          </p>
        </div>
        <Link
          href="/admin/stations/new"
          className="bg-navy text-white px-5 py-2.5 rounded-lg font-semibold text-[13px] no-underline hover:bg-navy/90 transition"
        >
          + New Station
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-navy/10 overflow-hidden">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-navy/10">
              <th className="text-left px-5 py-3 text-[11px] font-bold uppercase tracking-[0.06em] text-navy/50">#</th>
              <th className="text-left px-5 py-3 text-[11px] font-bold uppercase tracking-[0.06em] text-navy/50">Title</th>
              <th className="text-left px-5 py-3 text-[11px] font-bold uppercase tracking-[0.06em] text-navy/50">Subject</th>
              <th className="text-left px-5 py-3 text-[11px] font-bold uppercase tracking-[0.06em] text-navy/50">Status</th>
              <th className="text-left px-5 py-3 text-[11px] font-bold uppercase tracking-[0.06em] text-navy/50">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(stations ?? []).length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-12 text-navy/40">
                  No stations yet.{" "}
                  <Link href="/admin/stations/new" className="text-navy font-semibold no-underline">
                    Add the first one →
                  </Link>
                </td>
              </tr>
            )}
            {(stations ?? []).map((s) => (
              <tr
                key={s.id}
                className="border-b border-navy/06 last:border-0 hover:bg-[#F3F2FB] transition"
              >
                <td className="px-5 py-3 font-bold text-navy/60 w-12">{s.number}</td>
                <td className="px-5 py-3 font-semibold text-navy max-w-[340px]">
                  <span className="line-clamp-1">{s.title}</span>
                </td>
                <td className="px-5 py-3 text-navy/65">{s.subject}</td>
                <td className="px-5 py-3">
                  <form action={toggleStationPublishedAction}>
                    <input type="hidden" name="id" value={s.id} />
                    <input type="hidden" name="published" value={String(!s.published)} />
                    <button
                      type="submit"
                      className="px-2.5 py-1 rounded-full text-[11px] font-bold cursor-pointer border"
                      style={
                        s.published
                          ? {
                              background: "rgba(34,197,94,0.1)",
                              color: "#15803D",
                              borderColor: "rgba(34,197,94,0.2)",
                            }
                          : {
                              background: "rgba(26,27,82,0.07)",
                              color: "rgba(26,27,82,0.5)",
                              borderColor: "rgba(26,27,82,0.12)",
                            }
                      }
                    >
                      {s.published ? "Published" : "Draft"}
                    </button>
                  </form>
                </td>
                <td className="px-5 py-3">
                  <div className="flex gap-3">
                    <Link
                      href={`/admin/stations/${s.id}/edit`}
                      className="text-navy font-semibold no-underline hover:underline"
                    >
                      Edit
                    </Link>
                    <Link
                      href={`/case-bank/${s.number}`}
                      target="_blank"
                      className="text-navy/40 no-underline hover:text-navy transition"
                    >
                      Preview ↗
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
