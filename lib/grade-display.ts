/**
 * How a domain grade is shown, in one place.
 *
 * Two vocabularies, because two different things are speaking. A GP who has
 * listened to the consultation says Clear Pass or Clear Fail and means it. A
 * model estimating from a transcript should not: the gap between Pass and
 * Clear Pass is a finer judgement than it can support, and "Clear Fail" in a
 * red badge is a verdict delivered by something that was guessing.
 *
 * This lives here because three screens show these grades, and until now each
 * kept its own copy of the colours and labels. The report was changed to say
 * Good / Needs Improvement for an AI grade while the recordings list and the
 * station rows still said CP and F about the SAME consultation, which is
 * worse than either choice on its own: click a row reading "CP F P" and the
 * report it opens says "Good, Needs Improvement, Good".
 *
 * What is stored never changes. CF/F/P/CP is what the model produces, what
 * the points are computed from, and what the predicted total and the score
 * distribution still show. Only the words on the badge soften.
 */

export interface GradeDisplay {
  /** Spelled out, for a report card. */
  label: string;
  /** One or two letters, for a list row where there is no space. */
  short: string;
  color: string;
  /**
   * Opaque, not a tint.
   *
   * These were alpha: rgba(59,130,246,0.09) and so on. That is the same thing
   * as the hex below for as long as every pill sits on a white card, which
   * was true of all three places they render. It stopped being true when the
   * key took a yellow wash: an alpha pill lets its card through, and CP came
   * out 232,236,232, which is grey. A key whose whole job is to say what the
   * colours mean is the worst place to lose one.
   *
   * Each value is its old tint composited over white, so nothing on a white
   * card moved by a pixel. Measured rather than eyeballed: see the hex beside
   * each band.
   */
  bg: string;
}

/** What a GP says. The RCGP's own bands, which every candidate already knows. */
export const VERDICT: Record<string, GradeDisplay> = {
  CF: { label: "Clear Fail", short: "CF", color: "#B91C1C", bg: "#FEEEEE" },
  F: { label: "Fail", short: "F", color: "#92400E", bg: "#FEF6E9" },
  P: { label: "Pass", short: "P", color: "#166534", bg: "#EBFAF1" },
  CP: { label: "Clear Pass", short: "CP", color: "#1D4ED8", bg: "#EDF4FE" },
};

/**
 * What the AI says. Not new vocabulary: it is what the Skills Assessment on
 * the report already uses, down to the colours.
 */
export const ESTIMATE = {
  good: { label: "Good", short: "G", color: "#166534", bg: "#E9F9EF" },
  needs_improvement: { label: "Needs Improvement", short: "N", color: "#92400E", bg: "#FEF3E2" },
} satisfies Record<string, GradeDisplay>;

/**
 * @param grade  the stored band, CF/F/P/CP
 * @param estimate  true when no GP has ruled on it yet
 */
export function gradeDisplay(grade: string | null | undefined, estimate: boolean): GradeDisplay | null {
  if (!grade || !VERDICT[grade]) return null;
  if (!estimate) return VERDICT[grade];
  return grade === "P" || grade === "CP" ? ESTIMATE.good : ESTIMATE.needs_improvement;
}
