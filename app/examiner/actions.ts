"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase-case-bank";
import { getExaminer } from "@/lib/examiner-auth";
import { getSupabaseAdmin } from "@/lib/supabase";
import { tidyExaminerComment, withoutEmDashes } from "@/lib/prose";
import { gpRequested, type GpColumns } from "@/lib/recording-state";
import { sendExaminerReportEmail } from "@/lib/email";
import { doctorPossessive, printableName } from "@/lib/doctor-name";
import { MAX_PRESETS_PER_FIELD, MAX_PRESET_LENGTH, savePresetField } from "@/lib/examiner-presets-store";
import { PRESET_FIELDS, type DomainHalfNotes, type ExaminerPreset, type PresetField } from "@/lib/examiner-presets";
import { getCurrentPricing, claudeCostUsd, usdToGbp } from "@/lib/pricing";
import { snapshotGpReview } from "@/lib/consultation-costs";

const EXAMINER_CLAUDE_MODEL = "claude-haiku-4-5-20251001";

/*
  The smallest gap between two Resend requests from this action.

  Resend's default allowance is two requests a second, and the SDK carries no
  retry of its own — `rate_limit_exceeded` is returned as an ordinary failure
  and the email is simply gone. 550ms keeps a whole roomful under that with
  room to spare. A consultation is at most a handful of emails, so the cost is
  a second or so on the Send button; app/api/cron/nudge sends serially for the
  same reason.
*/
const SEND_GAP_MS = 550;

// Records the token usage + cost of an examiner-initiated Claude call.
// Best-effort: never blocks the examiner's action.
async function recordExaminerClaudeUsage(
  callType: "overall_comment" | "grammar_check" | "autofill_ticked",
  model: string,
  usage: {
    input_tokens?: number;
    output_tokens?: number;
    cache_creation_input_tokens?: number;
    cache_read_input_tokens?: number;
  },
  recordingId?: string
): Promise<void> {
  try {
    const admin = getSupabaseAdmin();
    if (!admin) return;
    const pricing = await getCurrentPricing(admin);
    if (!pricing) return;
    const tokens = {
      input_tokens: usage.input_tokens ?? 0,
      output_tokens: usage.output_tokens ?? 0,
      cache_creation_tokens: usage.cache_creation_input_tokens ?? 0,
      cache_read_tokens: usage.cache_read_input_tokens ?? 0,
    };
    const costUsd = claudeCostUsd(tokens, pricing);
    await admin.from("claude_usage").insert({
      recording_id: recordingId ?? null,
      call_type: callType,
      model,
      input_tokens: tokens.input_tokens,
      output_tokens: tokens.output_tokens,
      cache_creation_tokens: tokens.cache_creation_tokens,
      cache_read_tokens: tokens.cache_read_tokens,
      cost_usd: costUsd,
      cost_gbp: usdToGbp(costUsd, pricing),
      pricing_version_id: pricing.id,
    });
  } catch (e) {
    console.error("[examiner] failed to record Claude usage:", e);
  }
}

/**
 * A half as it arrives over the wire, made safe to read.
 *
 * This is a server action, so the argument is whatever was POSTed, not
 * whatever the client component believes it sent. Two cases are real rather
 * than theoretical: a browser tab left open across a deploy still holds the
 * old client and sends the six halves as plain strings, and anything else
 * that can reach a server action can send nothing at all. Neither should
 * reach the prompt builder as undefined.
 *
 * The string branch is a genuine fallback, not defensive clutter: it keeps a
 * stale tab working, with every line treated as hand-typed, which is the
 * safe way round. Mistaking a typed line for a curated phrase would protect
 * it from the grammar pass it needs; mistaking a curated phrase for a typed
 * line only exposes it to an edit the no-rephrasing rule still forbids.
 */
function asHalf(value: unknown): DomainHalfNotes {
  if (typeof value === "string") {
    return { ticked: [], typed: value.split("\n").map((l) => l.trim()).filter(Boolean) };
  }
  if (!value || typeof value !== "object") return { ticked: [], typed: [] };
  const half = value as Partial<DomainHalfNotes>;
  return {
    ticked: Array.isArray(half.ticked)
      ? half.ticked
          .filter((t): t is { phrase: string; note: string } =>
            !!t && typeof t.phrase === "string" && t.phrase.trim() !== "")
          .map((t) => ({
            phrase: t.phrase.trim(),
            note: typeof t.note === "string" ? t.note.trim() : "",
          }))
      : [],
    typed: Array.isArray(half.typed)
      ? half.typed.map((l) => String(l).trim()).filter(Boolean)
      : [],
  };
}

function halfHasNotes(half: DomainHalfNotes): boolean {
  return half.ticked.length > 0 || half.typed.length > 0;
}

/**
 * One half of a domain — the examiner's observations, one per line, each
 * marked with where it came from.
 *
 * The markers are the point. A curated phrase and a line typed while
 * listening need opposite handling, and the editor cannot tell them apart
 * from the words alone — both are short, both are in the imperative or the
 * past tense, and the typed one is often the better written of the two.
 *
 * A phrase's own note is labelled rather than punctuated off. It was "X :: Y"
 * first, and Y went missing: measured twice on the same input, a typed
 * "really nicely done" was discarded and an invented "- also good" put in its
 * place. A bare separator reads as annotation, and annotation is droppable.
 * Spelling out whose words they are is what stopped it.
 *
 * Not a dash either way. The hyphen is load-bearing in this examiner's prose
 * and an em dash is scrubbed from the output, so neither can be spared as a
 * separator without muddling what the model is being shown.
 */
function noteList(label: string, half: DomainHalfNotes): string {
  const lines = [
    ...half.ticked.map((t) =>
      t.note ? `[phrase] ${t.phrase} [examiner wrote: ${t.note}]` : `[phrase] ${t.phrase}`),
    ...half.typed.map((l) => `[typed] ${l}`),
  ];
  if (lines.length === 0) return "";
  return `  ${label}:\n` + lines.map((l) => `    ${l}\n`).join("");
}

/**
 * One domain's block of the prompt.
 *
 * A domain with nothing typed says so rather than presenting two empty
 * labels. "Did well:" followed by nothing reads to the model as an examiner
 * who found nothing good to say, which is a different claim from an examiner
 * who did not write about that domain.
 */
function domainNotes(label: string, well: DomainHalfNotes, improve: DomainHalfNotes): string {
  const w = noteList("Did well", well);
  const i = noteList("Could improve", improve);
  if (!w && !i) return `${label}: no notes written.\n`;
  return `${label}:\n` + w + i;
}

