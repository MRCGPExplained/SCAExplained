/**
 * How a predicted score is presented, defined once.
 *
 * These three facts — where the pass mark sits, what colour a total gets, and
 * whether it earns a badge — were private to app/recordings/[id]/page.tsx,
 * so the sample report on the homepage and at /recordings/sample rendered the
 * same number differently. The sample scores exactly 7, which is a pass, and
 * showed it in plain navy with no badge: the clearest signal in the whole
 * report, missing from the one version a prospective buyer sees.
 *
 * The maximum is 10.5 because the three domains are weighted 3 / 4.5 / 3.
 */

export const MAX_SCORE = 10.5;
export const PASS_THRESHOLD = 7;

/** Below this the score is a long way off, rather than close to the line. */
export const BORDERLINE_THRESHOLD = 5;

export function isPassingScore(total: number | null): boolean {
  return total !== null && total >= PASS_THRESHOLD;
}

/**
 * The number carries the verdict for everything under the pass mark, which is
 * why only a pass gets a badge as well. Two bands of shortfall told twice
 * over, in a colour and in a word, was more noise than information.
 */
export function scoreColour(total: number): string {
  if (total >= PASS_THRESHOLD) return "#166534";
  if (total >= BORDERLINE_THRESHOLD) return "#C2410C";
  return "#B91C1C";
}
