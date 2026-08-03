import { getSupabaseAdmin } from "@/lib/supabase";
import { LiveSessionsClient } from "../live-sessions/LiveSessionsClient";
import WebinarCodesClient, { type WebinarCode } from "../webinar-codes/WebinarCodesClient";

export const dynamic = "force-dynamic";

export default async function AdminWebinarPage() {
  const supabase = getSupabaseAdmin();

  if (supabase) {
    await supabase
      .from("live_sessions")
      .delete()
      .lt("scheduled_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());
  }

  const [sessionsResult, codesResult] = await Promise.all([
    supabase
      ? supabase.from("live_sessions").select("id, zoom_url, scheduled_at, is_free").order("scheduled_at", { ascending: true })
      : Promise.resolve({ data: [] }),
    supabase
      ? supabase.from("webinar_codes").select("id, code, label, active, recording_credits, max_uses, use_count, expires_at, created_at").order("created_at", { ascending: false })
      : Promise.resolve({ data: [] }),
  ]);

  return (
    <div className="flex flex-col gap-14">
      <div>
        <div className="mb-8">
          <h1 className="font-display font-extrabold text-[26px] text-navy">Webinar</h1>
          <p className="text-[13px] text-navy/50 mt-0.5">Manage upcoming webinar dates and the codes attendees use to redeem recording credits.</p>
        </div>

        <div className="mb-3">
          <h2 className="font-display font-bold text-[18px] text-navy">Dates</h2>
          <p className="text-[13px] text-navy/50 mt-0.5">Shown on the homepage. Past sessions are removed automatically after 24 hours.</p>
        </div>
        <LiveSessionsClient sessions={(sessionsResult.data ?? []) as { id: string; zoom_url: string; scheduled_at: string; is_free: boolean }[]} />
      </div>

      <div>
        <div className="mb-3">
          <h2 className="font-display font-bold text-[18px] text-navy">Codes</h2>
          <p className="text-[13px] text-navy/50 mt-0.5">Share one code per webinar. Attendees redeem it at scaexplained.com/redeem for free recording credits.</p>
        </div>
        <WebinarCodesClient codes={(codesResult.data ?? []) as WebinarCode[]} />
      </div>
    </div>
  );
}