/**
 * Draft an overall comment from notes the examiner types for this purpose.
 *
 * The six note fields are the only input. Two things it deliberately does not
 * see:
 *
 *   - The three saved domain comments. Handing it those made it a summariser
 *     of text the candidate was already going to read, so the overall comment
 *     came back as the same three points in a different order. These notes are
 *     written separately and are not stored anywhere; they exist to say what
 *     the summary should be about.
 *
 *   - The grades. Brandon's call, and the reasoning is sound: a model told
 *     "Clear Fail" writes to that label rather than to what the examiner
 *     observed, and softens or hardens prose the examiner never asked it to.
 *     The examiner writes what they mean in the notes, and the tone follows
 *     from that.
 *
 * The station title stays. It is the name of the case, not a judgement on it,
 * and it keeps the draft from misreading what the consultation was about.
 *
 * WHY THE PROMPT LOOKS THE WAY IT DOES. It is not a style invented here. The
 * three reviews Brandon has written by hand — stations 72, 73 and 83, which
 * is the entire corpus, 1,265 words — were classified clause by clause, and
 * the shape below is what that found:
 *
 *   - Credits put the candidate in the subject slot about three quarters of
 *     the time, but the praise itself almost never does. The action is second
 *     person and past tense, then an impersonal tag carries the verdict:
 *     "which was good", "- excellent", "well done". Four interchangeable
 *     forms of one move.
 *   - Criticisms drop the candidate from the subject slot: 22% against 75%.
 *     What fills the gap is the bare imperative, not the skill as a noun.
 *     "Don't forget SOCRATES", not "SOCRATES was forgotten".
 *   - The hyphen does two opposite jobs. After a credit it carries praise, six
 *     times out of six. Before an improvement it is a label, four times out of
 *     four. It never once carries a negative impression. Hence the rule
 *     forbidding an appraisal tag after a criticism: a prompt told only
 *     "sometimes add an impression after a hyphen" would write "- not great".
 *
 * The preset lists then turn out to be written in exactly those two
 * registers, which is most of why this can afford to add so little: all 24
 * Did well phrases are subjectless past-tense verb phrases, and all 24 Could
 * improve phrases are bare imperatives. A ticked phrase is already most of a
 * sentence in his voice, and "You" plus a tag is the rest of it.
 *
 * ONE THING IT CANNOT PRODUCE. Every one of the three reports closes by
 * naming what would change the grade ("With the right diagnosis and
 * management this would be a pass"). That needs the grades, which this
 * deliberately does not receive, per the second point above. The closing line
 * stays the examiner's to type, and the prompt is told not to attempt it
 * rather than left to guess at it.
 */
