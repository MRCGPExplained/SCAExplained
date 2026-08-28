import { getSupabaseAdmin } from "@/lib/supabase";
import { DEFAULT_GRADING_GUIDANCE } from "@/lib/ai-defaults";
import ApiSettingsClient from "./ApiSettingsClient";

export const dynamic = "force-dynamic";

export default async function ApiSettingsPage() {
  const supabase = getSupabaseAdmin();

  const { data: settingsRows } = supabase
    ? await supabase.from("site_settings").select("key, value").in("key", ["ai_grading_prompt", "deepgram_enabled", "vercel_plan", "resend_enabled", "daily_co_enabled", "skill_grading_enabled", "grading_model"])
    : { data: [] };

  const settingsMap = new Map(
    ((settingsRows ?? []) as { key: string; value: string }[]).map((s) => [s.key, s.value])
  );

  const aiPrompt = settingsMap.get("ai_grading_prompt") ?? "";
  const deepgramEnabled = settingsMap.get("deepgram_enabled") !== "false"; // default on
  const vercelPlan = (settingsMap.get("vercel_plan") ?? "pro") as "hobby" | "pro";
  const resendEnabled = settingsMap.get("resend_enabled") !== "false"; // default on
  const dailyCoEnabled = settingsMap.get("daily_co_enabled") === "true"; // default off
  const skillGradingEnabled = settingsMap.get("skill_grading_enabled") === "true"; // default off
  const gradingModel = settingsMap.get("grading_model") ?? "claude-haiku-4-5-20251001";

  return (
    <ApiSettingsClient
      aiPrompt={aiPrompt}
      defaultPrompt={DEFAULT_GRADING_GUIDANCE}
      deepgramEnabled={deepgramEnabled}
      vercelPlan={vercelPlan}
      resendEnabled={resendEnabled}
      dailyCoEnabled={dailyCoEnabled}
      skillGradingEnabled={skillGradingEnabled}
      gradingModel={gradingModel}
    />
  );
}
