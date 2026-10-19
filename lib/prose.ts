/**
 * Tidying for prose a model wrote, applied before it is stored.
 *
 * The examiner-comment prompt has asked for "no em dashes" in two places for
 * a while and they still come through, which is what a prompt instruction is:
 * a strong preference, not a guarantee. The feedback a candidate reads is the
 * most visible writing on the product, so this is the part that should not be
 * left to chance. The prompts still ask, because a model that does not write
 * them needs no cleaning up; this is what catches the rest.
 */

/**
 * Replaces em dashes with the punctuation they were standing in for.
 *
 * A comma is the right answer almost every time: in generated prose the dash
 * is nearly always a soft aside, and a comma is never ungrammatical where one
 * was. A colon would read better where the second half explains the first,
 * but telling those apart needs the meaning, and guessing wrong is worse than
 * being plain.
 *
 * Unspaced en dashes are left alone. Those are ranges ("3-5 sentences"), and
 * turning one into a comma would change what it says.
 */
export function withoutEmDashes(text: string): string {
  if (!text) return text;

  return (
    text
      // A dash opening a line is standing in for a bullet, not a comma.
      .replace(/^[ \t]*[—–][ \t]*/gm, "")
      // Em dash anywhere, and en dash only when spaced, which is the one way
      // an en dash is being used as a dash rather than as a range.
      .replace(/[ \t]*—[ \t]*/g, ", ")
      .replace(/[ \t]+–[ \t]+/g, ", ")
      // Tidy the joins that creates.
      .replace(/,[ \t]*(,[ \t]*)+/g, ", ")
      .replace(/[ \t]+,/g, ",")
      .replace(/,[ \t]*([.!?;:])/g, "$1")
      .replace(/([([])[ \t]*,[ \t]*/g, "$1")
      .replace(/[ \t]*,[ \t]*([)\]])/g, "$1")
      .replace(/[ \t]{2,}/g, " ")
      .trim()
  );
}
