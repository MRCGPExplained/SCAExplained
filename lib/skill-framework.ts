/**
 * The system-wide consultation-skill framework.
 *
 * Definitions and default domain influences live here, in code, deliberately:
 * a station may add an optional note against a skill, but never redefines what
 * the skill means. That keeps one rubric rather than 246 near-copies, and makes
 * the weighting safe to tune in one place later.
 *
 * Skills assess consultation *process* — things that do not sit cleanly inside
 * a station's data_gathering[] / management[] criteria but should still bear on
 * the three domain grades.
 */

export type SkillRating = "excellent" | "satisfactory" | "needs_improvement" | "not_assessable";

export type DomainKey = "data_gathering" | "clinical_management" | "relating_to_others";

export type Influence =
  | "strong_positive"
  | "moderate_positive"
  | "weak_positive"
  | "neutral"
  | "weak_negative"
  | "moderate_negative"
  | "strong_negative"
  | "not_applicable";

export type Modulation =
  | "strong_positive"
  | "moderate_positive"
  | "neutral"
  | "moderate_negative"
  | "strong_negative";

/**
 * How strongly a skill bears on a domain when it is performed well or badly.
 * "none" means the skill is not relevant to that domain at all.
 */
export type Relevance = "strong" | "moderate" | "weak" | "none";

export interface SkillDefinition {
  id: string;
  label: string;
  /** What the skill assesses. */
  assess: string;
  excellent: string;
  satisfactory: string;
  needsImprovement: string;
  /** Extra guidance that is not a band descriptor. */
  note?: string;
  relevance: Record<DomainKey, Relevance>;
  /**
   * Skills that assess substantially the same underlying behaviour. Used to
   * warn the model against rewarding or penalising one behaviour repeatedly
   * just because it surfaces under several headings.
   */
  family?: string;
}

