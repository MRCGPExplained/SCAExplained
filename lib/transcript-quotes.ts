/**
 * Catching feedback that quotes the consultation back at the candidate.
 *
 * Asking the model not to quote does not work. Measured over three runs of the
 * same two recordings, the same instruction produced 1, 7 and 10 quoting
 * comments out of 22 — the variation between runs was larger than the variation
 * between prompt wordings, so the instruction is a tendency, not a control.
 *
 * The transcript is a machine transcription of speech. Quoting it reproduces
 * the filler ("if if there was anything") and, worse, reproduces mis-heard
 * words as things the candidate said: one report quoted a registrar saying "I
 * can hear the fear that about you". Nobody said that.
 *
 * A suggested phrase needs no special handling here. The candidate never said
 * it, so it cannot match the transcript, so it passes untouched. The test only
 * catches words that were genuinely lifted.
 */

/** Words a run must reach before it counts as quoting rather than describing. */
export const MIN_QUOTE_RUN = 6;

/**
 * Lower-cased words, punctuation dropped, digits dropped.
 *
 * Dropping punctuation is what lets this see through the quotation marks
 * themselves. Dropping digits keeps the transcript's "[4:35]" timestamps and
 * speaker labels from forming runs of their own.
 */
function tokenise(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 0 && !/^\d+$/.test(w));
}

function ngrams(words: string[], n: number): Set<string> {
  const out = new Set<string>();
  for (let i = 0; i + n <= words.length; i++) out.add(words.slice(i, i + n).join(" "));
  return out;
}

/**
 * Every run of `minRun` or more consecutive words the comment shares with the
 * transcript, merged so an overlapping stretch is reported once.
 *
 * Describing a moment reuses the odd word, never six in a row: "when you asked
 * what she thought was causing it" shares nothing that long with what was
 * actually said. Reproducing a sentence shares all of it.
 */
export function findTranscriptQuotes(
  comment: string,
  transcript: string,
  minRun: number = MIN_QUOTE_RUN
): string[] {
  const commentWords = tokenise(comment);
  if (commentWords.length < minRun) return [];

  const transcriptGrams = ngrams(tokenise(transcript), minRun);

  const hits: string[] = [];
  let runStart = -1;
  for (let i = 0; i + minRun <= commentWords.length; i++) {
    const gram = commentWords.slice(i, i + minRun).join(" ");
    if (transcriptGrams.has(gram)) {
      if (runStart < 0) runStart = i;
    } else if (runStart >= 0) {
      hits.push(commentWords.slice(runStart, i + minRun - 1).join(" "));
      runStart = -1;
    }
  }
  if (runStart >= 0) hits.push(commentWords.slice(runStart).join(" "));

  return hits;
}

export function quotesTranscript(
  comment: string,
  transcript: string,
  minRun: number = MIN_QUOTE_RUN
): boolean {
  return findTranscriptQuotes(comment, transcript, minRun).length > 0;
}

export interface RepairTarget {
  /** Where the comment came from, so the rewrite can be put back. */
  key: string;
  comment: string;
  quotes: string[];
}

/**
 * Asks only for the offending comments to be rewritten.
 *
 * Deliberately not a re-grade. The grades are already settled and re-running
 * the whole judgement to fix prose would risk changing them, which is a far
 * worse outcome than a quotation.
 */
export function buildQuoteRepairPrompt(targets: RepairTarget[]): string {
  const items = targets
    .map((t) => `${t.key}\nQuoted from the transcript: ${t.quotes.map((q) => `"${q}"`).join("; ")}\nComment: ${t.comment}`)
    .join("\n\n");

  return `Each comment below quotes the consultation transcript back at the candidate. Rewrite each one so it describes the same moment in your own words instead.

Keep the meaning, the judgement and roughly the length. Keep addressing the candidate as "you". Change nothing except the quoting: write "when you asked what she thought was causing it" in place of reproducing her words.

You may still use quotation marks for a phrase you are suggesting the candidate could say next time, because that is wording you are offering rather than wording they used.

${items}

Respond ONLY with valid JSON, no markdown, mapping each key to its rewritten comment:
{ ${targets.map((t) => `"${t.key}": "rewritten comment"`).join(", ")} }`;
}
