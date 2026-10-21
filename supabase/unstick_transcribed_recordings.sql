-- Recordings that finished transcribing but never had their status advanced.
--
-- The transcribe stage used to write the transcript and the status in two
-- separate updates, with the Deepgram billing insert between them. A function
-- killed in that window (maxDuration is 300s, and two twelve-minute tracks
-- have to be downloaded and transcribed inside it) left a row holding a
-- complete, readable transcript while its status still said "processing",
-- which the UI renders as "Transcribing…". Nothing in the system ever
-- unsticks such a row: there is no retry and no sweeper.
--
-- The pipeline now writes both in one update, so this cannot recur. These
-- queries clean up anything already stuck.

-- 1. LOOK FIRST. Anything this returns is a finished transcript wearing the
--    wrong status. Check the word count looks like a real consultation before
--    moving anything.
select
  id,
  station_number,
  station_title,
  status,
  started_at,
  length(transcript_formatted)                                   as transcript_chars,
  array_length(regexp_split_to_array(trim(transcript_formatted), '\s+'), 1) as words,
  doctor_audio_path is not null                                  as has_doctor_audio,
  patient_audio_path is not null                                 as has_patient_audio,
  ai_error
from public.station_recordings
where status = 'processing'
  and transcript_formatted is not null
  and trim(transcript_formatted) <> ''
order by started_at desc;

-- 2. THEN FIX. Only rows with a transcript long enough to be a real
--    consultation: the pipeline refuses to grade anything under 15 words, so
--    promoting a shorter one would offer the candidate a take that cannot be
--    graded. transcribed_at is backfilled from started_at because the real
--    completion time was never recorded.
update public.station_recordings
set status = 'transcribed',
    transcribed_at = coalesce(transcribed_at, started_at, now())
where status = 'processing'
  and transcript_formatted is not null
  and array_length(regexp_split_to_array(trim(transcript_formatted), '\s+'), 1) >= 15;

-- 3. CHECK. Should return the rows now sitting at "transcribed", which the
--    app shows as "Your call" with the AI / GP / discard choice.
select id, station_number, station_title, status, transcribed_at
from public.station_recordings
where status = 'transcribed'
order by transcribed_at desc nulls last
limit 20;

-- Separately, to answer "did the patient audio actually upload": a row with
-- patient_audio_path null never received the second track. The paths point
-- into the "consultation-recordings" storage bucket.
--
-- select id, station_title, started_at, doctor_audio_path, patient_audio_path
-- from public.station_recordings
-- where patient_audio_path is null
-- order by started_at desc limit 20;