export async function generateOverallCommentAction(args: {
  dgWell: DomainHalfNotes; dgImprove: DomainHalfNotes;
  cmWell: DomainHalfNotes; cmImprove: DomainHalfNotes;
  roWell: DomainHalfNotes; roImprove: DomainHalfNotes;
  stationTitle: string;
  recordingId?: string;
}): Promise<{ text?: string; error?: string }> {
  const examiner = await getExaminer();
  if (!examiner) return { error: "Not authorised." };

  const dgWell = asHalf(args.dgWell);
  const dgImprove = asHalf(args.dgImprove);
  const cmWell = asHalf(args.cmWell);
  const cmImprove = asHalf(args.cmImprove);
  const roWell = asHalf(args.roWell);
  const roImprove = asHalf(args.roImprove);

  /*
    Nothing to copy-edit, as grammarCheckAction already says of itself.

    The client will not offer the button on empty notes, but the client is
    not the only thing that can call this, and what it costs to be wrong is
    specific: domainNotes writes "no notes written" three times, a billed
    call goes out on a prompt that is just the station title, and whatever
    comes back replaces the examiner's overall comment.
  */
  const anyNotes = [dgWell, dgImprove, cmWell, cmImprove, roWell, roImprove].some(halfHasNotes);
  if (!anyNotes) return { error: "No notes to convert." };

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": process.env.ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: EXAMINER_CLAUDE_MODEL,
      /*
        300 was enough while this wrote a 3-5 sentence summary of its own. It
        now carries the examiner's six notes through largely intact, so the
        ceiling has to clear what they might type rather than what a summary
        would run to.

        600 was NOT that ceiling, and the three reviews Brandon has written by
        hand say so: 315, 505 and 445 words, so the longest is around 670
        tokens before the headings and the appraisal tags this now adds. 600
        would have truncated his own median report. Truncation here is not a
        shorter comment, it is a comment that stops mid-sentence and replaces
        the examiner's draft with the fragment.

        1500 is far above anything measured. Output is billed per token
        generated, not per token allowed, so the headroom costs nothing, and
        a ceiling set just above the longest thing seen so far is how this
        one came to be too low in the first place.
      */
      max_tokens: 1500,
      /*
        Low, because the job is to keep somebody's words rather than to find
        better ones. Unset, the API defaults to 1.0, which is the setting
        least likely to leave a sentence alone — it was the right default
        while this was writing prose from grades, and the wrong one now.
      */
      temperature: 0.2,
      /*
        A copy editor, not a writer.

        Every instruction here that sounds redundant is a thing the model did
        on a real test run and must not do: it explained why a missed question
        mattered, it called an action "appropriate", and from the single note
        "fluid advice was right but you never quantified intake" it invented
        "Ensure you specify the volume of fluid replacement needed when
        managing gastroenteritis" — clinical advice no examiner wrote, going
        out under an examiner's name. Naming the failures is what stopped them.
      */
      system: [
        "You are copy-editing an RCGP examiner's notes into the overall comment a GP registrar will read.",
        "",
        "HOW THE NOTES ARRIVE. Each domain has a Did well half and a Could improve half, one observation per line.",
        "A line marked [phrase] is wording the examiner curated in advance and ticked for this consultation. Reproduce it word for word. Do not reword it, do not shorten it, do not improve it.",
        "That includes the first word. Do not prepend anything to a [phrase] line to make it read in parallel with another one: \"Ask about all medication\" stays \"Ask about all medication\", never \"Try to ask about all medication\", however the lines around it begin.",
        "Where a [phrase] line ends with \"[examiner wrote: ...]\", those are the examiner's own words about this candidate. They must appear in the comment. Never discard them and never replace them with wording of your own.",
        "A line marked [typed] was written at speed while listening. This is where spelling, grammar, agreement and the joins between fragments need the work.",
        "",
        "SHAPE. One section per domain that has notes. Open each with its heading on its own line, as plain text, in capitals, followed by a colon, exactly: \"DATA GATHERING:\", \"CLINICAL MANAGEMENT:\", \"RELATING TO OTHERS:\". Those three strings and no others. The first sentence begins on the line directly below the heading, with no blank line between them. One blank line between sections. Write nothing at all about a domain with no notes, not even its heading.",
        "Within a section, the Did well material and the Could improve material are two separate paragraphs with a blank line between them, in that order. Never run the credit and the criticism together in one paragraph. Where a section has only one of the two halves, it has only one paragraph.",
        "",
        "DID WELL. Name the action in the second person, then appraise it impersonally. That order is the house style and it does not vary.",
        "The ticked phrases are already past-tense verb phrases with no subject, so putting \"You\" in front is the whole job: \"Allowed the patient their golden minute\" becomes \"You allowed the patient their golden minute\".",
        "The appraisal is a short tag attached to the same sentence, never a sentence of its own. Where the phrase carries \"[examiner wrote: ...]\", those words ARE its appraisal: \"Allowed the patient their golden minute [examiner wrote: really nicely done]\" becomes \"You allowed the patient their golden minute, really nicely done.\" Where the phrase carries nothing, choose from exactly these: which was good, which was really good, which is good, excellent, also good, well done, very well handled.",
        "VARY THE TAG. Never use the same one twice in a row, and never give every credit in a section the same tag. This examiner alternates between these forms, and a comment that appraises eight things in a row as \"which was good\" does not read like him.",
        "Two ways to attach it, and the split is not optional. Most credits take a comma: \"You screened for the relevant red flags, which was good.\" Then count the credits in the section: where there are two or more, EXACTLY ONE of them instead takes a space, a hyphen and a space, lower case after it: \"You asked about hydration and activity - also good.\" One per such section, not none and not two. A section with a single credit uses the comma.",
        "Give the hyphen to a credit the examiner typed no appraisal against. Their own words are never dropped or replaced to make room for it, and if every credit in the section carries their wording then that section has no hyphen.",
        "Where there is no specific action to report and the note is only praise, leave it as the examiner wrote it, including as a fragment: \"Really good rapport.\" stays that way.",
        "",
        "COULD IMPROVE. Keep the candidate out of the subject position when naming what was missed.",
        "The ticked phrases here are already instructions, and they stay instructions: \"Try to ask ICE earlier\" stays \"Try to ask ICE earlier\". Do not convert one into \"You should have asked ICE earlier\" or \"You did not ask ICE early enough\".",
        "Where the examiner's note ties a fix to a moment in this consultation, put the moment first and then \"you could\": \"When the patient said they did not know which to do, you could say that both options would work and ask if they have a preference.\"",
        "Never attach an appraisal tag to a criticism. A hyphen in front of an improvement is a label, not an appraisal, and it appears only where the examiner wrote one.",
        "",
        "CLOSING. After the last domain section, a blank line, then \"FINAL WORD:\" on its own line.",
        "Directly under it, up to three lines, each starting with a hyphen and NO space after the hyphen, which is how this examiner writes them: \"-Don't forget SOCRATES\".",
        "Each line is one thing to take away, and every one of them comes from the Could improve notes. Never from the Did well notes. Never a point that is not in the notes at all.",
        "Choose the three that matter most for this candidate. Three distinct points, not one point worded three ways. Where the notes hold fewer than three improvements, write one line each and no more.",
        "Where the notes hold no improvements at all, there is no FINAL WORD at all: drop the heading with the lines, and close with the sign-off on its own after a blank line. A heading standing over nothing is worse than no heading.",
        "A line drawn from a [phrase] stays word for word. A line drawn from a [typed] note may be tightened to the length of a bullet, in the examiner's own words.",
        "Then a blank line, then the sign-off on its own line, which is exactly \"Overall well done.\" Never name or address the candidate in it: you are not told who they are, and the examiner adds a name themselves if they want one.",
        "Nothing else belongs in the closing. No sentence introducing the list, no summary of the consultation, no judgement on how it went overall, and nothing about the grade, the score, the pass mark or whether it passed. You are not told those and must not infer them. The examiner adds that themselves if they want it.",
        "",
        "ADD NOTHING AT ALL:",
        "- No explanation of why a point matters.",
        "- No advice or recommendation the examiner did not write.",
        "- No clinical content of any kind. Not a drug, a dose, a test, a timescale, a red flag or a diagnosis that is not already in the notes.",
        "- No verdict beyond the Did well appraisal tag above. Nothing about the grade, the score, or whether the consultation passed.",
        "- No praise, softening or encouragement that is not in the notes.",
        "",
        "Do not rephrase a criticism into something gentler. If the note says a thing was missed, the comment says it was missed.",
        "",
        "Do not swap a word for a synonym. If the note says the referral was \"right\", the comment says it was right, not that it was appropriate. Leave abbreviations exactly as written: \"ICE\" stays \"ICE\", \"2ww\" stays \"2ww\".",
        "",
        "KEEP EVERY OBSERVATION. Each line in the notes appears in the comment. Do not drop one as redundant and do not merge two of them into a single point.",
        "",
        "Do not shorten or split a long sentence. This examiner writes long sentences and they are his. Fix what is wrong inside one and leave its length alone. A note that is already a clean sentence comes through unchanged.",
        "",
        "Addressed to the candidate as \"you\". No em dashes anywhere. No bullet points anywhere except the FINAL WORD lines described above.",
      ].join("\n"),
      messages: [{
        role: "user",
        content: `Station: ${args.stationTitle}

${domainNotes("Data Gathering", dgWell, dgImprove)}
${domainNotes("Clinical Management", cmWell, cmImprove)}
${domainNotes("Relating to Others", roWell, roImprove)}
Copy-edit these notes into the overall comment. The examiner's words, corrected and joined up, in the shape described. Nothing added.`,
      }],
    }),
  });

  if (!res.ok) return { error: "AI request failed." };
  const data = await res.json();
  // The prompt asks for no em dashes twice and they still arrive. Asking is
  // a preference; this is the part that decides. tidyExaminerComment follows
  // for the same reason, on the heading spelling and the empty FINAL WORD,
  // and runs second so a stripped bullet marker leaves its heading alone.
  const text = tidyExaminerComment(withoutEmDashes((data.content?.[0]?.text ?? "").trim()));
  await recordExaminerClaudeUsage("overall_comment", data.model ?? EXAMINER_CLAUDE_MODEL, data.usage ?? {}, args.recordingId);
  return { text };
}

