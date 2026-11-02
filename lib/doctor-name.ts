/**
 * The doctor's first name, for labelling a consultation somebody else sat in.
 *
 * `station_recordings.doctor_display_name` is denormalised onto the row when it
 * is inserted, and its fallback chain is `display_name ?? user.email ??
 * "Tester"` (app/case-bank/actions.ts:962, app/betatest/actions.ts:25). So the
 * column is not reliably a person's name. It can hold:
 *
 *   - an email address, which has no space in it, so a naive split would
 *     publish the doctor's email to everyone who was in the room with them;
 *   - a placeholder — "Tester" from that fallback, or "Doctor" on the older
 *     rows written before display names reached this table at all.
 *
 * None of those can be told apart from someone with a genuinely one-word name,
 * so none of them are used. This returns null when it cannot be sure, and the
 * caller says nothing rather than guessing.
 *
 * printableName below answers a looser question — "may this be shown to
 * someone else as a name" — and allows a one-word name, because a name is
 * only ambiguous with a placeholder when you are trying to split it. Both
 * refuse anything holding an "@", which is the fallback that matters: it
 * would publish the person's email address to everyone in the room.
 */
export function printableName(displayName: string | null | undefined): string | null {
  const raw = (displayName ?? "").trim();
  if (!raw || raw.includes("@")) return null;
  // The two placeholders the fallback chains produce. "Doctor: Doctor" and
  // "Patient: Tester" are worse than an absent line, and neither can be told
  // from a real name by shape, only by value.
  if (raw === "Tester" || raw === "Doctor" || raw === "Patient") return null;
  return raw;
}

export function doctorFirstName(displayName: string | null | undefined): string | null {
  const raw = (displayName ?? "").trim();
  if (!raw || raw.includes("@") || !raw.includes(" ")) return null;
  return raw.split(/\s+/)[0];
}

/**
 * "Lily's", or null when the name is not usable.
 *
 * Separate from doctorFirstName because every caller wants the possessive and
 * an apostrophe rule written out twice is an apostrophe rule that drifts.
 */
export function doctorPossessive(displayName: string | null | undefined): string | null {
  const first = doctorFirstName(displayName);
  return first ? `${first}’s` : null;
}
