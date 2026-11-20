/**
 * Deleting expired anonymous accounts, properly.
 *
 * Two kinds of people hold one: a GUEST, invited into somebody's study room
 * to play the patient, and a TRIAL visitor, who came off the homepage to do
 * the free case. Both are Supabase anonymous auth users with a 24-hour life
 * and both are swept here, because telling them apart would be work for no
 * benefit — neither should outlive the day.
 *
 * THIS REPLACES A SWEEP THAT WAS QUIETLY FAILING. The version in
 * app/admin/actions.ts cleared four tables before calling deleteUser. Nine
 * reference auth.users with no ON DELETE, so five could block it:
 *
 *   cleared already   room_participants · station_reports · station_stars
 *                     user_profiles
 *   NOT cleared       ai_report_feedback · friend_requests · study_rooms
 *                     (host_user_id) · user_access
 *
 * Worse, it did `if (!error) deleted++` and threw the error away, so an
 * admin pressing the button saw "Deleted 3" when five were attempted and two
 * were refused, with nothing in the logs. The count was of successes and
 * read like a total.
 *
 * THE TRIAL IS WHAT MADE THIS URGENT. A guest is never the host of a room,
 * so study_rooms.host_user_id — which is NOT NULL, so it cannot be nulled
 * out of the way — never pointed at one. A trial visitor IS the host of
 * theirs, by design, so every single trial account would have been
 * undeletable and the sweep would have reported success while doing nothing.
 *
 * WHAT SURVIVES ON PURPOSE: the station_recordings row. Its doctor_user_id
 * is ON DELETE SET NULL, so deleting the account leaves the receipt — which
 * trial ran, when, and whether it finished. Without it there is no way to
 * answer how many people tried the product, which is the entire reason the
 * trial exists. The audio and transcript are removed separately, by
 * pruneTrialContent below.
 */
import { getSupabaseAdmin } from "@/lib/supabase";

/** A guest's pass and a trial both last a day. */
export const ANON_MAX_AGE_MS = 24 * 60 * 60 * 1000;

export interface PurgeResult {
  /** Accounts that are past their day and were attempted. */
  found: number;
  deleted: number;
  /** Accounts that could not be deleted, with why. Never silently dropped. */
  failures: { userId: string; reason: string }[];
  /** Recordings whose audio and transcript were cleared. */
  contentPruned: number;
}

export const EMPTY_PURGE: PurgeResult = { found: 0, deleted: 0, failures: [], contentPruned: 0 };

/**
 * Anonymous auth users past their day.
 *
 * Paginated because listUsers caps at a page at a time; stopped at 10 pages
 * as a sanity bound on one pass, which is 10,000 accounts and far more than
 * a day can produce.
 */
export async function findExpiredAnonymousIds(
  admin: NonNullable<ReturnType<typeof getSupabaseAdmin>>
): Promise<string[]> {
  const cutoff = Date.now() - ANON_MAX_AGE_MS;
  const expired: string[] = [];
  const perPage = 1000;
  for (let page = 1; page <= 10; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage });
    if (error || !data) break;
    for (const u of data.users) {
      if (u.is_anonymous && new Date(u.created_at).getTime() < cutoff) expired.push(u.id);
    }
    if (data.users.length < perPage) break;
  }
  return expired;
}

/**
 * Removes everything that would refuse the delete, then deletes the account.
 *
 * ORDER IS THE WHOLE JOB. Rooms the user hosts have to go before the user,
 * and a room's participants have to go before the room — room_participants
 * references study_rooms with no ON DELETE either. Everything else is a flat
 * delete by user_id.
 *
 * Done one account at a time rather than in bulk so a single stuck row
 * cannot take the rest of the sweep down with it, and so the reason comes
 * back attached to the account it belongs to.
 */
