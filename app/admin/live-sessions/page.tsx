import { getSupabaseAdmin } from "@/lib/supabase";
import { LiveSessionsClient } from "./LiveSessionsClient";

export const dynamic = "force-dynamic";

export default async function AdminLiveSessionsPage() {
  const supabase = getSupabaseAdmin();

  // Auto-delete sessions where the scheduled date has passed
  if (supabase) {
    await supabase
      .from("live_sessions")
      .delete()
      .lt("scheduled_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());
  }

  const { data } = supabase
    ? await supabase
        .from("live_sessions")
        .select("id, zoom_url, scheduled_at")
        .order("scheduled_at", { ascending: true })
    : { data: [] };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display font-extrabold text-[26px] text-navy">Live Sessions</h1>
        <p className="text-[13px] text-navy/50 mt-0.5">
          Sessions are shown on the public live-session page, sorted by date. Past sessions are removed automatically.
        </p>
      </div>
      <LiveSessionsClient sessions={data ?? []} />
    </div>
  );
}
