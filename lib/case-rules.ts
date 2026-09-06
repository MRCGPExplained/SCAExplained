/**
 * Case-specific grading rules — the last and most authoritative layer.
 *
 * Three parts, each handled by whatever is actually reliable at it. The model
 * answers the trigger, because only a model can read "did the doctor defer
 * antibiotics until after examination" off a transcript. Code applies the
 * effect, because a prompt cannot be trusted with a consequence: asked to
 * answer not_assessable below eleven minutes, the model wrote "which is under
 * 11 minutes" and answered good anyway. A layer described as authoritative
 * cannot run on the least reliable mechanism in the system.
 *
 * Runs after the skill modulation, so it overrides both the model's own grade
 * and anything the skills did to it.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import { GRADE_ORDER, type DomainKey, type Grade } from "./skill-framework";

export type RuleBound = "ceiling" | "floor";
export type YesNo = "yes" | "no";

export interface CaseRule {
  id: string;
  name: string;
  trigger_question: string;
  fires_when: YesNo;
  domain: DomainKey;
  bound: RuleBound;
  grade: Grade;
  comment_basis: string;
  sort_order: number;
  active: boolean;
}

/** One answer from the model, keyed by the rule's id. */
export interface CaseRuleAnswer {
  rule: string;
  answer: string;
  /** Written only when the answer fires the rule; replaces the domain comment. */
  comment?: string;
}

export interface FiredRule {
  id: string;
  name: string;
  domain: DomainKey;
  bound: RuleBound;
  grade: Grade;
  /** The domain grade before this layer touched it. */
  before: Grade | null;
  after: Grade | null;
  /** True for the rule that actually set the final grade for its domain. */
  decisive: boolean;
}

export interface CaseRulesOutcome {
  final: Record<DomainKey, Grade | null>;
  /** Replacement domain comments, from the rule that decided each domain. */
  comments: Partial<Record<DomainKey, string>>;
  fired: FiredRule[];
}

const DOMAINS: DomainKey[] = ["data_gathering", "clinical_management", "relating_to_others"];

export const DOMAIN_LABEL: Record<DomainKey, string> = {
  data_gathering: "Data Gathering",
  clinical_management: "Clinical Management",
  relating_to_others: "Relating to Others",
};

export async function loadCaseRules(
  admin: SupabaseClient,
  stationId: string
): Promise<CaseRule[]> {
  const { data } = await admin
    .from("station_case_rules")
    .select("id, name, trigger_question, fires_when, domain, bound, grade, comment_basis, sort_order, active")
    .eq("station_id", stationId)
    .eq("active", true)
    .order("sort_order", { ascending: true })
    .returns<CaseRule[]>();
  return data ?? [];
}

function rank(grade: Grade): number {
  return GRADE_ORDER.indexOf(grade);
}

/**
 * Applies every rule the model fired.
 *
 * Floors are applied before ceilings, so a ceiling always wins a contradiction:
 * if a station has both on one domain the conservative reading is the safe one,
 * and the admin panel flags the pairing as an authoring mistake rather than
 * silently resolving it here.
 *
 * Among ceilings the lowest wins and among floors the highest, which is what
 * "worst wins" means once both directions exist.
 */
export function applyCaseRules(
  grades: Record<DomainKey, Grade | null>,
  answers: CaseRuleAnswer[],
  rules: CaseRule[]
): CaseRulesOutcome {
  const byId = new Map(answers.map((a) => [a.rule, a]));

  const final = { ...grades };
  const comments: Partial<Record<DomainKey, string>> = {};
  const fired: FiredRule[] = [];

  for (const domain of DOMAINS) {
    const before = grades[domain];

    // Fires only on an exact match. A missing answer, a hedge, or anything the
    // model phrased its own way fires nothing: a rule that can force a fail
    // must never act on ambiguity.
    const hits = rules
      .filter((r) => r.domain === domain)
      .map((r) => ({ rule: r, answer: byId.get(r.id) }))
      .filter(({ rule, answer }) => answer?.answer?.trim().toLowerCase() === rule.fires_when);

    if (!hits.length || before === null) continue;

    let grade = before;

    const floors = hits.filter(({ rule }) => rule.bound === "floor");
    if (floors.length) {
      const highest = floors.reduce((a, b) => (rank(a.rule.grade) >= rank(b.rule.grade) ? a : b));
      if (rank(highest.rule.grade) > rank(grade)) grade = highest.rule.grade;
    }

    const ceilings = hits.filter(({ rule }) => rule.bound === "ceiling");
    if (ceilings.length) {
      const lowest = ceilings.reduce((a, b) => (rank(a.rule.grade) <= rank(b.rule.grade) ? a : b));
      if (rank(lowest.rule.grade) < rank(grade)) grade = lowest.rule.grade;
    }

    final[domain] = grade;

    // The comment comes from whichever rule actually set the grade, so the text
    // and the number agree. Rules that fired without moving anything are still
    // recorded, just not quoted at the candidate.
    const decisive =
      hits.find(({ rule }) => rule.grade === grade && rule.bound === "ceiling") ??
      hits.find(({ rule }) => rule.grade === grade && rule.bound === "floor") ??
      hits[0];

    const replacement = decisive.answer?.comment?.trim();
    if (replacement) comments[domain] = replacement;

    for (const { rule } of hits) {
      fired.push({
        id: rule.id,
        name: rule.name,
        domain,
        bound: rule.bound,
        grade: rule.grade,
        before,
        after: grade,
        decisive: rule.id === decisive.rule.id,
      });
    }
  }

  return { final, comments, fired };
}

