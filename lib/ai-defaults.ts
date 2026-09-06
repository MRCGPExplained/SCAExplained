/**
 * The grading prompt is deliberately split in two.
 *
 * DEFAULT_GRADING_GUIDANCE is the philosophy: what the bands mean, how strict
 * to be, how to write comments. An admin can replace this wholesale from API
 * Settings.
 *
 * The output contract (buildOutputContract) is built separately and is ALWAYS
 * sent. It is what the app parses the reply with, so if a custom prompt could
 * replace it, saving one would silently stop every consultation being graded.
 * Keeping it out of the editable half makes that impossible.
 */
export const DEFAULT_GRADING_GUIDANCE = `You are an experienced RCGP examiner assessing a GP registrar's SCA consultation.

CRITICAL — never fabricate. Grade and comment using ONLY what is explicitly present in the transcript. Do not infer, assume, guess, or describe any action, dialogue, tone, empathy, or clinical reasoning that the transcript does not literally show, even if it seems like the kind of thing a competent registrar "would probably" have done. The candidate is judged solely on what they are recorded saying, nothing else.

USING THE CASE DETAILS. You are given the station's case details (what the case is designed to test, the patient's history, medications, ideas/concerns/expectations, and information the role-player would reveal if asked). These are context to help you understand the consultation, NOT a checklist to tick off. Credit the candidate when relevant information is elicited or a concern is addressed during the consultation, however it comes up, including when the candidate raises it proactively. Do not penalise the candidate for a question the patient never posed, or for a detail the patient never volunteered. Judge the competency the candidate actually demonstrates, not the exact sequence of who asked what. The one exception is safety: if the transcript shows management that is unsafe given the patient's known medications, allergies, or past medical history, that lowers Clinical Management even if the patient never flagged the risk themselves.

If a domain has no relevant evidence in the transcript — because it was never addressed, or the audio was too unclear, brief, or inaudible to capture it — grade that domain CF and say so plainly and directly in the comment (e.g. "There is no evidence in the transcript that ICE was explored"). Do not invent a moment to praise and do not credit the candidate for something you cannot point to them actually saying.

Grade each domain using the official RCGP scale:
- CF (Clear Fail): Major safety concern, significant gaps, or no evidence of this domain being addressed at all. Patient potentially harmed.
- F (Fail): Below expected standard. Important elements missing but no immediate safety risk.
- P (Pass): Meets expected standard for a GP registrar at this stage.
- CP (Clear Pass): Clearly exceeds expected standard. Exceptional consultation.

Points per domain: Data Gathering & Diagnosis = 3pts max (CF=0, F=1, P=2, CP=3). Clinical Management = 4.5pts max (CF=0, F=1.5, P=3, CP=4.5). Relating to Others = 3pts max (CF=0, F=1, P=2, CP=3).

For every domain, write exactly 3 sentences of feedback regardless of grade. Keep them tight — around 60 words per domain, and never more than 80. Sentences should be readable, not dense clause-stacked lists of every detail you noticed; pick the points that matter most and leave the rest out:
- CF from missing evidence: state directly that the transcript shows no evidence of this domain, and what a registrar would need to have said or done to demonstrate it.
- CF/F from an identified gap or safety issue: focus on what was missing or unsafe, with specific reference to a moment in the transcript.
- P: acknowledge what was done well and name one specific area to develop further, pointing to a real moment in the consultation.
- CP: acknowledge the exceptional element and note one refinement that would make it even stronger, pointing to a real moment in the consultation.

Never quote the transcript. Describe the moment in your own words instead: write "when you asked what she thought was causing it" rather than reproducing the words inside quotation marks. The transcript is a machine transcription of speech, so it carries filler and mis-heard words, and quoting it puts sentences in the candidate's mouth that they did not say. Describing keeps the feedback anchored to something that genuinely happened without misquoting anyone. There is one place quotation marks belong: a phrase you are offering the candidate for next time, which is wording you are suggesting rather than wording anyone used.

Reference only moments that are actually in the transcript, never what you would expect a good registrar to have said. Never leave a comment empty. Never use em dashes (—); use a comma or rewrite the sentence instead.

FOCUS FOR NEXT TIME. After the domain comments, write a single "focus for next time" of one or two sentences naming the most valuable next step for this candidate, grounded in what the transcript actually shows. Usually there is something to improve, so name the highest-impact thing (a real gap, a safety issue, or the weakest domain) and what they should do differently. Only when the consultation was genuinely strong across the board with nothing significant to develop, name the key strength to maintain instead (e.g. "Maintain the clear, structured safety-netting you gave here"). Never invent a weakness to fill this line, and never leave it empty.
`;

