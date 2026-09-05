import { getSupabaseAdmin } from "@/lib/supabase";
import { DEFAULT_SKILL_CONFIG, DEFAULT_SKILL_PROMPT, type GradingSkill } from "@/lib/skill-framework";
import SkillsClient from "./SkillsClient";

export const dynamic = "force-dynamic";

type SkillRow = GradingSkill & { id: string };

export default async function AdminSkillsPage() {
  const supabase = getSupabaseAdmin();

  const [skillsResult, settingsResult] = supabase
    ? await Promise.all([
        supabase
          .from("grading_skills")
          .select("id, skill_key, label, question, domain, sort_order, active")
          .order("sort_order", { ascending: true }),
        supabase
          .from("site_settings")
          .select("key, value")
          .in("key", [
            "skill_threshold_up",
            "skill_threshold_down",
            "skill_min_assessable",
            "skill_framework_version",
            "skill_grading_enabled",
            "skill_cap_rto",
            "skill_prompt",
          ]),
      ])
    : [{ data: [] }, { data: [] }];

  const settings = new Map(
    ((settingsResult.data ?? []) as { key: string; value: string }[]).map((s) => [s.key, s.value])
  );

  return (
    <SkillsClient
      skills={(skillsResult.data ?? []) as SkillRow[]}
      thresholdUp={settings.get("skill_threshold_up") ?? String(DEFAULT_SKILL_CONFIG.thresholdUp)}
      thresholdDown={settings.get("skill_threshold_down") ?? String(DEFAULT_SKILL_CONFIG.thresholdDown)}
      minAssessable={settings.get("skill_min_assessable") ?? String(DEFAULT_SKILL_CONFIG.minAssessable)}
      frameworkVersion={settings.get("skill_framework_version") ?? "1"}
      skillGradingEnabled={settings.get("skill_grading_enabled") === "true"}
      capRto={settings.get("skill_cap_rto") === "true"}
      skillPrompt={settings.get("skill_prompt") ?? DEFAULT_SKILL_PROMPT}
      usingDefaultPrompt={!settings.get("skill_prompt")}
    />
  );
}
