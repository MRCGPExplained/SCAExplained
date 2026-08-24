import Link from "next/link";
import { getSupabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

type FeedbackRow = {
  id: string;
  recording_id: string;
  agrees: boolean;
  comment: string | null;
  created_at: string;
  station_recordings: {
    station_number: number;
    station_title: string;
    doctor_display_name: string;
    candidate_email: string | null;
  } | null;
};

export default async function ReportFeedbackPage() {
  const supabase = getSupabaseAdmin();

  const { data } = supabase
    ? await supabase
        .from("ai_report_feedback")
        .select(
          "id, recording_id, agrees, comment, created_at, station_recordings(station_number, station_title, doctor_display_name, candidate_email)"
        )
        .order("created_at", { ascending: false })
    : { data: [] };

  const rows = (data ?? []) as unknown as FeedbackRow[];
  const disagreeCount = rows.filter((r) => !r.agrees).length;

  return (
    <div className="max-w-[1100px] mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-bold text-[20px]" style={{ color: "#333333" }}>Report Feedback</h1>
          <p className="text-[13px] mt-1" style={{ color: "rgba(51,51,51,0.55)" }}>
            {rows.length} submission{rows.length === 1 ? "" : "s"} · {disagreeCount} disagreement{disagreeCount === 1 ? "" : "s"}
          </p>
        </div>
      </div>

      {rows.length === 0 ? (
        <p className="text-[13px]" style={{ color: "rgba(51,51,51,0.5)" }}>No feedback submitted yet.</p>
      ) : (
        <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(51,51,51,0.10)" }}>
          <table className="w-full" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "rgba(51,51,51,0.03)" }}>
                <th className="text-left px-4 py-3 text-[11px] font-bold uppercase" style={{ color: "rgba(51,51,51,0.5)" }}>Date</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold uppercase" style={{ color: "rgba(51,51,51,0.5)" }}>Station</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold uppercase" style={{ color: "rgba(51,51,51,0.5)" }}>Candidate</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold uppercase" style={{ color: "rgba(51,51,51,0.5)" }}>Verdict</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold uppercase" style={{ color: "rgba(51,51,51,0.5)" }}>Comment</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold uppercase" style={{ color: "rgba(51,51,51,0.5)" }}></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} style={{ borderTop: "1px solid rgba(51,51,51,0.06)" }}>
                  <td className="px-4 py-3 text-[12.5px] whitespace-nowrap" style={{ color: "rgba(51,51,51,0.6)" }}>
                    {new Date(row.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-4 py-3 text-[12.5px]" style={{ color: "#333333" }}>
                    {row.station_recordings
                      ? `#${row.station_recordings.station_number} — ${row.station_recordings.station_title}`
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-[12.5px]" style={{ color: "#333333" }}>
                    {row.station_recordings?.doctor_display_name ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="text-[11px] font-bold px-2.5 py-0.5 rounded-full"
                      style={
                        row.agrees
                          ? { background: "rgba(34,197,94,0.1)", color: "#166534" }
                          : { background: "rgba(239,68,68,0.1)", color: "#B91C1C" }
                      }
                    >
                      {row.agrees ? "Agrees" : "Disagrees"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[12.5px] max-w-[320px]" style={{ color: "rgba(51,51,51,0.75)" }}>
                    {row.comment ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-[12.5px] whitespace-nowrap">
                    <Link href={`/recordings/${row.recording_id}`} target="_blank" rel="noopener noreferrer" style={{ color: "#1D4ED8", textDecoration: "none", fontWeight: 600 }}>
                      View report →
                    </Link>
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