/** The case-rules half of the grading prompt. */
export function buildCaseRulesPrompt(rules: CaseRule[]): string {
  const list = rules
    .map((r) =>
      [
        `- ${r.id}`,
        `  Question: ${r.trigger_question}`,
        `  If this fires, base the replacement ${DOMAIN_LABEL[r.domain]} comment on: ${r.comment_basis}`,
      ].join("\n")
    )
    .join("\n\n");

  return `
CASE-SPECIFIC CHECKS

These are written by the examiner who set this station. Answer each one yes or
no from the transcript, exactly as asked, and nothing more: what happens to the
grade as a result is decided elsewhere and is not your concern.

Answer only from what the transcript shows. If it does not show enough to
answer, answer no rather than guessing, because these checks carry weight and a
guess is worse than a miss.

${list}

For any check you answer in a way that matters, also write a replacement
comment for its domain, using the basis given above. Three to four sentences,
addressed to the candidate as "you", leading with the point the check makes and
keeping anything else about that domain that is still true.

Where the basis says what the SCA expects, tell the candidate that: it is the
examiner's own knowledge of the exam and is the most useful thing you can pass
on. Never make a claim about what the SCA expects that the basis does not make.
Never quote the transcript, here as anywhere.
`.trim();
}

/**
 * Asks for the rest of the report to be brought into line with a fired rule.
 *
 * Needed because a contradiction cannot be found in code. A quote is string
 * matching and a missing improvement is a null check, but "this comment praises
 * what that comment condemns" is a judgement, and only a model can make it.
 * What code does know, exactly, is when a rule fired — so the call is made only
 * on those runs, and the transcript is not re-sent because the question is
 * about the report, not the consultation.
 */
export function buildAlignmentPrompt(
  fired: FiredRule[],
  rules: CaseRule[],
  texts: Record<string, string>
): string {
  const byId = new Map(rules.map((r) => [r.id, r]));
  const positions = fired
    .map((f) => {
      const rule = byId.get(f.id);
      return `- ${DOMAIN_LABEL[f.domain]}: ${rule?.comment_basis ?? f.name}`;
    })
    .join("\n\n");

  const items = Object.entries(texts)
    .map(([key, text]) => `${key}\n${text}`)
    .join("\n\n");

  return `An examiner's ruling has been applied to this report. These are the positions now taken:

${positions}

Below is the rest of the report, written before that ruling was applied. Some of it may praise or endorse the very thing the ruling marks as wrong.

Rewrite only what contradicts the ruling. Leave anything consistent with it exactly as it is, word for word. Do not soften a criticism that still stands, do not restate the ruling in every entry, and change as little as possible: this is a correction pass, not a rewrite.

Keep each entry's length, its "you" address, and its rating. Never quote the transcript.

${items}

Respond ONLY with valid JSON, no markdown, mapping every key you changed to its new text. Omit keys you left unchanged.
{ "key": "rewritten text" }`;
}

/** The case-rules half of the JSON contract. */
export function buildCaseRulesOutputContract(rules: CaseRule[]): string {
  const ids = rules.map((r) => `"${r.id}"`).join(", ");
  return `  "case_checks": [
    {
      "rule": "one of: ${ids}",
      "answer": "yes | no",
      "comment": "Replacement comment for this check's domain. Required whenever your answer is the one the check is looking for, omitted otherwise."
    }
  ]`;
}
