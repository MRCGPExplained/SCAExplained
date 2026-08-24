import { getSupabaseAdmin } from "@/lib/supabase";
import { DEFAULT_SYSTEM_PROMPT } from "@/lib/ai-defaults";
import ApiSettingsClient from "./ApiSettingsClient";

export const dynamic = "force-dynamic";

export default async function ApiSettingsPage() {
  const supabase = getSupabaseAdmin();

  const { data: settingsRows } = supabase
    ? await supabase.from("site_settings").select("key, value").in("key", ["ai_grading_prompt", "deepgram_enabled", "vercel_plan", "resend_enabled", "daily_co_enabled"])
    : { data: [] };

  const settingsMap = new Map(
    ((settingsRows ?? []) as { key: string; value: string }[]).map((s) => [s.key, s.value])
  );

  const aiPrompt = settingsMap.get("ai_grading_prompt") ?? "";
  const deepgramEnabled = settingsMap.get("deepgram_enabled") !== "false"; // default on
  const vercelPlan = (settingsMap.get("vercel_plan") ?? "pro") as "hobby" | "pro";
  const resendEnabled = settingsMap.get("resend_enabled") !== "false"; // default on
  const dailyCoEnabled = settingsMap.get("daily_co_enabled") === "true"; // default off

  return (
    <ApiSettingsClient
      aiPrompt={aiPrompt}
      defaultPrompt={DEFAULT_SYSTEM_PROMPT}
      deepgramEnabled={deepgramEnabled}
      vercelPlan={vercelPlan}
      resendEnabled={resendEnabled}
      dailyCoEnabled={dailyCoEnabled}
    />
  );
}