export const SKILLS: SkillDefinition[] = [
  {
    id: "history_structure",
    label: "History Structure",
    assess:
      "Whether the history progresses logically through relevant areas such as the presenting complaint, associated symptoms, patient perspective, possible causes/differentials, risk factors and impact where applicable, without repeatedly darting between unrelated areas.",
    excellent:
      "The consultation explores relevant areas in a coherent sequence with logical transitions and little unnecessary revisiting.",
    satisfactory:
      "The consultation is broadly structured but occasionally jumps between topics, revisits areas unnecessarily, or explores relevant areas later than ideal.",
    needsImprovement:
      "The history is noticeably fragmented, repetitive, or difficult to follow, impairing effective or efficient information gathering.",
    relevance: { data_gathering: "moderate", clinical_management: "none", relating_to_others: "weak" },
  },
  {
    id: "open_questions_timing",
    label: "Open Questions: Timing",
    assess: "Whether questioning appropriately starts broad and progressively narrows.",
    excellent:
      "Begins important areas of exploration with open questions and progressively moves to focused or closed questions as information emerges.",
    satisfactory:
      "Uses some broad-to-focused questioning but moves to closed or directive questions earlier than necessary at times.",
    needsImprovement:
      "Frequently begins exploration with narrow or closed questions and directs the history before the patient's own account has been adequately established.",
    relevance: { data_gathering: "moderate", clinical_management: "none", relating_to_others: "weak" },
    family: "questioning_style",
  },
  {
    id: "open_questions_use",
    label: "Open Questions: Use",
    assess:
      "Whether the clinician recognises opportunities where an open question would be more effective than a closed question.",
    excellent:
      "Consistently recognises useful opportunities for open exploration, particularly around symptoms, patient concerns, impact and new information.",
    satisfactory:
      "Uses open questions appropriately in some areas but misses some clear opportunities and relies somewhat heavily on closed questioning.",
    needsImprovement:
      "Rarely uses open questions where broader exploration would be useful, resulting in a predominantly clinician-directed consultation.",
    relevance: { data_gathering: "moderate", clinical_management: "none", relating_to_others: "moderate" },
    family: "questioning_style",
  },
  {
    id: "opening_narrative",
    label: "Opening Patient Narrative / Golden Minute",
    assess:
      "Whether the patient is given sufficient early opportunity to establish their story after the opening invitation.",
    excellent:
      "Allows the patient sufficient early space to describe the presenting problem in their own words, intervening mainly to encourage or clarify rather than redirect.",
    satisfactory: "Allows some initial narrative but begins directing the history earlier than necessary.",
    needsImprovement:
      "Rapidly takes control with repeated focused questions and substantially limits the patient's opportunity to establish their story.",
    note:
      "Do not apply a literal 60-second threshold as an absolute rule. Transcript timestamps may be used as supporting evidence.",
    relevance: { data_gathering: "moderate", clinical_management: "none", relating_to_others: "moderate" },
    family: "questioning_style",
  },
  {
    id: "cue_recognition",
    label: "Cue Recognition",
    assess:
      "Whether verbal cues from the patient are noticed and appropriately explored. Cues may include concerns, emotional language, impact statements, uncertainty, hesitation, unexpected disclosures or statements suggesting an unspoken agenda.",
    excellent: "Consistently notices important patient cues and appropriately explores or acknowledges them.",
    satisfactory: "Recognises some cues but misses other reasonable opportunities for exploration.",
    needsImprovement: "Repeatedly overlooks, bypasses or fails to respond to important patient cues.",
    relevance: { data_gathering: "strong", clinical_management: "none", relating_to_others: "strong" },
    family: "questioning_style",
  },
  {
    id: "active_listening",
    label: "Active Listening",
    assess: "Whether the clinician demonstrates that patient information has been heard and incorporated.",
    excellent:
      "Responds to cues, paraphrases or reflects relevant information, links later questions to earlier answers, summarises appropriately, and allows patient information to shape subsequent history or management.",
    satisfactory:
      "Demonstrates listening through some appropriate responses or summaries but inconsistently builds on previous information or misses occasional cues.",
    needsImprovement:
      "Frequently continues through predetermined questioning despite information already provided, unnecessarily repeats questions, or shows little evidence that patient responses shape the consultation.",
    relevance: { data_gathering: "moderate", clinical_management: "none", relating_to_others: "strong" },
    family: "questioning_style",
  },
  {
    id: "time_management",
    label: "Time Management",
    assess:
      "Whether consultation time is allocated effectively, particularly whether enough time remains for meaningful clinical management.",
    excellent:
      "Moves efficiently through information gathering and leaves sufficient time for an unhurried and complete management discussion.",
    satisfactory:
      "Consultation is broadly balanced but one phase is somewhat overlong or management becomes mildly compressed.",
    needsImprovement:
      "Earlier parts consume excessive time, leaving management noticeably rushed, incomplete or absent.",
    note:
      "Clinical management should usually have roughly six minutes available in a standard consultation, but treat this as a guide rather than an automatic rule. Use transcript timestamps where available.",
    relevance: { data_gathering: "weak", clinical_management: "strong", relating_to_others: "none" },
  },
  {
    id: "pcm_ice",
    label: "Patient-Centred Management: ICE",
    assess:
      "Whether previously identified patient Ideas, Concerns and Expectations materially influence management.",
    excellent:
      "Explicitly connects management to relevant patient ideas, concerns or expectations and meaningfully addresses the patient's priorities. Give additional positive consideration when the patient's main concern or expectation is addressed early in management.",
    satisfactory:
      "Addresses some aspects of the patient's perspective but does not consistently integrate them into management.",
    needsImprovement:
      "Patient ideas, concerns or expectations are ignored, inadequately addressed, or management proceeds largely independently of the patient's stated priorities.",
    note: "Do not require a rigid formula, and do not require ICE to always be discussed first.",
    relevance: { data_gathering: "none", clinical_management: "strong", relating_to_others: "moderate" },
  },
  {
    id: "pcm_shared_decision",
    label: "Patient-Centred Management: Shared Decision-Making",
    assess: "Whether the patient is meaningfully involved in decisions.",
    excellent:
      "Explains relevant options or recommendations, elicits patient preferences, checks understanding and practical acceptability, explores willingness, and adapts or confirms the plan collaboratively.",
    satisfactory:
      "Offers some opportunity for agreement or preference and may check understanding, but decision-making remains somewhat clinician-led.",
    needsImprovement:
      "Presents management largely as a fixed plan with little meaningful exploration of preference, understanding, acceptability or willingness.",
    note:
      'A token phrase such as "Does that sound okay?" should not by itself qualify as excellent shared decision-making.',
    relevance: { data_gathering: "none", clinical_management: "strong", relating_to_others: "strong" },
  },
  {
    id: "explanation_quality",
    label: "Explanation Quality",
    assess: "The quality, clarity and patient suitability of explanations.",
    excellent:
      "Provides clear, logically structured, appropriately detailed and jargon-light explanations adapted to the patient, and checks understanding where appropriate.",
    satisfactory:
      "Explanations are generally understandable but may occasionally be rushed, overly technical, insufficiently structured or incompletely checked.",
    needsImprovement:
      "Explanations are confusing, poorly structured, overly technical, incomplete, or leave important misunderstandings unresolved.",
    relevance: { data_gathering: "none", clinical_management: "strong", relating_to_others: "moderate" },
  },
  {
    id: "safety_netting",
    label: "Safety Netting",
    assess:
      "The specificity and usefulness of safety-netting. Consider specific warning symptoms or deterioration, what the patient should do, where they should seek help, level of urgency, relevant timeframe, and follow-up arrangements.",
    excellent:
      "Provides specific and clinically relevant warning features, clear actions, appropriate urgency/location of help and relevant timeframe or follow-up.",
    satisfactory: "Provides useful safety-netting but lacks specificity in one or more areas.",
    needsImprovement: "Safety-netting is absent, generic, vague, or not sufficiently actionable.",
    note: '"Come back if it gets worse" alone should generally be considered weak safety-netting.',
    relevance: { data_gathering: "none", clinical_management: "strong", relating_to_others: "none" },
  },
];

