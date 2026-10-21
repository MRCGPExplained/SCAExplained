-- station_recordings_status_check must allow every status the app writes.
--
-- WHY THIS EXISTS. The two-stage pipeline (transcribe, then grade only when
-- the candidate asks) introduced the "transcribed" status. The constraint,
-- last set in add_reviewing_status.sql, was never widened for it. supabase-js
-- does not throw on a rejected write: it returns { data, error }, and the
-- pipeline never read .error. So the update to "transcribed" was refused by
-- Postgres, the refusal was discarded unread, the function returned as though
-- it had worked, and the row kept status "processing" forever — rendered in
-- the UI as "Transcribing…" over a complete, readable transcript.
--
-- ============================================================================
-- IF YOU ALREADY RAN THE EARLIER VERSION OF THIS FILE, RUN SECTION 0 NOW.
-- That version omitted 'sent', which app/examiner/actions.ts:256 still writes
-- when a GP submits a review with send-now. With 'sent' missing the write is
-- refused, and that call does not check its error either, so a GP's completed
-- review would silently fail to reach the candidate. Section 0 is the whole
-- fix and is safe to run on its own.
-- ============================================================================

-- 0. THE CORRECTED CONSTRAINT. Idempotent: run it even if you ran the earlier
--    version, and run it instead of section 2 if you have not.
alter table public.station_recordings
  drop constraint if exists station_recordings_status_check;

alter table public.station_recordings
  add constraint station_recordings_status_check
  check (status in (
    'uploading',         -- audio still arriving
    'processing',        -- transcribing; the UI shows "Transcribing…"
    'transcribed',       -- transcript ready, waiting on the candidate's choice
    'grading',           -- AI grading in progress
    'ai_graded',         -- AI grading finished, or rolled back after a failure
    'pending_examiner',  -- submitted for GP review
    'reviewing',         -- a GP has it open
    'reviewed',          -- GP review finished
    'sent',              -- GP review sent to the candidate
    'discarded',         -- candidate threw the take away
    'failed'             -- transcription failed; needs a retry
  ));

-- 1. VERIFY. Every status present in the table must appear in the list above;
--    if this returns anything unexpected, add it and re-run section 0.
select status, count(*) as rows
from public.station_recordings
group by status
order by rows desc;

-- 2. UNSTICK anything left on "processing" that already has a usable
--    transcript. The pipeline refuses to grade under 15 words, so promoting a
--    shorter one would offer a take that cannot be graded. transcribed_at is
--    backfilled from started_at because the real completion time was lost.
update public.station_recordings
set status = 'transcribed',
    transcribed_at = coalesce(transcribed_at, started_at, now())
where status = 'processing'
  and transcript_formatted is not null
  and array_length(regexp_split_to_array(trim(transcript_formatted), '\s+'), 1) >= 15;

-- 3. STUCK UPLOADS. Rows sitting on "uploading" never had both tracks arrive.
--    Look before deciding: one missing path means that participant's browser
--    never finished, and there is no retry or sweeper for it.
select id, station_number, station_title, started_at,
       doctor_audio_path  is not null as has_doctor_audio,
       patient_audio_path is not null as has_patient_audio
from public.station_recordings
where status = 'uploading'
order by started_at desc;
