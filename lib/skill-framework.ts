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
  /**
   * What to do differently next time. Its own field rather than the closing
   * sentence of the comment: asked for in prose it arrived about a third of the
   * time, and buried at the end of a paragraph it is the easiest part to skim
   * past. Required of the model on needs_improvement, absent otherwise.
   */
  improvement?: string;
}

export interface DomainOutcome {
  /** Assessable answers counted for this domain. */
  assessed: number;
  good: number;
  needsImprovement: number;
  /** Null when the domain had too few assessable answers to act on. */
  goodPct: number | null;
  direction: "up" | "down" | "none";
  /** The model's own grade, always as it graded it — never the capped value. */
  baseline: Grade | null;
  /** True when the ceiling actually lowered the starting point for this domain. */
  capApplied?: boolean;
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
  /** See CAP_DOMAIN. Off by default, so grading behaves as before until turned on. */
  capEnabled: boolean;
}

export const DEFAULT_SKILL_CONFIG: SkillConfig = {
  thresholdUp: 75,
  thresholdDown: 75,
  minAssessable: 4,
  frameworkVersion: 1,
  capEnabled: false,
};

/**
 * The ceiling.
 *
 * Pass versus Clear Pass on Relating to Others is the least reliable judgement
 * the model makes: on one transcript it returned Pass and Clear Pass on two runs
 * of the same input. The questions on that same transcript did not waver. So
 * when the cap is on, the model cannot award the top band here — it sets the
 * floor, and Clear Pass has to be earned on the count.
 *
 * Only this domain is capped. Data Gathering and Clinical Management are graded
 * against the station's own criteria, which are concrete enough that the model
 * is not guessing at them.
 */
export const CAP_DOMAIN: DomainKey = "relating_to_others";
export const CAP_CEILING: Grade = "P";

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
 *
 * With the cap on, CAP_DOMAIN starts from CAP_CEILING rather than the model's
 * grade whenever the model went higher. One consequence is worth stating
 * plainly: a capped Clear Pass that then demotes lands two bands below what the
 * model said. That only happens when the model and the questions flatly
 * contradict each other, and in that case the count is the one showing its
 * working.
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

    // The cap is gated on the domain being able to move. Applying it while the
    // domain is dormant would put the top band permanently out of reach with
    // nothing in the report to explain why.
    const canMove = assessable.length >= config.minAssessable;
    const capApplied =
      config.capEnabled &&
      domain === CAP_DOMAIN &&
      canMove &&
      base !== null &&
      GRADE_ORDER.indexOf(base) > GRADE_ORDER.indexOf(CAP_CEILING);
    const start = capApplied ? CAP_CEILING : base;

    final[domain] = start && direction !== "none" ? step(start, direction) : start;

    outcomes[domain] = {
      assessed: assessable.length,
      good,
      needsImprovement,
      goodPct,
      direction,
      // Deliberately the model's own grade, not `start`. Storing the capped
      // value would erase the evidence needed to judge whether the cap earns
      // its place — namely how often the model and the count disagreed.
      baseline: base,
      ...(capApplied ? { capApplied: true } : {}),
      final: final[domain],
    };
  }

  return { final, outcomes };
}

/**
 * Where the questions are injected into the prompt.
 *
 * The questions themselves are generated from grading_skills, never typed by
 * hand, so an edited prompt that dropped them would send the model an
 * assessment with nothing to assess. Required on save for that reason.
 */
export const SKILLS_TOKEN = "{{SKILLS}}";

/**
 * The editable half of the skills prompt.
 *
 * Admin-replaceable, like the grading guidance. The output contract is not, and
 * neither is the counting rule: this decides how the model is asked, not how
 * the answers are parsed or what they do to a grade.
 */