/**
 * Find the moment in the transcript behind each ticked phrase.
 *
 * The examiner has already decided what the candidate did; this only looks
 * for where. That split is the whole justification for the feature: judging
 * is theirs, searching 2,200 words is not work a person should be doing.
 *
 * WHAT IT IS SHOWN was settled by measurement, not argument. Five context
 * configurations were run against two real consultations whose ground truth
 * comes from Brandon's own written reviews, scored on criteria fixed before
 * the results were seen. Recall of genuinely-true phrases, out of sixteen:
 * transcript alone 12; plus the AI's domain comments 12; plus the station's
 * marksheets 8; marksheets with skills and comments 14; comments, grades and
 * skills without the marksheets 14.
 *
 * THE MARKSHEETS ARE OUT, on the only measured downside in the set. Worst
 * recall, and the one source that made the model willing to assert what had
 * NOT happened. Both absences it produced that way failed adversarial
 * checking by two independent readers: it wrote "no direct screening for
 * spinal cord compression red flags such as ... bladder or bowel dysfunction"
 * about a consultation containing "You're passing urine alright?" and
 * "Opening bowels fine?" at 4:19. A wrong criticism going to a candidate
 * under a GP's name is the worst thing this product can produce.
 *
 * The skills assessment, the domain comments and the grades stay, at
 * Brandon's request. The circularity risk he accepted did not show: with a
 * domain comment planted to claim two things that never happened, autofill
 * returned null for both rather than repeating them, and the grades produced
 * no verdict leakage in any run.
 *
 * NOTHING FOUND IS A REAL ANSWER, and the prompt says so four times. A model
 * that can only return an example returns one for every tick, including the
 * ticks where the candidate did not quite do the thing — and an invented
 * "at 4:12 you screened for red flags" is far worse than an empty box,
 * because a timestamp reads as proof. The same failure has happened on this
 * page before: generateOverallCommentAction had to be told not to invent
 * clinical advice after it produced fluid-volume guidance no examiner wrote.
 *
 * The two halves are asked different questions, because they are different
 * questions. A Did well phrase has a moment: the candidate did it, and it is
 * somewhere in the transcript. A Could improve phrase is usually a NEGATIVE,
 * and a negative has no moment to point at. Asked for one anyway, a model
 * will manufacture the place where the thing should have happened. So the
 * improve side is asked for absence, which is checkable, or for the moment a
 * gap actually shows.
 *
 * These answers reach the candidate. They become the appraisal tags and the
 * detail in the overall comment, so anything invented here is not a note in
 * a private pad, it is a sentence in a report sent under a GP's name.
 */
export async function autofillTickedAction(args: {
  transcript: string;
  /** Ticked phrases with no comment yet, each with the half it belongs to. */
  items: { id: string; phrase: string; half: "well" | "improve"; domain: string }[];
  /**
   * The skills assessment, as a POINTER and not as a source.
   *
   * Thirteen closed questions already answered, which is the fastest way to
   * know which absences are real and worth looking for. But it is the model's
   * own earlier opinion, so it may not be quoted back: an examiner reading
   * "the AI marked this down" in their own notepad is reading the machine
   * agreeing with itself, dressed as evidence, and any mistake in the grading
   * would ride into the report under their name.
   *
   */
  skills?: { label: string; rating: string; improvement?: string }[];
  /**
   * The AI's own grade and comment for each domain.
   *
   * Brandon's call, against my advice, and his reason is a good one: those
   * comments are already specific to this consultation, so the detail in
   * them is tailored in a way a fresh search has to work for.
   *
   * The risk I raised and he accepted is circularity. An examiner reading
   * their own notepad takes what is in it as evidence, and if it came from
   * the model's earlier opinion then the machine is agreeing with itself and
   * any mistake in the grading rides into the report under a GP's name.
   *
   * So the prompt splits the two things these comments contain. The
   * SPECIFICS are transcript-derived and may be reused: "did not ask about
   * swelling around the eyes" names something checkable. The VERDICTS may
   * not: "data gathering was below standard" is an opinion, and the
   * examiner's tick already settled that question anyway.
   */
  aiDomains?: { domain: string; grade: string | null; comment: string | null }[];
  recordingId?: string;
}): Promise<{ filled?: Record<string, string>; error?: string }> {
  const examiner = await getExaminer();
  if (!examiner) return { error: "Not authorised." };

  /*
    Did well only, enforced here and not just in the client, because a server
    action is reachable by anything that can POST to it and the reason for the
    restriction is a correctness one rather than a UI preference.
  */
  const items = (args.items ?? []).filter((i) => i && i.id && i.phrase?.trim() && i.half === "well");
  if (items.length === 0) return { error: "No ticked Did Well phrase is waiting for a comment." };
  if (!args.transcript?.trim()) return { error: "No transcript to search." };

  const lines = items
    .map((i, n) => `${n + 1}. [${i.domain} / ${i.half === "well" ? "Did well" : "Could improve"}] ${i.phrase}`)
    .join("\n");

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": process.env.ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: EXAMINER_CLAUDE_MODEL,
      max_tokens: 2000,
      // Low, for the same reason as the copy editor: the job is to locate
      // something that is there, not to compose something that reads well.
      temperature: 0,
      system: [
        "An RCGP examiner has ticked phrases describing a candidate's consultation. For each one, find the evidence in the transcript. You are searching, not judging: whether the phrase is true is the examiner's call and has already been made.",
        "",
        "FINDING NOTHING IS A CORRECT ANSWER. Return null for a phrase whose evidence you cannot point to. Do not stretch, do not approximate, and do not offer the nearest thing. An examiner reads a filled box as proof that the moment exists, so a plausible invention is worse to them than an empty one. Expect to return null sometimes; a run that finds something for every phrase is a run that has made something up.",
        "",
        "DID WELL. Say where it happened, in one short phrase, with the timestamp if the transcript carries one: \"at 6:18, asked what she thought was causing it\". Describe the moment in your own words rather than quoting: the transcript is machine-written and carries filler and mis-heard words, and quoting puts sentences in the candidate's mouth. Null if the candidate did not visibly do it.",
        "",
        "EVERY PHRASE YOU ARE SENT IS A DID WELL PHRASE. Could improve phrases are deliberately not sent to you, because evidence for them would have to be an absence and absence is the thing this gets wrong. If one reaches you anyway, return null for it rather than reasoning about what did not happen.",
        "",
        "THE SKILLS ASSESSMENT, where it is given, is an earlier automated pass over the same consultation. Treat it as a pointer to where to look and nothing more. Never cite it, never refer to it, and never write that something was marked down or rated: an examiner reading that in their own notes is reading a machine agreeing with itself. If it says a thing is missing, go and confirm the absence in the transcript before you report one.",
        "",
        "THE AI DOMAIN COMMENTS, where they are given, are that same earlier pass written out per domain. They hold two different things and you may use only one of them. The SPECIFICS are fair game: where a comment names something concrete, such as a question not asked or a symptom not covered, that detail came from the transcript and you may reuse it. The VERDICTS are not: never write that a domain was weak, strong, below standard or graded anything. The examiner's tick has already settled whether the phrase is true; you are only saying where.",
        "",
        "Every answer you give is therefore one of exactly two things: a moment in the transcript, or an absence from the transcript. Nothing else qualifies, whatever the other material says.",
        "",
        "A phrase often carries a judgement word: early, briefly, clearly, specifically, well, good. That judgement is the examiner's and they have already made it by ticking. Find the underlying thing and say when it happened. Do not withhold an answer because you would have rated the qualifier differently, and do not argue with it. \"Elicited ICE early\" is answered by finding where ICE was elicited.",
        "",
        "LENGTH. One sentence. Two only where one genuinely will not carry it, which should be rare. These are read and edited at speed by someone part-way through a review, so short beats complete. No advice, no judgement, no praise.",
        "",
        "Reply with JSON only: an object mapping each phrase's number, as a string, to its answer or to null. Every number listed must appear.",
      ].join("\n"),
      messages: [{
        role: "user",
        content: [
          `TRANSCRIPT:\n${args.transcript}`,
          args.skills?.length
            ? `\nSKILLS ASSESSMENT, a pointer only, never to be cited:\n${args.skills
                .map((s) => `- ${s.label}: ${s.rating}${s.improvement ? ` (${s.improvement})` : ""}`)
                .join("\n")}`
            : "",
          args.aiDomains?.some((d) => d.comment)
            ? `\nAI DOMAIN COMMENTS, specifics reusable, verdicts not:\n${args.aiDomains
                .filter((d) => d.comment)
                .map((d) => `- ${d.domain}${d.grade ? ` [graded ${d.grade}]` : ""}: ${d.comment}`)
                .join("\n")}`
            : "",
          `\nPHRASES:\n${lines}`,
          "\nFind the evidence for each. null where there is none.",
        ].filter(Boolean).join("\n"),
      }],
    }),
  });

  if (!res.ok) return { error: "AI request failed." };
  const data = await res.json();
  await recordExaminerClaudeUsage("autofill_ticked", data.model ?? EXAMINER_CLAUDE_MODEL, data.usage ?? {}, args.recordingId);

  const raw = (data.content?.[0]?.text ?? "").trim();
  let parsed: Record<string, unknown>;
  try {
    // Models fence JSON about as often as not, whatever the prompt says.
    const body = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
    parsed = JSON.parse(body);
  } catch {
    return { error: "Could not read the reply." };
  }

  /*
    Nulls are dropped rather than written as empty strings. An empty string
    would be stored as the examiner's own comment on that tick, which is how
    "found nothing" would quietly become "the examiner looked and had nothing
    to add" — and would clear the marker that says this text is unreviewed.
  */
  const filled: Record<string, string> = {};
  items.forEach((item, n) => {
    const value = parsed[String(n + 1)];
    if (typeof value !== "string") return;
    const text = withoutEmDashes(value.trim());
    if (text) filled[item.id] = text;
  });

  return { filled };
}