/**
 * The machine contract. Always appended to whatever guidance is in force, so a
 * custom admin prompt can change how Claude grades but never how it replies.
 */
/**
 * The response shape, enforced at generation rather than hoped for.
 *
 * A grading run failed three times in one evening with a complete, naturally
 * terminated response that would not parse: 15,434 characters, a proper closing
 * brace, and an unescaped character somewhere in the middle. The model had
 * quoted the transcript, and a stray quote mark or line break inside a JSON
 * string costs the entire grading, not a tidy sentence.
 *
 * Every property is required and empty strings are allowed rather than fields
 * being optional, because structured output wants a closed shape. "Not
 * applicable" is therefore an empty string, which the code that reads these
 * already treats as absent.
 */
export function buildOutputSchema(
  skillKeys: string[],
  ruleIds: string[]
): Record<string, unknown> {
  const grade = { type: "string", enum: ["CF", "F", "P", "CP"] };

  const properties: Record<string, unknown> = {
    data_gathering: grade,
    clinical_management: grade,
    relating_to_others: grade,
    comment_data_gathering: { type: "string" },
    comment_clinical_management: { type: "string" },
    comment_relating_to_others: { type: "string" },
    focus_for_next_time: { type: "string" },
  };
  const required = Object.keys(properties);

  if (ruleIds.length) {
    properties.case_checks = {
      type: "array",
      items: {
        type: "object",
        // Property order is load-bearing, not cosmetic: the model generates
        // left to right, so a finding written before the answer is a sentence
        // the answer then has to agree with.
        properties: {
          rule: { type: "string", enum: ruleIds },
          finding: { type: "string" },
          answer: { type: "string", enum: ["yes", "no"] },
          comment: { type: "string" },
        },
        required: ["rule", "finding", "answer", "comment"],
        additionalProperties: false,
      },
    };
    required.push("case_checks");
  }

  if (skillKeys.length) {
    properties.skills_assessment = {
      type: "object",
      properties: {
        skills: {
          type: "array",
          items: {
            type: "object",
            properties: {
              skill: { type: "string", enum: skillKeys },
              rating: { type: "string", enum: ["good", "needs_improvement", "not_assessable"] },
              improvement: { type: "string" },
              comment: { type: "string" },
            },
            required: ["skill", "rating", "improvement", "comment"],
            additionalProperties: false,
          },
        },
      },
      required: ["skills"],
      additionalProperties: false,
    };
    required.push("skills_assessment");
  }

  return { type: "object", properties, required, additionalProperties: false };
}

export function buildOutputContract(
  skillsContract: string | null,
  caseChecksContract: string | null = null
): string {
  const core = `  "data_gathering": "P",
  "clinical_management": "F",
  "relating_to_others": "CP",
  "comment_data_gathering": "Three sentence comment here.",
  "comment_clinical_management": "Three sentence comment here.",
  "comment_relating_to_others": "Three sentence comment here.",
  "focus_for_next_time": "One or two sentence next step here."`;

  // Case checks come first on purpose. Generation is sequential, so what the
  // model commits to early constrains what it writes afterwards: with the
  // checks last, it wrote every skill comment from its own view and only then
  // conceded the point, leaving one report praising what another part of it
  // condemned. Answering first is what makes the consistency rule below
  // something it can actually follow.
  const sections = [caseChecksContract, core, skillsContract].filter(Boolean).join(",\n");

  if (!skillsContract && !caseChecksContract) {
    return `Respond ONLY with valid JSON — no markdown, no explanation:
{
${core}
}`;
  }

  const notes = [
    "Grade the three domains from the station's criteria and the transcript.",
    skillsContract
      ? "Do not adjust them to reflect the skill answers: that adjustment is applied separately and is not your job. Include exactly one entry per skill listed above."
      : null,
    caseChecksContract
      ? "Nor to reflect the case-specific checks: answer those as asked and leave the consequences alone. Include exactly one entry per check listed above. Answer them FIRST, then write everything else consistently with the position they take: where a check identifies something as wrong, no later comment may call that same thing correct, appropriate, or well handled. One report must not argue with itself."
      : null,
  ]
    .filter(Boolean)
    .join(" ");

  return `Respond ONLY with valid JSON — no markdown, no explanation.

${notes}

{
${sections}
}`;
}
