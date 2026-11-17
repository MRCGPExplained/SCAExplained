/**
 * Deleting consultation audio once nobody needs it, in one place.
 *
 * This lived in app/admin/actions.ts, where it could only ever run when an
 * admin pressed a button. Nobody pressed it, so storage grew until Supabase
 * wrote to say the 1 GB had gone. It is now also run by
 * app/api/cron/prune-audio, which is why it is here: app/admin/actions.ts is
 * a "use server" file, where every export is a callable endpoint, and a
 * delete-everything-old function with no auth check has no business being
 * one of those. A plain module can be imported by both without being exposed
 * to anybody.
 *
 * Nothing about WHAT is deleted changed in the move. The two conditions, the
 * failure-is-not-eligibility reads and the storage-before-row ordering are
 * the originals.
 *
 * ANYTHING THAT STAMPS audio_deleted_at WITHOUT DELETING THE FILES BREAKS
 * THIS. Every query here starts from audio_deleted_at IS NULL, so the stamp
 * is what puts a row's files beyond the reach of the only code that removes
 * them. A pg_cron job doing exactly that, 'mark-audio-for-deletion', was
 * found installed in production on 17 Nov 2026 and would have made this
 * module a silent no-op from late January; see supabase/audio_cleanup_cron.sql
 * for the removal and the full account. If audio is ever stamped somewhere
 * new, delete the bytes in the same breath.
 */
import { getSupabaseAdmin } from "@/lib/supabase";

interface AudioRow {
  id: string;
  doctor_audio_path: string | null;
  patient_audio_path: string | null;
  examiner_voice_note_path: string | null;
}

/**
 * What the audio sweep found, including what it refused.
 *
 * The refusal is reported rather than counted silently. A card that said
 * "0 found" without saying why would look identical whether the access check
 * was doing its job or the query behind it was broken, and those are the two
 * states it most matters to tell apart.
 */
export interface AudioSweep {
  eligible: number;
  /** Left alone because the candidate's access has not run out yet. */
  heldForLiveAccess: number;
  /**
   * Left alone because their access ended less than KEEP_AFTER_EXPIRY_DAYS
   * ago - inside the grace period, not forgotten.
   */
  heldForRecentExpiry: number;
}

export const EMPTY_AUDIO_SWEEP: AudioSweep = { eligible: 0, heldForLiveAccess: 0, heldForRecentExpiry: 0 };

/**
 * How long a candidate's audio is kept after their access ends.
 *
 * THIS IS THE POLICY. Everything else in this file is the safety net under it.
 * The sentence it is meant to make true is "we keep your recordings for three
 * months after your access ends" - a promise keyed to the customer's own dates
 * rather than to our billing calendar, and the same for every recording they
 * ever made: one purchase, one deletion date.
 *
 * It replaced a rule keyed to each recording's own age, which gave a customer
 * no date they could predict - their last case outlived their first by four
 * months for no reason anybody could defend.
 */
const KEEP_AFTER_EXPIRY_DAYS = 90;

/**
 * Recordings looked at per sweep.
 *
 * This cap was always here — supabase-js stops at 1000 rows by default and
 * the query never said otherwise, so "eligible" has silently meant "eligible,
 * up to a thousand" the whole time. Written down now that a cron runs it with
 * nobody watching, and lowered, because a run that deletes 500 recordings'
 * audio has to finish inside a serverless function's timeout. The sweep is
 * daily and catching up over several days costs nothing.
 */
const ROWS_PER_SWEEP = 500;

/**
 * Paths per storage call.
 *
 * Up to three files hang off each recording, so an unchunked sweep would hand
 * Supabase 1500 paths in one request. Chunked, a failure costs one batch
 * instead of the run.
 */
const PATHS_PER_CALL = 100;