export async function grammarCheckAction(args: { text: string; recordingId?: string }): Promise<{ text?: string; error?: string }> {
  const examiner = await getExaminer();
  if (!examiner) return { error: "Not authorised." };
  if (!args.text.trim()) return { error: "Nothing to check." };

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": process.env.ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: EXAMINER_CLAUDE_MODEL,
      max_tokens: 400,
      system: "You are a copy editor. Fix grammar and spelling only. Do not change the meaning, tone, structure, or word choice. Return ONLY the corrected text with no explanation.",
      messages: [{ role: "user", content: args.text }],
    }),
  });

  if (!res.ok) return { error: "AI request failed." };
  const data = await res.json();
  const text = withoutEmDashes((data.content?.[0]?.text ?? "").trim());
  await recordExaminerClaudeUsage("grammar_check", data.model ?? EXAMINER_CLAUDE_MODEL, data.usage ?? {}, args.recordingId);
  return { text };
}

export async function retryAiPipelineAction(recordingId: string): Promise<{ error?: string }> {
  const examiner = await getExaminer();
  if (!examiner) return { error: "Not authorised." };

  const admin = getSupabaseAdmin();
  if (!admin) return { error: "Server config error." };

  // Any status except "processing" can be retried. The previous allow-list
  // left out "ai_graded", which is precisely the state a failed grading run
  // lands in (the pipeline rolls back to it so the candidate can still submit
  // for GP review), so the most common failure was the one case Retry
  // silently refused to act on — it matched no rows and reported no error.
  const { data: current } = await admin
    .from("station_recordings")
    .select("status, transcript_formatted")
    .eq("id", recordingId)
    .single<{ status: string; transcript_formatted: string | null }>();

  if (!current) return { error: "Recording not found." };
  if (current.status === "processing" || current.status === "grading") {
    return { error: "Already running — give it a minute." };
  }

  /*
    Ask for the stage that actually needs doing.

    This used to POST with no query string, so the route defaulted to
    stage="transcribe". On a row that already has a transcript the pipeline
    takes its reuse branch, writes nothing, and returns at the
    `if (stage === "transcribe") return;` guard before it ever grades. The
    claim below had already moved the row to "processing", and nothing was
    left to move it off: the only "transcribed" write lives in the branch the
    reuse path skips.

    Not a race. It happened on every retry of anything already transcribed,
    which is every row a GP has in front of them, which is the whole point of
    the button. The panel it sits in already described the behaviour the code
    did not have: "Running it again reuses the existing transcript, so it
    goes straight to grading."
  */
  const stage = current.transcript_formatted ? "grade" : "transcribe";
  const claimStatus = stage === "grade" ? "grading" : "processing";

  // The read above says what to roll back to; it does not decide anything.
  // Checking the status and then setting it are two statements, and two
  // Retry clicks landing together both passed the check and both started a
  // pipeline run. The condition belongs in the UPDATE, where Postgres
  // serialises it: the second one matches no rows and stops here.
  const { data: claimed, error } = await admin
    .from("station_recordings")
    .update({ status: claimStatus, ai_error: null, ai_failed_at: null })
    .eq("id", recordingId)
    // Claim only if nothing has moved since the read above. Stronger than the
    // old .neq("status","processing"), which let a claim land on a row some
    // other write had just changed underneath it.
    .eq("status", current.status)
    .select("id");

  if (error) return { error: error.message };
  if (!claimed || claimed.length === 0) return { error: "Already processing — give it a minute." };

  // Trigger the pipeline server-side rather than from the browser: only the
  // server holds INTERNAL_API_KEY, so a browser-issued POST is rejected as
  // soon as that key is set. Fire-and-forget — the route acknowledges
  // immediately and does the real work in its own after().
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.scafocus.com";
  try {
    const res = await fetch(`${origin}/api/recordings/${recordingId}/process?stage=${stage}`, {
      method: "POST",
      headers: { "x-internal-key": process.env.INTERNAL_API_KEY ?? "" },
    });
    if (!res.ok) {
      const body = await res.text();
      // Guarded: only undo our own claim. Unguarded this could drag a row
      // backwards over a status the pipeline had already written.
      await admin
        .from("station_recordings")
        .update({ status: current.status })
        .eq("id", recordingId)
        .eq("status", claimStatus);
      return { error: `Could not start the pipeline (${res.status}). ${body.slice(0, 120)}` };
    }
  } catch (err) {
    await admin
      .from("station_recordings")
      .update({ status: current.status })
      .eq("id", recordingId)
      .eq("status", claimStatus);
    return { error: err instanceof Error ? err.message : "Could not reach the processing service." };
  }

  return {};
}

