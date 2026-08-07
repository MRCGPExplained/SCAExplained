import { getExaminerFromCookie } from "@/lib/examiner-auth";
import { getSupabaseAdmin } from "@/lib/supabase";
import { examinerLoginAction, examinerLogoutAction } from "./actions";
import ExaminerPortalClient, { type QueueRow } from "./ExaminerPortalClient";

export const dynamic = "force-dynamic";

const NAVY = "#333333";

const ERROR_MESSAGES: Record<string, string> = {
  required: "Passcode required.",
  incorrect: "Incorrect passcode.",
  server: "Server error — please try again.",
};

export default async function ExaminerPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  const examiner = await getExaminerFromCookie();

  // ── Not logged in: show passcode form ────────────────────────────────────
  if (!examiner) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#FAFAF8" }}>
        <div className="w-full max-w-[360px] rounded-2xl p-8" style={{ background: "white", border: "1px solid rgba(51,51,51,0.1)" }}>
          <div className="text-[11px] font-bold uppercase tracking-[0.08em] mb-1" style={{ color: "rgba(51,51,51,0.4)" }}>
            SCA Explained
          </div>
          <h1 className="font-display font-extrabold text-[22px] mb-1" style={{ color: NAVY }}>
            Examiner Portal
          </h1>
          <p className="text-[13px] mb-7" style={{ color: "rgba(51,51,51,0.5)" }}>
            Enter your passcode to continue.
          </p>
          <form action={examinerLoginAction} className="flex flex-col gap-4">
            <input
              name="passcode"
              type="password"
              placeholder="Passcode"
              autoComplete="current-password"
              required
              className="w-full px-4 py-3 rounded-xl text-[14px] outline-none"
              style={{ border: `1.5px solid ${error ? "rgba(220,38,38,0.4)" : "rgba(51,51,51,0.15)"}`, background: "#FAFAF8", color: NAVY, fontFamily: "inherit" }}
            />
            {error && (
              <p className="text-[12px]" style={{ color: "#B91C1C", marginTop: -8 }}>
                {ERROR_MESSAGES[error] ?? "Incorrect passcode."}
              </p>
            )}
            <button
              type="submit"
              className="w-full py-3 rounded-xl text-[14px] font-bold"
              style={{ background: NAVY, color: "white", border: "none", cursor: "pointer" }}
            >
              Enter
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── Logged in: show review portal ────────────────────────────────────────
  const admin = getSupabaseAdmin();
  const QUEUE_COLUMNS =
    "id, station_number, station_title, doctor_display_name, candidate_email, started_at, status, ai_data_gathering, ai_clinical_management, ai_relating_to_others, examiner_data_gathering, examiner_clinical_management, examiner_relating_to_others, sent_to_candidate_at, doctor_audio_path, examiner_id, manually_checked_at, examiners(name)";
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
