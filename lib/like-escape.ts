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
 * FOUR metacharacters, not three. Postgres LIKE has `%` and `_`; PostgREST
 * adds a third by documenting `*` as an alias for `%` in its like/ilike
 * filters, and rewrites it server-side before the SQL is built. This escaped
 * only backslash, `%` and `_` for a while, which left the hole the file
 * exists to close half open — and reachable with no crafted address at all:
 * typing a single `*` into the add-a-friend field matched every profile in
 * user_profiles, which is verbatim the outcome the comment at that call site
 * says was fixed.
 *
 * Escaping `*` makes it a literal `%` rather than a literal `*`, because
 * PostgREST rewrites the asterisk before Postgres sees the backslash. That is
 * a false negative for a value genuinely containing an asterisk, which no
 * email address does, and the alternative is a wildcard. Safe beats exact
 * here.
 *
 * Anything comparing a user-supplied value with .ilike() or .like() goes
 * through here. If you are writing that comparison and this function is not
 * in the call, the comparison is wrong.
 */
export function likeEscape(value: string): string {
  return value.replace(/[\\%_*]/g, (c) => `\\${c}`);
}