async function purgeOne(
  admin: NonNullable<ReturnType<typeof getSupabaseAdmin>>,
  userId: string
): Promise<string | null> {
  // Rooms they host. NOT NULL, so there is no nulling it: the room goes.
  const { data: hosted, error: roomsErr } = await admin
    .from("study_rooms")
    .select("id")
    .eq("host_user_id", userId)
    .returns<{ id: string }[]>();
  if (roomsErr) return `could not list hosted rooms: ${roomsErr.message}`;

  const roomIds = (hosted ?? []).map((r) => r.id);
  if (roomIds.length) {
    // Participants first — including other people's rows in that room.
    // room_messages is ON DELETE CASCADE and station_recordings.room_id is
    // SET NULL, so neither needs touching and the recording survives.
    const { error: partErr } = await admin.from("room_participants").delete().in("room_id", roomIds);
    if (partErr) return `could not clear participants of hosted rooms: ${partErr.message}`;

    const { error: roomErr } = await admin.from("study_rooms").delete().in("id", roomIds);
    if (roomErr) return `could not delete hosted rooms: ${roomErr.message}`;
  }

  // The flat ones. Every table here is NO ACTION against auth.users, so each
  // is load-bearing: miss one and deleteUser is refused.
  for (const [table, column] of [
    ["room_participants", "user_id"],
    ["ai_report_feedback", "user_id"],
    ["station_reports", "user_id"],
    ["station_stars", "user_id"],
    ["user_access", "user_id"],
    ["user_profiles", "id"],
  ] as const) {
    const { error } = await admin.from(table).delete().eq(column, userId);
    if (error) return `could not clear ${table}: ${error.message}`;
  }

  // friend_requests points at auth.users twice and an anonymous account
  // should never have one, but "should never" is not a constraint.
  for (const column of ["sender_id", "receiver_id"] as const) {
    const { error } = await admin.from("friend_requests").delete().eq(column, userId);
    if (error) return `could not clear friend_requests.${column}: ${error.message}`;
  }

  const { error: delErr } = await admin.auth.admin.deleteUser(userId);
  if (delErr) return delErr.message;
  return null;
}

/**
 * Clears the audio and transcript of finished trials past their day.
 *
 * Separate from the account delete because it is a different lifetime: the
 * ROW stays for ever as a receipt, while its content is the expensive,
 * personal part and goes at 24 hours. A trial report is readable for a day
 * and then it is a stub, which is what the upsell block on it says.
 *
 * Audio paths are cleared alongside the files. Storage is removed first for
 * the same reason as lib/audio-retention: stamping the row first would
 * orphan the files beyond the reach of anything that deletes them.
 */
export async function pruneTrialContent(
  admin: NonNullable<ReturnType<typeof getSupabaseAdmin>>
): Promise<{ pruned: number; error?: string }> {
  const cutoff = new Date(Date.now() - ANON_MAX_AGE_MS).toISOString();

  const { data, error } = await admin
    .from("station_recordings")
    .select("id, doctor_audio_path, patient_audio_path")
    .eq("is_trial", true)
    .is("audio_deleted_at", null)
    .lt("created_at", cutoff)
    .returns<{ id: string; doctor_audio_path: string | null; patient_audio_path: string | null }[]>();

  // A failed read means nothing to prune, never everything.
  if (error) return { pruned: 0, error: error.message };
  if (!data || data.length === 0) return { pruned: 0 };

  const paths = data.flatMap((r) =>
    [r.doctor_audio_path, r.patient_audio_path].filter((p): p is string => !!p)
  );
  if (paths.length) {
    const { error: storageErr } = await admin.storage.from("consultation-recordings").remove(paths);
    if (storageErr) return { pruned: 0, error: `storage: ${storageErr.message}` };
  }

  const { error: updErr } = await admin
    .from("station_recordings")
    .update({
      doctor_audio_path: null,
      patient_audio_path: null,
      transcript_formatted: null,
      transcript_raw: null,
      audio_deleted_at: new Date().toISOString(),
    })
    .in("id", data.map((r) => r.id));

  if (updErr) return { pruned: 0, error: updErr.message };
  return { pruned: data.length };
}

/** The whole sweep: expired anonymous accounts, then expired trial content. */
export async function purgeExpiredAnonymous(): Promise<PurgeResult> {
  const admin = getSupabaseAdmin();
  if (!admin) return EMPTY_PURGE;

  const ids = await findExpiredAnonymousIds(admin);
  const failures: PurgeResult["failures"] = [];
  let deleted = 0;

  for (const id of ids) {
    const reason = await purgeOne(admin, id);
    if (reason) failures.push({ userId: id, reason });
    else deleted += 1;
  }

  const content = await pruneTrialContent(admin);
  if (content.error) failures.push({ userId: "(trial content)", reason: content.error });

  return { found: ids.length, deleted, failures, contentPruned: content.pruned };
}
