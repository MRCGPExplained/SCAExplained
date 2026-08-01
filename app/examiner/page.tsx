import { redirect } from "next/navigation";
import Link from "next/link";
import { getExaminerFromCookie } from "@/lib/examiner-auth";
import { getSupabaseAdmin } from "@/lib/supabase";
import { examinerLogoutAction } from "./login/actions";

export const dynamic = "force-dynamic";

const NAVY = "#1A1B52";

type QueueRow = {
  id: string;
  station_number: number;
  station_title: string;
  doctor_display_name: string;
  patient_display_name: string;
  started_at: string;
  status: string;
  ai_data_gathering: string | null;
  ai_clinical_management: string | null;
  ai_relating_to_others: string | null;
  examiner_reviewed_at: string | null;
  sent_to_candidate_at: string | null;
};

export default async function ExaminerPage() {
  const examiner = await getExaminerFromCookie();
  if (!examiner) redirect("/examiner/login");

  const admin = getSupabaseAdmin();
  const { data: queue } = admin
    ? await admin
        .from("station_recordings")
        .select("id, station_number, station_title, doctor_display_name, patient_display_name, started_at, status, ai_data_gathering, ai_clinical_management, ai_relating_to_others, examiner_reviewed_at, sent_to_candidate_at")
        .in("status", ["pending_examiner", "reviewed", "sent"])
        .order("started_at", { ascending: false })
        .limit(100)
    : { data: [] };

  const pending = ((queue ?? []) as QueueRow[]).filter((r) => r.status === "pending_examiner");
  const done = ((queue ?? []) as QueueRow[]).filter((r) => r.status !== "pending_examiner");

  return (
    <div className="min-h-screen" style={{ background: "#F3F2FB" }}>
      <div className="max-w-[860px] mx-auto px-4 py-10">

        <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.07em] mb-1" style={{ color: "rgba(26,27,82,0.45)" }}>
              Examiner Portal
            </div>
            <h1 className="font-display font-extrabold text-[26px]" style={{ color: NAVY }}>
              Review Queue
            </h1>
            <p className="text-[13px] mt-1" style={{ color: "rgba(26,27,82,0.5)" }}>
              Welcome, {examiner.name}.
            </p>
          </div>
          <form action={examinerLogoutAction}>
            <button type="submit" className="text-[12px]" style={{ background: "none", border: "none", color: "rgba(26,27,82,0.4)", cursor: "pointer" }}>
              Sign out
            </button>
          </form>
        </div>

        {/* Pending */}
        <div className="mb-8">
          <h2 className="text-[13px] font-bold uppercase tracking-[0.06em] mb-3" style={{ color: "rgba(26,27,82,0.45)" }}>
            Awaiting Review ({pending.length})
          </h2>
          {pending.length === 0 ? (
            <div className="rounded-2xl p-8 text-center" style={{ background: "white", border: "1px solid rgba(26,27,82,0.08)" }}>
              <p className="text-[14px]" style={{ color: "rgba(26,27,82,0.4)" }}>Queue is clear — nothing to review right now.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              {pending.map((rec) => <RecordingCard key={rec.id} rec={rec} />)}
            </div>
          )}
        </div>

        {done.length > 0 && (
          <div>
            <h2 className="text-[13px] font-bold uppercase tracking-[0.06em] mb-3" style={{ color: "rgba(26,27,82,0.45)" }}>
              Completed ({done.length})
            </h2>
            <div className="flex flex-col gap-2.5">
              {done.map((rec) => <RecordingCard key={rec.id} rec={rec} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function RecordingCard({ rec }: { rec: QueueRow }) {
  const isPending = rec.status === "pending_examiner";
  return (
    <Link
      href={`/examiner/${rec.id}`}
      className="block rounded-2xl p-5 transition hover:shadow-md"
      style={{ background: "white", border: `1px solid ${isPending ? "rgba(245,158,11,0.3)" : "rgba(26,27,82,0.08)"}`, textDecoration: "none" }}
    >
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.06em] mb-1" style={{ color: "rgba(26,27,82,0.4)" }}>
            Station {rec.station_number}
          </div>
          <div className="font-bold text-[15px] mb-1" style={{ color: NAVY }}>{rec.station_title}</div>
          <div className="text-[12px]" style={{ color: "rgba(26,27,82,0.5)" }}>
            Dr {rec.doctor_display_name} · {new Date(rec.started_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span
            className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-[0.05em]"
            style={
              isPending
                ? { background: "rgba(245,158,11,0.12)", color: "#92400E" }
                : rec.status === "sent"
                ? { background: "rgba(59,130,246,0.1)", color: "#1D4ED8" }
                : { background: "rgba(34,197,94,0.1)", color: "#166534" }
            }
          >
            {isPending ? "Needs review" : rec.status === "sent" ? "Sent to candidate" : "Reviewed"}
          </span>
          {rec.ai_data_gathering && (
            <div className="text-[11px]" style={{ color: "rgba(26,27,82,0.4)" }}>
              AI: {rec.ai_data_gathering} / {rec.ai_clinical_management} / {rec.ai_relating_to_others}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
