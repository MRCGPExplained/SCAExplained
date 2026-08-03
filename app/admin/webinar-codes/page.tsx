import { getSupabaseAdmin } from "@/lib/supabase";
import WebinarCodesClient, { type WebinarCode } from "./WebinarCodesClient";

export const dynamic = "force-dynamic";

export default async function WebinarCodesPage() {
  const supabase = getSupabaseAdmin();

  const { data } = supabase
    ? await supabase
        .from("webinar_codes")
        .select("id, code, label, active, recording_credits, use_count, expires_at, created_at")
        .order("created_at", { ascending: false })
    : { data: [] };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display font-extrabold text-[26px] text-navy">Webinar Codes</h1>
        <p className="text-[13px] text-navy/50 mt-0.5">
          Share one code per webinar. Attendees redeem it at scaexplained.com/redeem for free recording credits.
        </p>
      </div>
      <WebinarCodesClient codes={(data ?? []) as WebinarCode[]} />
    </div>
  );
}
