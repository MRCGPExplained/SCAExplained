import { getSupabaseAdmin } from "@/lib/supabase";
import { FeedbackClient, type ReportFeedbackRow } from "./FeedbackClient";

export const dynamic = "force-dynamic";

export default async function AdminFeedbackPage() {
  const supabase = getSupabaseAdmin();

  const [reportsResult, reportFeedbackResult] = supabase
    ? await Promise.all([
        supabase
          .from("station_reports")
          .select("id, station_number, station_title, user_name, user_email, content, type, resolved, reply_text, replied_at, replied_by_name, created_at")
          .order("created_at", { ascending: false }),
        supabase
          .from("ai_report_feedback")
          .select(
            "id, recording_id, agrees, comment, created_at, station_recordings(station_number, station_title, doctor_display_name, candidate_email)"
          )
          .order("created_at", { ascending: false }),
      ])
    : [{ data: [] }, { data: [] }];

  return (
    <div>
      <h1 className="font-display font-bold text-[22px] text-navy mb-1">Feedback &amp; Help</h1>
      <p className="text-[13px] text-navy/50 mb-6">
        Everything candidates have sent us. Replying to Case Feedback or Help emails the
        candidate directly; Report Feedback is a one-way signal about AI marking.
      </p>
      <FeedbackClient
        reports={reportsResult.data ?? []}
        reportFeedback={(reportFeedbackResult.data ?? []) as unknown as ReportFeedbackRow[]}
      />
    </div>
  );
}
