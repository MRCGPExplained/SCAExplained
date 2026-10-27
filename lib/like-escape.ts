/**
 * Escapes a value that is about to be used as a LIKE/ILIKE pattern.
 *
 * ilike treats its argument as a pattern, so an email containing an underscore
 * or a percent sign matches more addresses than its own. Matching a privileged
 * address that way admits anyone who can register a single-character variant
 * of it: "b_enfah@hotmail.com" matches "btenfah@hotmail.com", and Outlook
 * allows underscores in a local part. That is privileged access to anyone
 * willing to sign up for the right lookalike.
 *
 * This lives in its own file because it did not, and that is exactly how the
 * hole reopened. It was written inside admin-auth.ts, module-private, with
 * this comment attached — and lib/examiner-auth.ts matched the SAME column of
 * the SAME table with the SAME user-controlled email and could not reach it.
 * The admin door was locked and the examiner door beside it was left open,
 * which is worth more than it sounds: an examiner reads every candidate's
 * report, their email, and signed URLs to both sides of their audio.
 *
 * Anything comparing a user-supplied value with .ilike() or .like() goes
 * through here. If you are writing that comparison and this function is not
 * in the call, the comparison is wrong.
 */
export function likeEscape(value: string): string {
  return value.replace(/[\\%_]/g, (c) => `\\${c}`);
}
