import { getSupabaseAdmin } from "@/lib/supabase";
import { FeedbackClient } from "./FeedbackClient";

export const dynamic = "force-dynamic";

export default async function AdminFeedbackPage() {
  const supabase = getSupabaseAdmin();
  const { data: reports } = supabase
    ? await supabase
        .from("station_reports")
        .select("id, station_number, station_title, user_name, user_email, content, type, resolved, reply_text, replied_at, replied_by_name, created_at")
        .order("created_at", { ascending: false })
    : { data: [] };

  return (
    <div>
      <h1 className="font-display font-bold text-[22px] text-navy mb-1">Feedback &amp; Help</h1>
      <p className="text-[13px] text-navy/50 mb-6">
        Candidate Feedback and Help submissions. Replying here emails the candidate directly.
      </p>
      <FeedbackClient reports={reports ?? []} />
    </div>
  );
}