export async function checkRetryStatusAction(
  recordingId: string
): Promise<{ status?: string; hasGrades?: boolean; aiError?: string | null; error?: string }> {
  const examiner = await getExaminer();
  if (!examiner) return { error: "Not authorised." };

  const admin = getSupabaseAdmin();
  if (!admin) return { error: "Server config error." };

  // Status alone can't distinguish success from failure — the pipeline lands
  // on "ai_graded" either way — so the presence of grades is what actually
  // says whether the run worked.
  const { data } = await admin
    .from("station_recordings")
    .select("status, ai_data_gathering, ai_error")
    .eq("id", recordingId)
    .single<{ status: string; ai_data_gathering: string | null; ai_error: string | null }>();

  return {
    status: data?.status,
    hasGrades: !!data?.ai_data_gathering,
    aiError: data?.ai_error ?? null,
  };
}

/**
 * Replaces one Did Well / Could Improve tick list.
 *
 * The whole list arrives each time rather than an add, an edit and a move:
 * reordering is a drag, and a drag is only ever expressible as the new order
 * of everything. Sending the list makes add, rename, delete and reorder the
 * same call, which is also why there is one of these rather than four.
 *
 * Everything is re-checked here. The browser is where the dragging happened,
 * not where the rules live.
 */
export async function saveExaminerPresetsAction(
  field: string,
  presets: ExaminerPreset[]
): Promise<{ error?: string; success?: boolean }> {
  const examiner = await getExaminer();
  if (!examiner) return { error: "Not authorised." };

  if (!PRESET_FIELDS.includes(field as PresetField)) return { error: "Unknown list." };
  if (!Array.isArray(presets)) return { error: "Bad list." };
  if (presets.length > MAX_PRESETS_PER_FIELD) {
    return { error: `That is more than ${MAX_PRESETS_PER_FIELD} presets.` };
  }

  const cleaned: ExaminerPreset[] = [];
  const seen = new Set<string>();
  for (const entry of presets) {
    const text = String(entry?.text ?? "").trim();
    const id = String(entry?.id ?? "").trim();
    // A blank one is dropped rather than refused: it is what an empty row
    // left behind in the editor looks like, not something worth an error.
    if (!text || !id) continue;
    if (text.length > MAX_PRESET_LENGTH) return { error: "One of those is too long." };
    if (seen.has(id)) continue;
    seen.add(id);
    cleaned.push({ id, text });
  }

  const admin = getSupabaseAdmin();
  if (!admin) return { error: "Server error." };

  const { error } = await savePresetField(admin, field as PresetField, cleaned);
  if (error) return { error };

  return { success: true };
}

export async function examinerLogoutAction() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/examiner");
}

