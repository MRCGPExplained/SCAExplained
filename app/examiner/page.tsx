import { createSupabaseServerClient } from "@/lib/supabase-case-bank";
import { getExaminer } from "@/lib/examiner-auth";
import { getSupabaseAdmin } from "@/lib/supabase";
import { examinerLogoutAction } from "./actions";
import ExaminerPortalClient, { type QueueRow } from "./ExaminerPortalClient";

export const dynamic = "force-dynamic";

const NAVY = "#333333";

export default async function ExaminerPage() {
  const examiner = await getExaminer();

  // ── Logged in, but this email isn't on the examiners list ────────────────
  if (!examiner) {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#FAFAF8" }}>
        <div className="w-full max-w-[360px] rounded-2xl p-8" style={{ background: "white", border: "1px solid rgba(51,51,51,0.1)" }}>
          <div className="text-[11px] font-bold uppercase tracking-[0.08em] mb-1" style={{ color: "rgba(51,51,51,0.4)" }}>
            SCA Focus
          </div>
          <h1 className="font-display font-extrabold text-[22px] mb-3" style={{ color: NAVY }}>
            Examiner Portal
          </h1>
          <p className="text-[13.5px] mb-1" style={{ color: "rgba(51,51,51,0.65)" }}>
            Signed in as <strong>{user?.email}</strong>.
          </p>
          <p className="text-[13.5px] mb-7 leading-relaxed" style={{ color: "rgba(51,51,51,0.5)" }}>
            This account isn&apos;t registered as an examiner. Ask an admin to add
            your email under Examiners, or sign out and try a different account.
          </p>
          <form action={examinerLogoutAction}>
            <button
              type="submit"
              className="w-full py-3 rounded-xl text-[14px] font-bold"
              style={{ background: NAVY, color: "white", border: "none", cursor: "pointer" }}
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── Logged in: show review portal ────────────────────────────────────────
  const admin = getSupabaseAdmin();
  const QUEUE_COLUMNS =
    "id, station_number, station_title, doctor_display_name, candidate_email, started_at, status, ai_data_gathering, ai_clinical_management, ai_relating_to_others, examiner_data_gathering, examiner_clinical_management, examiner_relating_to_others, sent_to_candidate_at, doctor_audio_path, examiner_id, manually_checked_at, examiners!station_recordings_examiner_id_fkey(name)";
  const [gpResult, aiResult, examinersResult, settingsResult] = admin
    ? await Promise.all([
        admin
          .from("station_recordings")
          .select(QUEUE_COLUMNS)
          .in("status", ["pending_examiner", "reviewing", "reviewed", "sent"])
          .order("started_at", { ascending: false })
          .limit(200),
        admin
          .from("station_recordings")
          .select(QUEUE_COLUMNS)
          .eq("status", "ai_graded")
          .order("started_at", { ascending: false })
          .limit(200),
        admin.from("examiners").select("id, name").order("name"),
        admin
          .from("site_settings")
          .select("key, value")
          .in("key", ["deepgram_enabled", "vercel_plan"]),
      ])
    : [{ data: [] }, { data: [] }, { data: [] }, { data: [] }];

  const gpRows = (gpResult.data ?? []) as unknown as QueueRow[];
  const aiRows = (aiResult.data ?? []) as unknown as QueueRow[];
  const examiners = (examinersResult.data ?? []) as { id: string; name: string }[];
  const settingsMap = new Map(
    ((settingsResult.data ?? []) as { key: string; value: string }[]).map((r) => [r.key, r.value])
  );
  const pipelineRetryEnabled =
    settingsMap.get("deepgram_enabled") === "true" && (settingsMap.get("vercel_plan") ?? "pro") === "pro";

  return (
    <div className="min-h-screen" style={{ background: "#FAFAF8" }}>
      <div className="max-w-[860px] mx-auto px-4 py-10">

        <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.07em] mb-1" style={{ color: "rgba(51,51,51,0.45)" }}>
              Examiner Portal
            </div>
            <h1 className="font-display font-extrabold text-[26px]" style={{ color: NAVY }}>
              Review Queue
            </h1>
            <p className="text-[13px] mt-1" style={{ color: "rgba(51,51,51,0.5)" }}>
              Welcome, {examiner.name}.
            </p>
          </div>
          <form action={examinerLogoutAction}>
            <button type="submit" className="text-[12px]" style={{ background: "none", border: "none", color: "rgba(51,51,51,0.4)", cursor: "pointer" }}>
              Sign out
            </button>
          </form>
        </div>

        <ExaminerPortalClient
          gpRows={gpRows}
          aiRows={aiRows}
          examiners={examiners}
          pipelineRetryEnabled={pipelineRetryEnabled}
        />
      </div>
    </div>
  );
}
