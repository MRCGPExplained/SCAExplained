/**
 * The tick-box phrases under each Did Well / Could Improve box.
 *
 * WHERE THESE CAME FROM. Not invented, and not "trends" either — there are
 * seven GP-written reviews in the database, which is too few to call anything
 * a pattern. What they are is the recurring content of those seven, read in
 * full, in the examiner's own words wherever a usable sentence already
 * existed. The overall comments are where that voice lives; the per-domain
 * comments on the same rows are model-written and much more uniform, so they
 * were not used as a source of phrasing.
 *
 * Traceable examples, so a later reader can check rather than trust:
 *   - "Try to ask ICE earlier" is station 72, almost verbatim.
 *   - "examiners cannot score what you do not say" is station 69, verbatim.
 *   - "Answer the question behind the question" is station 73.
 *   - "Allowed the patient their golden minute" is station 73.
 *   - "Don't forget SOCRATES" is station 73's closing list.
 *   - The shared-decision-making one is station 72's "instead of saying it's
 *     best to delay the trip, consider making it a question instead".
 *
 * A handful fill obvious gaps the seven reviews happen not to cover — a
 * working diagnosis being given, understanding being checked. Those are RCGP
 * convention rather than evidence from this data, and they are the ones most
 * worth editing first.
 *
 * GROUPED THE EXAMINER'S WAY, NOT THE GRADER'S. Open questions, the golden
 * minute, ICE and cues sit under Data Gathering here. `grading_skills` files
 * all four under relating_to_others, and has nothing at all under clinical
 * management. That disagreement is real and worth resolving, but a tick list
 * has to match the box it sits under, so it follows the box.
 *
 * These are DEFAULTS. The live list is whatever is in site_settings; this is
 * only what a field falls back to before anyone has edited it.
 */

export type PresetField =
  | "dg_well"
  | "dg_improve"
  | "cm_well"
  | "cm_improve"
  | "ro_well"
  | "ro_improve";

export const PRESET_FIELDS: PresetField[] = [
  "dg_well",
  "dg_improve",
  "cm_well",
  "cm_improve",
  "ro_well",
  "ro_improve",
];

export interface ExaminerPreset {
  /** Stable across edits and reorders, so a tick survives both. */
  id: string;
  text: string;
}

/**
 * Did Well reads as a verb — what the candidate DID.
 * Could Improve reads as a recommendation — what to try NEXT time.
 *
 * Kept that way deliberately. A Did Well phrased as a judgement ("good
 * history") says nothing a grade does not already say; the verb is the part
 * a candidate can repeat. A Could Improve phrased as a criticism leaves them
 * with a fault and no instruction.
 */
export const DEFAULT_PRESETS: Record<PresetField, string[]> = {
  dg_well: [
    "Asked open questions before moving on to closed questions",
    "Allowed the patient their golden minute",
    "Elicited ICE early in the consultation",
    "Picked up a cue and followed through on it",
    "Asked about impact on function and daily life",
    "Screened for the relevant red flags",
    "Tailored later questions to what the patient volunteered early",
    "Took a structured, systematic history",
  ],
  dg_improve: [
    "Try to ask ICE earlier",
    "Try to dig deeper into a cue rather than just acknowledging it",
    "Don't forget SOCRATES when there is pain",
    "Screen briefly for red flags rather than assuming the cause",
    "Ask why specifically they are worried, not only what about",
    "Ask about all medication, including anything over the counter",
    "Recap the past history briefly rather than covering all of it",
    "Let the patient tell their story before narrowing down",
  ],
  cm_well: [
    "Gave a clear working diagnosis",
    "Answered the patient's concern directly before explaining the plan",
    "Safety netted specifically for this presentation",
    "Troubleshot the actual problem before changing the plan",
    "Involved the patient in choosing between options",
    "Explained the plan in plain language",
    "Arranged follow-up and said so out loud",
    "Found a workable alternative when the first option was not possible",
  ],
  cm_improve: [
    "Address their ICE explicitly: say what you have ruled out, and why",
    "Verbalise the follow-up plan, as examiners cannot score what you do not say",
    "Make the safety net specific to this presentation",
    "Mention side effects and contraindications when starting a new medication",
    "Commit to a working diagnosis rather than leaving it open",
    "Chunk and check rather than giving the plan in one block",
    "Avoid medical jargon when explaining",
    "Offer a leaflet or a written summary where it would help",
  ],
  ro_well: [
    "Built good rapport and put the patient at ease",
    "Empathised with their worry early",
    "Made good use of the records",
    "Involved the patient in the decision",
    "Paced the consultation well",
    "Kept the consultation patient-centred rather than doctor-centred",
    "Checked the patient's understanding",
    "Commended the patient's own reasoning",
  ],
  ro_improve: [
    "Offer the plan as a question rather than a statement, so shared decision making is obvious",
    "Answer the question behind the question",
    "Check understanding at the end of the management discussion",
    "Bring their ICE back in at the end for closure",
    "Respond to the emotional weight before moving on to logistics",
    "Watch the pace at the end so the close is not rushed",
    "Negotiate the plan rather than announcing it",
    "Give the patient a steer when they say they have no preference",
  ],
};

/** The heading above each list, and the box it belongs to. */
export const FIELD_LABEL: Record<PresetField, string> = {
  dg_well: "Data Gathering — Did Well",
  dg_improve: "Data Gathering — Could Improve",
  cm_well: "Clinical Management — Did Well",
  cm_improve: "Clinical Management — Could Improve",
  ro_well: "Relating to Others — Did Well",
  ro_improve: "Relating to Others — Could Improve",
};

/** The site_settings key the live list is stored under. */
export const PRESETS_SETTING_KEY = "examiner_presets";

/**
 * Ids are derived from the text rather than random, so the defaults are the
 * same on every machine and a tick made before anyone edited the list still
 * resolves afterwards. Once a preset is saved its id is fixed and editing the
 * text does not move it.
 */
export function presetId(field: PresetField, text: string): string {
  const slug = text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
  return `${field}:${slug}`;
}

export function defaultPresetsFor(field: PresetField): ExaminerPreset[] {
  return DEFAULT_PRESETS[field].map((text) => ({ id: presetId(field, text), text }));
}