export async function submitExaminerReviewAction(
  _prevState: { error?: string; success?: boolean; warning?: string; sent?: boolean },
  formData: FormData
): Promise<{ error?: string; success?: boolean; warning?: string; sent?: boolean }> {
  const examiner = await getExaminer();
  if (!examiner) return { error: "Not authorised." };

  const admin = getSupabaseAdmin();
  if (!admin) return { error: "Server error." };

  const recordingId = String(formData.get("recordingId") ?? "").trim();
  const dgGrade = String(formData.get("dg_grade") ?? "").trim();
  const cmGrade = String(formData.get("cm_grade") ?? "").trim();
  const roGrade = String(formData.get("ro_grade") ?? "").trim();
  const dgComment = String(formData.get("dg_comment") ?? "").trim();
  const cmComment = String(formData.get("cm_comment") ?? "").trim();
  const roComment = String(formData.get("ro_comment") ?? "").trim();
  /*
    Absent and empty are different things for this one.

    An empty box means "no overall comment" and should clear the column. A
    MISSING key means the form did not carry the field, which is not a
    statement about the comment at all — and it used to read as one: the
    textarea sat inside an accordion, collapsing it unmounted the field, and
    the next save nulled a comment nobody had touched.

    The client no longer submits it from inside the accordion, so this cannot
    arise from that route again. Kept because the rule belongs on the side
    that writes the column: no form that forgets this field can erase what is
    stored, whatever a future caller looks like.
  */
  const overallRaw = formData.get("overall_comment");
  const overallComment = String(overallRaw ?? "").trim();
  const sendNow = formData.get("send_now") === "1";

  const validGrades = ["CF", "F", "P", "CP"];
  if (!validGrades.includes(dgGrade) || !validGrades.includes(cmGrade) || !validGrades.includes(roGrade)) {
    return { error: "All three domain grades are required." };
  }

  // An "ai_graded" recording was never submitted for GP review — it lives in
  // the AI pile of the portal. Grading it here is a manual overwrite: keep it
  // in the AI pile (status stays "ai_graded") and flag it as manually checked,
  // rather than moving it into the GP review queue/completed lists.
  const { data: current } = await admin
    .from("station_recordings")
    .select("submitted_for_review_at, gp_requested_at, sent_to_candidate_at")
    .eq("id", recordingId)
    .single<GpColumns & { sent_to_candidate_at: string | null }>();

  /*
    A report is sent once.

    The buttons are hidden once sent_to_candidate_at is set, which covers a
    reload and nothing else: a second click before the page catches up, a
    tab left open from this morning, a retry after a timeout that actually
    landed — each of those reached here and each wrote a fresh
    sent_to_candidate_at and emailed the whole room again. The window is not
    theoretical now that a send is several emails paced a half-second apart.

    Checked on the server because that is the only place it holds. A disabled
    button is a courtesy; this is the rule.

    Fails closed on an unreadable row. Refusing a first send over a transient
    read error costs a reload; the other way round costs everyone in the room
    a duplicate report, and there is no unsending one.
  */
  if (sendNow) {
    if (!current) {
      return { error: "Could not check whether this has already been sent, so nothing was sent. Reload and try again." };
    }
    if (current.sent_to_candidate_at) {
      const when = new Date(current.sent_to_candidate_at).toLocaleString("en-GB", {
        day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Europe/London",
      });
      return { error: `Already sent to the candidate on ${when}. Nothing was sent again.` };
    }
  }
  /*
    Whether this was ever sent to a GP, asked of the columns that record it
    rather than of the status string.

    It read `status === "ai_graded"`, which the pipeline is free to write at
    any moment. A re-grade that landed on "ai_graded" therefore reclassified
    a real GP review as an AI-pile overwrite, and the next Save kept it there
    permanently: a one-way trap, triggered by a button meant to be harmless.
  */
  const isAiPile = !gpRequested(current ?? {});

  const now = new Date().toISOString();
  const updatePayload: Record<string, unknown> = {
    examiner_id: examiner.id,
    examiner_data_gathering: dgGrade,
    examiner_clinical_management: cmGrade,
    examiner_relating_to_others: roGrade,
    examiner_comment_data_gathering: dgComment || null,
    examiner_comment_clinical_management: cmComment || null,
    examiner_comment_relating_to_others: roComment || null,
    // Left out entirely when the field was absent, so the stored comment
    // survives a submit that did not mention it. See overallRaw above.
    ...(overallRaw !== null ? { examiner_overall_comment: overallComment || null } : {}),
    examiner_reviewed_at: now,
    status: isAiPile ? "ai_graded" : sendNow ? "sent" : "reviewing",
  };

  if (isAiPile) {
    updatePayload.manually_checked_at = now;
    updatePayload.manually_checked_by = examiner.id;
  }

  if (sendNow) {
    updatePayload.sent_to_candidate_at = now;
  }

  const { error: updateErr } = await admin
    .from("station_recordings")
    .update(updatePayload)
    .eq("id", recordingId);

  if (updateErr) return { error: updateErr.message };

  /*
    So the page this was submitted from comes back with sent_to_candidate_at
    set, which is what hides the buttons. Without it the form sits there
    offering to send a report that has already gone, and only the server
    guard above stands between the examiner and a second one.
  */
  revalidatePath(`/examiner/${recordingId}`);

  // Snapshot the GP-review cost onto the consultation ledger the first time a
  // GP reviews it (whether a normal GP review or an AI-pile manual overwrite —
  // a GP was paid for their time either way). Frozen at the rate current now.
  {
    const { data: costRow } = await admin
      .from("consultation_costs")
      .select("gp_reviewed")
      .eq("recording_id", recordingId)
      .maybeSingle<{ gp_reviewed: boolean }>();
    if (!costRow?.gp_reviewed) {
      await snapshotGpReview(admin, recordingId, examiner.id);
    }
  }

  const { data: rec } = await admin
    .from("station_recordings")
    .select(
      "candidate_email, station_number, station_title, doctor_display_name, patient_display_name, doctor_user_id, patient_user_id, observer_user_ids"
    )
    .eq("id", recordingId)
    .single<{
      candidate_email: string | null;
      station_number: number;
      station_title: string;
      doctor_display_name: string;
      patient_display_name: string | null;
      doctor_user_id: string | null;
      patient_user_id: string | null;
      observer_user_ids: string[] | null;
    }>();

  let emailed = true;
  /** Copies to the others in the room that were meant to go and did not. */
  let peerMissed = 0;

  if (sendNow && rec) {
    const gradePts: Record<string, Record<string, number>> = {
      dg: { CF: 0, F: 1, P: 2, CP: 3 },
      cm: { CF: 0, F: 1.5, P: 3, CP: 4.5 },
      ro: { CF: 0, F: 1, P: 2, CP: 3 },
    };
    const total = (gradePts.dg[dgGrade] ?? 0) + (gradePts.cm[cmGrade] ?? 0) + (gradePts.ro[roGrade] ?? 0);

    /*
      The marking, written once and sent to everyone who was in the room.

      Brandon's call, and it is narrower than it looks: the report page has
      never gated the grades on which chair you sat in, so the patient and the
      observers could already open all of this from their envelope. What
      changes is that it now reaches them without their having to look. The
      only thing withheld from a peer is the doctor's display name — see the
      peer field on sendExaminerReportEmail.
    */
    /*
      Who was in the room, for the block under the station title.

      The doctor and the patient are denormalised onto the row; the observers
      are only ids, so their names come from user_profiles in one go and are
      put back in the order the array holds them rather than the order the
      rows come back in.

      The examiner is the person pressing Send, which is the same id written
      to examiner_id in updatePayload above — not a second lookup that could
      disagree with it.
    */
    const observerIds = (rec.observer_user_ids ?? []).filter(Boolean);
    let observerNames: string[] = [];
    if (observerIds.length > 0) {
      // supabase-js returns { data, error } rather than throwing.
      const { data: profiles, error: profileErr } = await admin
        .from("user_profiles")
        .select("id, display_name")
        .in("id", observerIds);
      if (profileErr) {
        console.error("[examiner] could not read observer names", { recordingId, error: profileErr.message });
      }
      const byId = new Map((profiles ?? []).map((p) => [p.id as string, p.display_name as string | null]));
      observerNames = observerIds
        .map((id) => printableName(byId.get(id)))
        .filter((n): n is string => !!n);
    }

    const roster = {
      doctor: printableName(rec.doctor_display_name),
      patient: printableName(rec.patient_display_name),
      observers: observerNames,
      examiner: printableName(examiner.name),
    };

    const report = {
      recordingId,
      roster,
      stationNumber: rec.station_number,
      stationTitle: rec.station_title,
      dgGrade,
      cmGrade,
      roGrade,
      totalPts: total,
    };

    /*
      Every send in this action goes through here, so the pacing holds across
      the candidate's copy and the peers' alike rather than only within the
      peer loop. The stamp is taken before the request rather than after, so
      the gap is measured between starts and the time a send itself takes is
      slack on top of it.
    */
    let lastSendAt = 0;
    const pacedSend = async (opts: Parameters<typeof sendExaminerReportEmail>[0]) => {
      const wait = SEND_GAP_MS - (Date.now() - lastSendAt);
      if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait));
      lastSendAt = Date.now();
      return sendExaminerReportEmail(opts);
    };

    if (rec.candidate_email) {
      /*
        The result used to be discarded. sendExaminerReportEmail returns false
        on a Resend error or a missing key and never throws, so a bounced email
        left the review marked sent, the candidate never told, and nothing
        recorded anywhere.

        It is no longer fatal — the review is saved, sent_to_candidate_at is
        set, and it is now sitting in the candidate's envelope either way — but
        the GP who pressed Send is the one person who can chase it, so say so.
      */
      emailed = await pacedSend({ to: rec.candidate_email, ...report });
      if (!emailed) {
        console.error("[examiner] report email not sent", { recordingId, to: rec.candidate_email });
      }
    }

    /*
      Everyone else who was in the room.

      doctor_user_id is excluded explicitly rather than for tidiness: a solo
      practice take writes the doctor into patient_user_id as well
      (app/betatest/actions.ts:35), so without this the candidate would get a
      second copy of their own report, that one addressed to them in the third
      person.
    */
    const peerIds = Array.from(
      new Set(
        [rec.patient_user_id, ...(rec.observer_user_ids ?? [])].filter(
          (id): id is string => !!id && id !== rec.doctor_user_id
        )
      )
    );

    /*
      Addresses, which are not on the row — only candidate_email is, and that
      is the doctor's. Keyed on the lowercased address so the same person in
      two chairs is one email, and checked against candidate_email in case a
      peer resolves to the address that has just been written to.
    */
    const peerAddresses = new Map<string, string>();
    for (const id of peerIds) {
      // supabase-js returns { data, error } rather than throwing.
      const { data: authUser, error: lookupErr } = await admin.auth.admin.getUserById(id);
      const address = authUser?.user?.email;
      if (lookupErr || !address) {
        console.error("[examiner] no address for someone in the room", {
          recordingId,
          userId: id,
          error: lookupErr?.message,
        });
        peerMissed++;
        continue;
      }
      const key = address.toLowerCase();
      if (key === (rec.candidate_email ?? "").toLowerCase()) continue;
      peerAddresses.set(key, address);
    }

    const peerList = Array.from(peerAddresses.values());
    if (peerList.length > 0) {
      /*
        The doctor is named in the possessive and nowhere else. doctorPossessive
        returns null for a display name it cannot trust — one holding an email
        address, or the "Tester"/"Doctor" placeholders — and the subject is then
        the bare "SCA Report", exactly as the envelope says "the case".
      */
      const whose = doctorPossessive(rec.doctor_display_name);

      /*
        One at a time, through the same gate as the candidate's copy.

        This was Promise.all, which fired every peer at once. A room with two
        observers is three peers, so three requests landed together against an
        allowance of two a second, and the one that lost came back as a plain
        failure with nothing to retry it. The GP would have been told a copy
        did not go out, which is true and no use to the person who did not get
        it. One observer never showed it: two is where it starts.
      */
      for (const to of peerList) {
        const ok = await pacedSend({ to, ...report, whose });
        if (ok) continue;
        peerMissed++;
        console.error("[examiner] report email not sent to someone in the room", { recordingId, to });
      }
    }
  }

  /*
    One warning covering both, because the GP who pressed Send is the only
    person who can chase any of it, and a half-delivered send they are not
    told about reads to them as a clean one.
  */
  const undelivered: string[] = [];
  if (sendNow && rec?.candidate_email && !emailed) undelivered.push("the candidate's copy did not go out");
  if (peerMissed > 0) {
    undelivered.push(
      `${peerMissed} ${peerMissed === 1 ? "copy" : "copies"} to the others in the room did not go out`
    );
  }

  return {
    success: true,
    // Only true when a send actually happened here, so the navbar's count
    // moves for a send and not for a draft save.
    sent: sendNow,
    warning: undelivered.length
      ? `Saved and sent, but ${undelivered.join(", and ")}. Everyone who was in the room can still see the report in their envelope on the site.`
      : undefined,
  };
}

