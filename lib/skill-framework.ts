/**
 * Consultation-skill grading.
 *
 * The split here is deliberate. The *content* — which skills exist, the Yes/No
 * question each asks, which domain it feeds — is admin-editable data in
 * grading_skills. The *machinery* — how answers are counted and how a grade
 * moves — is this file, and is not editable from the UI. A typo in a question
 * changes one question; a typo in the counting rule would silently change every
 * grade, with no diff and no rollback.
 *
 * The model only answers the questions. It never decides the grade adjustment:
 * that is arithmetic, and arithmetic belongs in code.
 */

import type { SupabaseClient } from "@supabase/supabase-js";

export type SkillRating = "good" | "needs_improvement" | "not_assessable";

export type DomainKey = "data_gathering" | "clinical_management" | "relating_to_others";
export type SkillDomain = DomainKey | "none";

export type Grade = "CF" | "F" | "P" | "CP";

/** Worst to best. Adjustment moves one step along this and clamps at the ends. */
const GRADE_ORDER: Grade[] = ["CF", "F", "P", "CP"];

export interface GradingSkill {
  skill_key: string;
  label: string;
  question: string;
  domain: SkillDomain;
  sort_order: number;
  active: boolean;
}

export interface SkillAnswer {
  skill: string;
  rating: SkillRating;
  comment: string;
}

export interface DomainOutcome {
  /** Assessable answers counted for this domain. */
  assessed: number;
  good: number;
  needsImprovement: number;
  /** Null when the domain had too few assessable answers to act on. */
  goodPct: number | null;
  direction: "up" | "down" | "none";
  baseline: Grade | null;
  final: Grade | null;
}

export interface SkillsAssessment {
  skills: SkillAnswer[];
  /** Computed here, not by the model — kept for the examiner view and tuning. */
  outcomes?: Partial<Record<DomainKey, DomainOutcome>>;
}

export interface SkillConfig {
  thresholdUp: number;
  thresholdDown: number;
  minAssessable: number;
  frameworkVersion: number;
}

export const DEFAULT_SKILL_CONFIG: SkillConfig = {
  thresholdUp: 75,
  thresholdDown: 75,
  minAssessable: 4,
  frameworkVersion: 1,
};

export const RATING_LABEL: Record<SkillRating, string> = {
  good: "Good",
  needs_improvement: "Needs Improvement",
  not_assessable: "Not Assessable",
};

export const DOMAIN_LABEL: Record<SkillDomain, string> = {
  data_gathering: "Data Gathering",
  clinical_management: "Clinical Management",
  relating_to_others: "Relating to Others",
  none: "Feedback only",
};

/**
 * Thresholds must exceed 50. Good and Needs Improvement together account for
 * every assessable answer, so at 50 or below an even split would satisfy the
 * promote and the demote rule at once and the grade would be pushed both ways.
 */
export function validateThreshold(raw: string): { value?: number; error?: string } {
  const trimmed = raw.trim().replace(/%$/, "").trim();
  if (!trimmed) return { error: "Enter a percentage." };
  if (!/^\d+(\.\d+)?$/.test(trimmed)) return { error: "Use digits only, for example 75." };
  const value = Number(trimmed);
  if (!Number.isFinite(value)) return { error: "That is not a number." };
  if (value <= 50) return { error: "Must be above 50%, or a split verdict could push a grade both ways at once." };
  if (value > 100) return { error: "Cannot be above 100%." };
  return { value };
}

export function validateMinAssessable(raw: string): { value?: number; error?: string } {
  const trimmed = raw.trim();
  if (!/^\d+$/.test(trimmed)) return { error: "Use a whole number." };
  const value = Number(trimmed);
  if (value < 2) return { error: "Must be at least 2, so a single question can never move a grade." };
  if (value > 50) return { error: "That is higher than any realistic number of skills." };
  return { value };
}

export async function loadGradingSkills(
  admin: SupabaseClient
): Promise<GradingSkill[]> {
  const { data } = await admin
    .from("grading_skills")
    .select("skill_key, label, question, domain, sort_order, active")
    .eq("active", true)
    .order("sort_order", { ascending: true })
    .returns<GradingSkill[]>();
  return data ?? [];
}

/** Every skill including retired ones, so historical reports resolve labels. */
export async function loadAllSkillLabels(
  admin: SupabaseClient
): Promise<Record<string, string>> {
  const { data } = await admin
    .from("grading_skills")
    .select("skill_key, label")
    .returns<{ skill_key: string; label: string }[]>();
  return Object.fromEntries((data ?? []).map((s) => [s.skill_key, s.label]));
}

