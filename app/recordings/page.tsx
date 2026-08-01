import { redirect } from "next/navigation";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase-case-bank";
import { getSupabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const GRADE_COLORS: Record<string, { bg: string; text: string }> = {
  CF: { bg: "rgba(239,68,68,0.1)", text: "#B91C1C" },
  F:  { bg: "rgba(245,158,11,0.1)", text: "#92400E" },
  P:  { bg: "rgba(34,197,94,0.1)", text: "#166534" },
  CP: { bg: "rgba(59,130,246,0.1)", text: "#1D4ED8" },
};

function gradePoints(grade: string | null, domain: "dg" | "cm" | "ro"): string {
  if (!grade) return "—";
  const map: Record<string, Record<string, number>> = {
    dg: { CF: 0, F: 1, P: 2, CP: 3 },
    cm: { CF: 0, F: 1.5, P: 3, CP: 4.5 },
    ro: { CF: 0, F: 1, P: 2, CP: 3 },
  };
  return `${map[domain][grade]} pts`;
}

function totalPoints(rec: RecordingRow): string {
  const src = rec.sent_to_candidate_at
    ? { dg: rec.examiner_data_gathering, cm: rec.examiner_clinical_management, ro: rec.examiner_relating_to_others }
    : { dg: rec.ai_data_gathering, cm: rec.ai_clinical_management, ro: rec.ai_relating_to_others };

  const dg = { CF: 0, F: 1, P: 2, CP: 3 }[src.dg ?? ""] ?? null;
  const cm = { CF: 0, F: 1.5, P: 3, CP: 4.5 }[src.cm ?? ""] ?? null;
  const ro = { CF: 0, F: 1, P: 2, CP: 3 }[src.ro ?? ""] ?? null;

  if (dg === null || cm === null || ro === null) return "—";
  return `${dg + cm + ro} / 10.5 pts`;
}

type RecordingRow = {
  id: string;
  station_number: number;
  station_title: string;
  started_at: string;
  status: string;
  ai_data_gathering: string | null;
  ai_clinical_management: string | null;
  ai_relating_to_others: string | null;
  examiner_data_gathering: string | null;
  examiner_clinical_management: string | null;
  examiner_relating_to_others: string | null;
  sent_to_candidate_at: string | null;
};

export default async function RecordingsPage({ searchParams }: { searchParams: Promise<{ purchased?: string }> }) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { purchased } = await searchParams;

  const admin = getSupabaseAdmin();
  const [recordingsResult, creditsResult] = await Promise.all([
    admin
      ? admin
          .from("station_recordings")
          .select("id, station_number, station_title, started_at, status, ai_data_gathering, ai_clinical_management, ai_relating_to_others, examiner_data_gathering, examiner_clinical_management, examiner_relating_to_others, sent_to_candidate_at")
          .eq("doctor_user_id", user.id)
          .order("started_at", { ascending: false })
          .limit(50)
      : Promise.resolve({ data: [] }),
    admin
      ? admin.from("recording_credits").select("balance").eq("user_id", user.id).single<{ balance: number }>()
      : Promise.resolve({ data: null }),
  ]);

  const recordings = (recordingsResult.data ?? []) as RecordingRow[];
  const credits = (creditsResult as { data: { balance: number } | null }).data?.balance ?? 0;

  const NAVY = "#1A1B52";

  return (
    <div className="min-h-screen" style={{ background: "#F3F2FB" }}>
      <div className="max-w-[860px] mx-auto px-4 py-10">

        {/* Header */}
        <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="font-display font-extrabold text-[26px]" style={{ color: NAVY }}>
              My Recordings
            </h1>
            <p className="text-[13.5px] mt-1" style={{ color: "rgba(26,27,82,0.55)" }}>
              AI-graded consultations reviewed by an RCGP examiner.
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div
              className="rounded-xl px-4 py-2 text-[13px]"
              style={{ background: "white", border: "1px solid rgba(26,27,82,0.1)", color: NAVY }}
            >
              <span className="font-bold text-[17px]">{credits}</span>{" "}
              <span style={{ color: "rgba(26,27,82,0.5)" }}>credit{credits !== 1 ? "s" : ""} remaining</span>
            </div>
            <form action="/api/recordings/checkout" method="POST">
              <button
                type="submit"
                className="rounded-xl px-4 py-2 text-[13px] font-bold"
                style={{ background: NAVY, color: "white", border: "none", cursor: "pointer" }}
              >
                Buy 5 credits — £60
              </button>
            </form>
          </div>
        </div>

        {purchased === "1" && (
          <div className="mb-6 rounded-xl px-4 py-3 text-[13px] font-semibold" style={{ background: "rgba(34,197,94,0.1)", color: "#166534", border: "1px solid rgba(34,197,94,0.2)" }}>
            Purchase successful — your credits have been added.
          </div>
        )}

        {recordings.length === 0 ? (
          <div
            className="rounded-2xl p-10 text-center"
            style={{ background: "white", border: "1px solid rgba(26,27,82,0.08)" }}
          >
            <p className="text-[15px] font-semibold mb-2" style={{ color: NAVY }}>No recordings yet</p>
            <p className="text-[13px]" style={{ color: "rgba(26,27,82,0.5)" }}>
              Open a station, start a study room, and press <strong>Record</strong> when you&apos;re ready.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {recordings.map((rec) => {
              const isFinal = !!rec.sent_to_candidate_at;
              const hasGrades = isFinal
                ? !!(rec.examiner_data_gathering && rec.examiner_clinical_management && rec.examiner_relating_to_others)
                : !!(rec.ai_data_gathering && rec.ai_clinical_management && rec.ai_relating_to_others);
              const grades = isFinal
                ? { dg: rec.examiner_data_gathering, cm: rec.examiner_clinical_management, ro: rec.examiner_relating_to_others }
                : { dg: rec.ai_data_gathering, cm: rec.ai_clinical_management, ro: rec.ai_relating_to_others };

              return (
                <Link
                  key={rec.id}
                  href={`/recordings/${rec.id}`}
                  className="block rounded-2xl p-5 transition hover:shadow-md"
                  style={{ background: "white", border: "1px solid rgba(26,27,82,0.08)", textDecoration: "none" }}
                >
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-[0.06em] mb-1" style={{ color: "rgba(26,27,82,0.4)" }}>
                        Station {rec.station_number}
                      </div>
                      <div className="font-bold text-[15px]" style={{ color: NAVY }}>{rec.station_title}</div>
                      <div className="text-[12px] mt-1" style={{ color: "rgba(26,27,82,0.45)" }}>
                        {new Date(rec.started_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      {/* Status */}
                      <span
                        className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-[0.05em]"
                        style={
                          isFinal
                            ? { background: "rgba(59,130,246,0.1)", color: "#1D4ED8" }
                            : rec.status === "pending_examiner"
                            ? { background: "rgba(245,158,11,0.1)", color: "#92400E" }
                            : rec.status === "processing"
                            ? { background: "rgba(139,92,246,0.1)", color: "#6D28D9" }
                            : { background: "rgba(26,27,82,0.07)", color: "rgba(26,27,82,0.4)" }
                        }
                      >
                        {isFinal ? "Report sent" : rec.status === "pending_examiner" ? "Awaiting examiner" : rec.status === "processing" ? "Processing…" : rec.status}
                      </span>

                      {/* Grades */}
                      {hasGrades && (
                        <div className="flex items-center gap-1.5 flex-wrap justify-end">
                          {(["dg", "cm", "ro"] as const).map((key) => {
                            const grade = grades[key];
                            const col = grade ? GRADE_COLORS[grade] : null;
                            return grade && col ? (
                              <span
                                key={key}
                                className="text-[11px] font-bold px-2 py-0.5 rounded"
                                style={{ background: col.bg, color: col.text }}
                              >
                                {grade}
                              </span>
                            ) : null;
                          })}
                          <span className="text-[12px] font-bold" style={{ color: NAVY }}>
                            {totalPoints(rec)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