/**
 * Examiner edits to the skill ratings and text.
 *
 * Saved to examiner_skills_assessment rather than over the AI's, mirroring how
 * examiner_data_gathering sits beside ai_data_gathering: the report can then
 * show what the model said and what the GP changed it to, and a re-run of the
 * pipeline cannot silently wipe a GP's work.
 *
 * Deliberately does not re-run the grade adjustment. That adjustment exists to
 * correct the model's own domain grades; an examiner sets the domain grades
 * directly, so recomputing from their skill edits would fight them for control
 * of the same number.
 */
export async function saveExaminerSkillsAction(
  recordingId: string,
  skills: { skill: string; rating: string; comment: string; improvement?: string }[]
): Promise<{ error?: string }> {
  const examiner = await getExaminer();
  if (!examiner) return { error: "Not authorised." };

  const admin = getSupabaseAdmin();
  if (!admin) return { error: "Server config error." };

  const allowed = ["good", "needs_improvement", "not_assessable"];
  for (const s of skills) {
    if (!allowed.includes(s.rating)) return { error: `Unknown rating "${s.rating}".` };
  }

  const cleaned = skills.map((s) => ({
    skill: s.skill,
    rating: s.rating,
    comment: (s.comment ?? "").trim(),
    ...(s.improvement?.trim() ? { improvement: s.improvement.trim() } : {}),
  }));

  const { error } = await admin
    .from("station_recordings")
    .update({ examiner_skills_assessment: { skills: cleaned } })
    .eq("id", recordingId);

  if (error) return { error: error.message };
  revalidatePath(`/examiner/${recordingId}`);
  revalidatePath(`/recordings/${recordingId}`);
  return {};
}
