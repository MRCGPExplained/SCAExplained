import { getSupabaseAdmin } from "@/lib/supabase";
import { SettingsForm } from "./SettingsForm";

export const dynamic = "force-dynamic";

const DEFAULTS: Record<string, string> = {
  FREE_TRAINING_YOUTUBE_ID: "",
  LIVE_SESSION_ZOOM_URL: "",
  OBSERVER_UNLOCKED_AT: "1",
  DEFAULT_WEBINAR_TITLE: "How To Get A Clear Pass",
  DEFAULT_WEBINAR_CAPACITY: "200",
  DEFAULT_WEBINAR_START: "18:00",
  DEFAULT_WEBINAR_END: "20:00",
  DEFAULT_WEBINAR_DESCRIPTION: "2-hour free training on what examiners are scoring.",
  DEFAULT_INTENSIVE_TITLE: "SCA Intensive",
  DEFAULT_INTENSIVE_ACTIVE_CAPACITY: "2",
  DEFAULT_INTENSIVE_ACTIVE_PRICE: "20000",
  DEFAULT_INTENSIVE_OBSERVER_CAPACITY: "8",
  DEFAULT_INTENSIVE_OBSERVER_PRICE: "5000",
  DEFAULT_INTENSIVE_START: "10:00",
  DEFAULT_INTENSIVE_END: "12:00",
  DEFAULT_INTENSIVE_DESCRIPTION:
    "Small-group live workshop. Six stations — maximum two active candidates, minimum three consultations each.",
};

async function getCurrentSettings(): Promise<Record<string, string>> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return DEFAULTS;

  const { data } = await supabase.from("settings").select("key, value");
  const fromDb = Object.fromEntries(
    (data ?? []).map((r: { key: string; value: string }) => [r.key, r.value])
  );
  return { ...DEFAULTS, ...fromDb };
}

export default async function SettingsPage() {
  const currentValues = await getCurrentSettings();

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display font-extrabold text-[26px] text-navy">
          Presets &amp; Settings
        </h1>
        <p className="text-[13px] text-navy/50 mt-0.5">
          Changes take effect immediately — no redeploy needed.
        </p>
      </div>
      <SettingsForm currentValues={currentValues} />
    </div>
  );
}