/**
 * Audio whose keeping period has run out.
 *
 * THREE CONDITIONS, and only the middle one is the policy:
 *
 *   1. the recording is past the age floor (`beforeDate`, the caller's)
 *   2. their access ended over KEEP_AFTER_EXPIRY_DAYS ago
 *   3. their access is not live right now
 *
 * WHY THE FLOOR IS NOT A SECOND POLICY. A recording can only be made while
 * access is live, so created_at <= case_bank_expires_at for every row that
 * exists. Add the same number of days to both and created_at + 90 always
 * falls on or before expiry + 90 - so for any candidate whose expiry date is
 * sane, condition 2 is the binding one and the floor decides nothing. The
 * floor only bites when the date is ABSENT, NULLED or BACK-DATED, which are
 * exactly the states that would otherwise delete a paying customer's audio
 * the same night. It costs nothing and bounds every one of them.
 *
 * That matters because this column is not only a subscription date. It holds
 * hand-typed admin dates from an input with no `min`, forever-sentinels for
 * staff (2099 and 2999 both exist), and NULL - which means both "revoked" and
 * "never granted". Keying permanent deletion to it alone, with no floor, was
 * measured as a one-keystroke path to destroying a whole account's audio.
 *
 * ABSENT EVIDENCE IS ELIGIBLE, NOT EXEMPT: no access row, no doctor on the
 * recording, or a NULL expiry all age out at the floor. The opposite reading
 * is tidier to argue for and it is how 989 MB accumulated - a row that
 * nothing can ever judge is a row whose audio is kept for ever.
 *
 * TWO READ FAILURES GO THE OTHER WAY, because they are OUR fault rather than
 * a fact about the customer: a failed query yields nothing eligible rather
 * than everything, and a date that will not parse holds the audio so somebody
 * can go and look at the row.
 *
 * NULL IS CHECKED BEFORE PARSING, NOT BY THE PARSE. new Date(null).getTime()
 * is 0 - the Unix epoch, which is finite and reads as a date fifty-six years
 * past. The unreadable-date guard below does NOT catch absence, so an
 * implementation leaning on it would treat every revoked customer as long
 * expired and delete their audio that night.
 */
export async function findOldCandidateAudio(
  beforeDate: string
): Promise<{ rows: AudioRow[]; sweep: AudioSweep }> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { rows: [], sweep: EMPTY_AUDIO_SWEEP };

  const { data, error } = await supabase
    .from("station_recordings")
    .select("id, doctor_user_id, doctor_audio_path, patient_audio_path, examiner_voice_note_path")
    .is("audio_deleted_at", null)
    .lt("created_at", beforeDate)
    .or("doctor_audio_path.not.is.null,patient_audio_path.not.is.null,examiner_voice_note_path.not.is.null")
    // Oldest first. Without an order the 500 are whatever the planner hands
    // back, so a window full of held rows could repeat nightly while eligible
    // ones outside it are never reached - a sweep reporting "0 deleted" while
    // storage climbs, which is the failure this module exists to end.
    .order("created_at", { ascending: true })
    .limit(ROWS_PER_SWEEP)
    .returns<(AudioRow & { doctor_user_id: string | null })[]>();
  // supabase-js returns { data, error } rather than throwing. A failed read
  // must look like "nothing to delete", never like "everything is eligible".
  if (error || !data) return { rows: [], sweep: EMPTY_AUDIO_SWEEP };
  if (data.length === 0) return { rows: [], sweep: EMPTY_AUDIO_SWEEP };

  const doctorIds = [...new Set(data.map((r) => r.doctor_user_id).filter((id): id is string => !!id))];
  const { data: accessRows, error: accessError } = doctorIds.length
    ? await supabase
        .from("user_access")
        .select("user_id, has_case_bank, case_bank_expires_at")
        .in("user_id", doctorIds)
        .returns<{ user_id: string; has_case_bank: boolean | null; case_bank_expires_at: string | null }[]>()
    : { data: [] as { user_id: string; has_case_bank: boolean | null; case_bank_expires_at: string | null }[], error: null };

  /*
    The access read failing is the one case that must not be allowed to look
    like "none of these candidates has access", which is the reading that
    would delete every one of them.
  */
  if (accessError || !accessRows) {
    return { rows: [], sweep: { eligible: 0, heldForLiveAccess: data.length, heldForRecentExpiry: 0 } };
  }

  const now = Date.now();
  const graceEnds = now - KEEP_AFTER_EXPIRY_DAYS * 86_400_000;

  /** Why one candidate's audio is or is not ready to go. */
  type Verdict = "live" | "in-grace" | "expired";

  const verdicts = new Map<string, Verdict>();
  for (const a of accessRows) {
    // Absence first. See the note above on new Date(null) reading as 1970:
    // this branch is what stops a revoked customer looking long expired.
    if (!a.case_bank_expires_at) {
      verdicts.set(a.user_id, "expired");
      continue;
    }
    const expiry = new Date(a.case_bank_expires_at).getTime();
    if (!Number.isFinite(expiry)) {
      // Our data problem, not a fact about them. Hold it.
      verdicts.set(a.user_id, "live");
      continue;
    }
    if (a.has_case_bank && expiry > now) {
      verdicts.set(a.user_id, "live");
      continue;
    }
    verdicts.set(a.user_id, expiry < graceEnds ? "expired" : "in-grace");
  }

  let heldForLiveAccess = 0;
  let heldForRecentExpiry = 0;
  const rows = data.filter((r) => {
    // No doctor, or no access row for them: nobody's grace period to sit in,
    // and the age floor has already been cleared to get this far.
    const verdict = r.doctor_user_id ? verdicts.get(r.doctor_user_id) ?? "expired" : "expired";
    if (verdict === "live") { heldForLiveAccess += 1; return false; }
    if (verdict === "in-grace") { heldForRecentExpiry += 1; return false; }
    return true;
  });

  return { rows, sweep: { eligible: rows.length, heldForLiveAccess, heldForRecentExpiry } };
}