function step(grade: Grade, direction: "up" | "down"): Grade {
  const i = GRADE_ORDER.indexOf(grade);
  if (i < 0) return grade;
  const next = direction === "up" ? i + 1 : i - 1;
  // Clamped: nothing goes above CP or below CF.
  return GRADE_ORDER[Math.min(GRADE_ORDER.length - 1, Math.max(0, next))];
}

/**
 * Applies the skill answers to the model's baseline grades.
 *
 * Not-assessable answers are excluded from the denominator — they mean "no
 * evidence", not a negative — and a domain needs `minAssessable` answers before
 * it can move at all, so a domain with one or two questions assigned to it can
 * never swing on a single verdict.
 */
export function applySkillAdjustment(
  baseline: Record<DomainKey, Grade | null>,
  answers: SkillAnswer[],
  skills: GradingSkill[],
  config: SkillConfig
): { final: Record<DomainKey, Grade | null>; outcomes: Partial<Record<DomainKey, DomainOutcome>> } {
  const domainOf = new Map(skills.map((s) => [s.skill_key, s.domain]));
  const domains: DomainKey[] = ["data_gathering", "clinical_management", "relating_to_others"];

  const final = { ...baseline };
  const outcomes: Partial<Record<DomainKey, DomainOutcome>> = {};

  for (const domain of domains) {
    const relevant = answers.filter((a) => domainOf.get(a.skill) === domain);
    const assessable = relevant.filter((a) => a.rating !== "not_assessable");
    const good = assessable.filter((a) => a.rating === "good").length;
    const needsImprovement = assessable.length - good;

    let direction: "up" | "down" | "none" = "none";
    let goodPct: number | null = null;

    if (assessable.length >= config.minAssessable) {
      goodPct = (good / assessable.length) * 100;
      const badPct = (needsImprovement / assessable.length) * 100;
      if (goodPct >= config.thresholdUp) direction = "up";
      else if (badPct >= config.thresholdDown) direction = "down";
    }

    const base = baseline[domain];
    final[domain] = base && direction !== "none" ? step(base, direction) : base;

    outcomes[domain] = {
      assessed: assessable.length,
      good,
      needsImprovement,
      goodPct,
      direction,
      baseline: base,
      final: final[domain],
    };
  }

  return { final, outcomes };
}

/** The skills half of the grading prompt. */
export function buildSkillFrameworkPrompt(
  skills: GradingSkill[],
  stationNotes: Record<string, string> = {}
): string {
  const list = skills
    .map((s) => {
      const note = stationNotes[s.skill_key]?.trim();
      return [
        `- ${s.skill_key} — ${s.label}`,
        `  Question: ${s.question}`,
        note ? `  Note for this station (context for this question only, not an extra requirement unless it says so): ${note}` : null,
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n");

  return `
SKILLS ASSESSMENT

Answer each question below about the consultation. These are deliberately
closed questions: answer "good" for yes and "needs_improvement" for no. Use
"not_assessable" only when the transcript genuinely does not contain enough to
answer either way — never to avoid a difficult judgement, and never as a
substitute for "no" when the thing simply did not happen. If the doctor had the
opportunity and did not do it, that is needs_improvement, not not_assessable.

${list}

For each question write a comment of three to four sentences, addressed to the
candidate directly as "you". Never write "the candidate", "the doctor" or "the
clinician". Include a short quoted or closely paraphrased example from the
transcript.
- good: say what you did well, with the example, and why it worked. If you can
  see a genuine way to make it even better, add it; do not manufacture one.
- needs_improvement: say what was missing or went wrong, with the example, and
  say specifically how to do it differently.
- not_assessable: say briefly what the transcript does not show and what would
  have demonstrated it.

Ground every comment in what the transcript actually shows. Never invent a
behaviour. Never use em dashes; use a comma or rewrite the sentence.

Grade the three domains exactly as you would without this section — from the
station's own criteria and the transcript. Do NOT adjust the grades yourself to
reflect these answers; that adjustment is applied separately.
`.trim();
}

/** The skills half of the JSON contract. */
export function buildSkillsOutputContract(skills: GradingSkill[]): string {
  const keys = skills.map((s) => `"${s.skill_key}"`).join(", ");
  return `  "skills_assessment": {
    "skills": [
      {
        "skill": "one of: ${keys}",
        "rating": "good | needs_improvement | not_assessable",
        "comment": "Three to four sentences, addressed to the candidate as \\"you\\", including a quoted or paraphrased example."
      }
    ]
  }`;
}
