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
  /** Old enough, but left alone because the candidate's programme is live. */
  heldForLiveAccess: number;
}

export const EMPTY_AUDIO_SWEEP: AudioSweep = { eligible: 0, heldForLiveAccess: 0 };

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
 * Audio old enough to remove, from candidates who no longer have access.
 *
 * Two conditions, not one. Age says nobody is likely to want it; access says
 * nobody can still be using it. Age alone used to decide, which meant a
 * customer four months into a live programme lost the audio of their own
 * consultation — and the GP's spoken feedback on it — at ninety days, while
 * they were still paying to work through it.
 *
 * "Has access" is the product's own test, from lib/case-bank-access.ts:
 * has_case_bank set AND an expiry still in the future. Both halves, because
 * either alone is a different question. A candidate who has it keeps their
 * audio however old it is; the sweep comes back to them once it runs out.
 *
 * A read that fails yields nothing eligible rather than everything — that is
 * the one failure here that could delete an entire table's audio.
 *
 * Expiry is compared as an instant rather than as an ISO string. The rest of
 * the product compares case_bank_expires_at to an ISO string directly, which
 * works there because the values are years from now; it is not a thing to rely
 * on where being wrong deletes what somebody paid for.
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
    return { rows: [], sweep: { eligible: 0, heldForLiveAccess: data.length } };
  }

  const now = Date.now();
  const liveAccess = new Set(
    accessRows
      .filter((a) => {
        if (!a.has_case_bank || !a.case_bank_expires_at) return false;
        const expiry = new Date(a.case_bank_expires_at).getTime();
        // An unreadable date is not an expired one. Treated as live, so the
        // audio stays and somebody can look at the row.
        return !Number.isFinite(expiry) || expiry > now;
      })
      .map((a) => a.user_id)
  );

  const rows = data.filter((r) => !(r.doctor_user_id && liveAccess.has(r.doctor_user_id)));
  return { rows, sweep: { eligible: rows.length, heldForLiveAccess: data.length - rows.length } };
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