/**
 * Removes the audio files for everything eligible before `beforeDate`.
 *
 * Eligibility is recomputed here rather than trusting a count the caller was
 * holding, which may have been fetched before somebody renewed.
 *
 * Deletes the audio files only — the transcript, the AI grades, the GP's
 * marks and their written feedback all stay, so the report still reads in
 * full. Trainer Insight and Sample Consultation audio, which is curated
 * content in a different bucket, is never touched.
 */
export async function pruneCandidateAudioBefore(
  beforeDate: string
): Promise<{ error?: string; deleted?: number }> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Database not available." };

  const { rows } = await findOldCandidateAudio(beforeDate);
  if (rows.length === 0) return { deleted: 0 };

  const paths = rows.flatMap((r) =>
    [r.doctor_audio_path, r.patient_audio_path, r.examiner_voice_note_path].filter((p): p is string => !!p)
  );
  /*
    Storage first, then the row.

    The other order would stamp audio_deleted_at over files still sitting in
    the bucket, and that stamp excludes a row from the next sweep — so the
    files would be orphaned beyond the reach of the only thing that removes
    them. Doing storage first means the worst case is a file deleted while its
    row still points at it, which the next sweep picks up and finishes.

    A failed batch abandons the run WITHOUT stamping anything, so earlier
    batches may already be gone from the bucket while their rows still name
    them. That is safe to retry: removing a path that is no longer there is
    not an error, so the next sweep re-fetches the same rows, re-removes what
    is left and converges.
  */
  for (let i = 0; i < paths.length; i += PATHS_PER_CALL) {
    const batch = paths.slice(i, i + PATHS_PER_CALL);
    const { error: storageError } = await supabase.storage.from("consultation-recordings").remove(batch);
    if (storageError) {
      return {
        error: `Storage delete failed on paths ${i + 1}-${i + batch.length} of ${paths.length}; no rows were changed, so the next sweep retries: ${storageError.message}`,
      };
    }
  }

  const { error } = await supabase
    .from("station_recordings")
    .update({
      doctor_audio_path: null,
      patient_audio_path: null,
      examiner_voice_note_path: null,
      audio_deleted_at: new Date().toISOString(),
    })
    .in("id", rows.map((r) => r.id));

  if (error) return { error: error.message };
  return { deleted: rows.length };
}