export const DEFAULT_SKILL_PROMPT = `
SKILLS ASSESSMENT

Answer each question below about the consultation. These are deliberately
closed questions: answer "good" for yes and "needs_improvement" for no. Use
"not_assessable" only when the transcript genuinely does not contain enough to
answer either way — never to avoid a difficult judgement, and never as a
substitute for "no" when the thing simply did not happen. If the doctor had the
opportunity and did not do it, that is needs_improvement, not not_assessable.

Answer on what happened, not on whether it was reasonable. A thing can be
understandable, efficient, or the right call for this particular patient and
still not have happened, and the answer is then "no". If your comment would
read "no, but that was fair enough here", the answer is needs_improvement and
the reason why it was fair enough belongs in the comment. Never talk yourself
from a no to a yes.

Decide the answer first, then write the comment to match it. A comment that
describes the thing not happening sits under needs_improvement, never under
good.

{{SKILLS}}

For each question write a comment of three to four sentences, addressed to the
candidate directly as "you". Never write "the candidate", "the doctor" or "the
clinician". Point to a specific moment in the consultation every time.
- good: say what you did well, with the moment, and why it worked. If there is a
  genuine way to go further, offer it as a next step — "you could build on this
  by", "an even stronger version of this would be" — never as a shortfall. Do
  not write "however", "but you did not" or "you failed to" in a good comment:
  the answer was yes, and the candidate should finish reading it feeling that.
  Do not manufacture a next step where there honestly isn't one.
- needs_improvement: say what was missing or went wrong, with the moment. The
  fix does not go here: put it in the separate "improvement" field, which every
  needs_improvement answer must have, without exception, however many of them
  there are. One or two sentences, what to do instead next time, concrete
  enough to act on rather than a restatement of the fault. Write the
  improvement before writing the comment, so a long comment never crowds it
  out. An answer marked needs_improvement with no improvement is not a finished
  answer.
- not_assessable: say briefly what the transcript does not show and what would
  have demonstrated it.

Never quote the transcript. Describe the moment in your own words instead: write
"when you asked what she thought was causing it" rather than reproducing the
words inside quotation marks. The transcript is a machine transcription of
speech, so it carries filler and mis-heard words, and quoting it puts sentences
in the candidate's mouth that they did not say. Describing keeps the feedback
anchored to something that genuinely happened without misquoting anyone.

There is one place quotation marks belong: on a needs_improvement answer, a
phrase you are offering for next time. That is wording you are suggesting, not
wording anyone used, so quoting it misrepresents nobody.

Ground every comment in what the transcript actually shows. Never invent a
behaviour. Never use em dashes; use a comma or rewrite the sentence.

Grade the three domains exactly as you would without this section — from the
station's own criteria and the transcript. Do NOT adjust the grades yourself to
reflect these answers; that adjustment is applied separately.
`.trim();

/**
 * A saved prompt has to keep the questions in it. Without the token the model
 * would be told to answer an assessment and shown no questions, and the failure
 * would be silent: valid JSON with an empty skills array, so no error, no
 * adjustment, and nothing on the report to say why.
 */
export function validateSkillPrompt(raw: string): { value?: string; error?: string } {
  const value = raw.trim();
  if (!value) return { error: "The prompt cannot be empty." };
  if (!value.includes(SKILLS_TOKEN)) {
    return { error: `Keep ${SKILLS_TOKEN} somewhere in the prompt. It is where the questions are inserted, and without it the model is asked to answer questions it was never shown.` };
  }
  return { value };
}

/** The skills half of the grading prompt, with the live questions filled in. */
export function buildSkillFrameworkPrompt(
  skills: GradingSkill[],
  stationNotes: Record<string, string> = {},
  template?: string | null
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

  // A saved prompt missing the token would silently drop every question, so it
  // is refused here as well as on save, rather than trusted twice.
  const chosen = template?.trim();
  const base = chosen && chosen.includes(SKILLS_TOKEN) ? chosen : DEFAULT_SKILL_PROMPT;

  return base.split(SKILLS_TOKEN).join(list);
}

/** The skills half of the JSON contract. */
export function buildSkillsOutputContract(skills: GradingSkill[]): string {
  const keys = skills.map((s) => `"${s.skill_key}"`).join(", ");
  return `  "skills_assessment": {
    "skills": [
      {
        "skill": "one of: ${keys}",
        "rating": "good | needs_improvement | not_assessable",
        "improvement": "MANDATORY on every needs_improvement, and the response is incomplete without it: one or two sentences saying what to do differently next time, addressed as \\"you\\", concrete enough to act on. Write this before the comment. Omit entirely for good and not_assessable.",
        "comment": "Three to four sentences, addressed to the candidate as \\"you\\", describing a specific moment in the consultation without quoting the transcript."
      }
    ]
  }`;
}