export const SKILL_IDS = SKILLS.map((s) => s.id);

export function skillLabel(id: string): string {
  return SKILLS.find((s) => s.id === id)?.label ?? id;
}

export const RATING_LABEL: Record<SkillRating, string> = {
  excellent: "Excellent",
  satisfactory: "Satisfactory",
  needs_improvement: "Needs Improvement",
  not_assessable: "Not Assessable",
};

const DOMAIN_LABEL: Record<DomainKey, string> = {
  data_gathering: "Data Gathering",
  clinical_management: "Clinical Management",
  relating_to_others: "Relating to Others",
};

/** The stored shape of one skill's assessment. */
export interface SkillAssessment {
  skill: string;
  rating: SkillRating;
  comment: string;
  domain_influences: Partial<Record<DomainKey, Influence>>;
}

export interface SkillsAssessment {
  skills: SkillAssessment[];
  domain_modulation: Record<DomainKey, Modulation>;
}

/**
 * Renders the framework for the grading prompt. Station notes are interleaved
 * with the skill they belong to so the model reads them as context for that
 * skill only, never as a replacement for the definition or as a new checklist.
 */
export function buildSkillFrameworkPrompt(stationNotes: Record<string, string> = {}): string {
  const skillBlocks = SKILLS.map((s) => {
    const relevance = (Object.keys(s.relevance) as DomainKey[])
      .filter((d) => s.relevance[d] !== "none")
      .map((d) => `${DOMAIN_LABEL[d]}: ${s.relevance[d]} relevance`)
      .join("; ");

    const note = stationNotes[s.id]?.trim();

    return [
      `### ${s.label}  (id: ${s.id})`,
      `Assess: ${s.assess}`,
      `Excellent: ${s.excellent}`,
      `Satisfactory: ${s.satisfactory}`,
      `Needs Improvement: ${s.needsImprovement}`,
      s.note ? `Guidance: ${s.note}` : null,
      `Domain relevance: ${relevance || "none"}`,
      note
        ? `Case-specific note for THIS station (additional context for this skill only — it does not replace the definition above, and is not a mandatory checklist item unless it says so): ${note}`
        : null,
    ]
      .filter(Boolean)
      .join("\n");
  }).join("\n\n");

  const families = SKILLS.filter((s) => s.family).map((s) => s.label);

  return `
SKILLS ASSESSMENT

Assess the consultation-process skills below from the transcript, then use them
as a secondary influence on the three domain grades.

Order of reasoning — follow it in this order:
1. Grade each domain from the station's own criteria and the transcript, exactly
   as you would without this section. These are your BASELINE grades.
2. Rate each skill below, with a concise comment citing what the transcript
   actually shows.
3. For each skill, judge its influence on each domain it is relevant to, using:
   strong_positive, moderate_positive, weak_positive, neutral, weak_negative,
   moderate_negative, strong_negative, not_applicable.
4. Consider the whole pattern of skill findings and produce ONE aggregate
   modulation per domain: strong_positive, moderate_positive, neutral,
   moderate_negative or strong_negative.
5. Apply that modulation to the baseline to produce the FINAL domain grades.

Ratings: excellent, satisfactory, needs_improvement, or not_assessable when the
transcript genuinely does not show enough to judge. Never invent a behaviour to
fill a skill in — not_assessable is the correct answer when evidence is absent.

Writing the skill comments — the candidate reads these, so address them
directly as "you". Never write "the candidate", "the doctor" or "the clinician".
Write exactly two sentences, and shape them to the rating:
- excellent: say what you did well and why it was effective.
- satisfactory: acknowledge what you did well, then give one concrete idea to
  do it better.
- needs_improvement: say what was missing or went wrong, then give one concrete
  idea to do it differently next time.
- not_assessable: say briefly that the transcript does not show enough to judge
  this, and what would have demonstrated it.
Ground every comment in what the transcript actually shows, quoting or closely
paraphrasing where it helps. Never use em dashes; use a comma or rewrite.

Aggregating:
- This is not a majority vote. One materially important negative finding may
  outweigh several weak positives.
- These skills overlap: ${families.join(", ")}. They often reflect the same
  underlying behaviour, so do not reward or penalise that behaviour repeatedly
  just because it appears under several headings. Equally, do not apply a hard
  cap — genuinely distinct strengths across several behaviours should aggregate
  into stronger modulation than isolated excellence.

Applying modulation:
- The station's own criteria remain the primary basis for the grade. Skills
  apply pressure to a borderline grade; they do not recompute it.
- Modulation should normally move a domain by no more than one band.
- Excellent consultation style must not rescue a major clinical omission or
  unsafe management. One weak skill must not by itself downgrade clearly
  excellent domain performance.
- Every final grade must remain defensible from the transcript alone.

SKILL DEFINITIONS

${skillBlocks}
`.trim();
}

/** The JSON fragment describing the skills part of the response contract. */
export const SKILLS_OUTPUT_CONTRACT = `
  "baseline_data_gathering": "P",
  "baseline_clinical_management": "F",
  "baseline_relating_to_others": "CP",
  "skills_assessment": {
    "skills": [
      {
        "skill": "history_structure",
        "rating": "excellent",
        "comment": "Two sentences, addressed to the candidate as \\"you\\", shaped to the rating.",
        "domain_influences": {
          "data_gathering": "moderate_positive",
          "clinical_management": "not_applicable",
          "relating_to_others": "weak_positive"
        }
      }
    ],
    "domain_modulation": {
      "data_gathering": "moderate_positive",
      "clinical_management": "neutral",
      "relating_to_others": "moderate_positive"
    }
  }`.trim();
