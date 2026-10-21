-- station_recordings_status_check rejects the statuses the app now writes.
--
-- THIS IS THE ACTUAL CAUSE of a recording sitting on "Transcribing…" with a
-- complete transcript, and it has to be applied BEFORE the matching code
-- change, not after.
--
-- The two-stage pipeline (transcribe, then grade only when the candidate asks)
-- introduced the "transcribed" status. The CHECK constraint was never widened
-- to allow it. supabase-js does not throw on a rejected write: it returns
-- { data, error }, and the pipeline never read .error. So the update to
-- "transcribed" was refused by Postgres, the refusal was discarded unread,
-- the function returned normally, and the row kept its old status forever.
-- No exception, no log line, nothing to find afterwards.
--
-- Run step 1, read it, then step 2.

-- 1. WHAT THE CONSTRAINT ACTUALLY ALLOWS TODAY. Read this before changing it:
--    the list below is what the app uses, but your database is the authority
--    on what is currently in there and what rows already exist.
select pg_get_constraintdef(oid) as current_definition
from pg_constraint
where conrelid = 'public.station_recordings'::regclass
  and conname = 'station_recordings_status_check';

-- Every status value actually present in the table right now, so nothing in
-- use gets excluded by the new constraint.
select status, count(*) as rows
from public.station_recordings
group by status
order by rows desc;

-- 2. WIDEN IT. The full set the application reads or writes:
--      uploading        - audio still arriving
--      processing       - transcribing (what the UI shows as "Transcribing…")
--      transcribed      - transcript ready, waiting on the candidate's choice
--      grading          - AI grading in progress
--      ai_graded        - AI grading finished, or rolled back after a failure
--      pending_examiner - submitted for GP review
--      reviewing        - a GP has it open
--      reviewed         - GP review finished
--      discarded        - candidate threw the take away
--      failed           - transcription failed; needs a retry
--
-- Dropping and recreating in one statement so the table is never without a
-- constraint. If step 1 shows a status in use that is missing from this list,
-- ADD IT HERE before running this.
alter table public.station_recordings
  drop constraint if exists station_recordings_status_check;

alter table public.station_recordings
  add constraint station_recordings_status_check
  check (status in (
    'uploading',
    'processing',
    'transcribed',
    'grading',
    'ai_graded',
    'pending_examiner',
    'reviewing',
    'reviewed',
    'discarded',
    'failed'
  ));

-- 3. NOW the stuck rows can be moved. This is the update that was rejected.
update public.station_recordings
set status = 'transcribed',
    transcribed_at = coalesce(transcribed_at, started_at, now())
where status = 'processing'
  and transcript_formatted is not null
  and array_length(regexp_split_to_array(trim(transcript_formatted), '\s+'), 1) >= 15;

-- 4. CHECK.
select id, station_number, station_title, status, transcribed_at
from public.station_recordings
order by started_at desc
limit 20;
