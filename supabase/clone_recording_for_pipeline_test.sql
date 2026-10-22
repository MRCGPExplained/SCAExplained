-- Clone a finished recording so the pipeline can be re-run over audio that
-- already exists, without recording another twelve minutes.
--
-- The clone points at the SAME two files in the consultation-recordings
-- bucket. Nothing is copied in storage and the original row is untouched.
--
-- Written with jsonb_populate_record rather than a column list on purpose:
-- naming columns means knowing all of them, and a single wrong guess fails
-- the whole statement. to_jsonb(r) takes the row as it actually is, and the
-- object merged over it overrides only the handful that must differ.

insert into public.station_recordings
select *
from jsonb_populate_record(
  null::public.station_recordings,
  to_jsonb(r) || jsonb_build_object(
    'id',                   gen_random_uuid(),
    'station_title',        r.station_title || ' (pipeline test)',
    -- Empty, so Deepgram genuinely runs again rather than the route reusing
    -- the stored transcript and skipping straight to grading.
    'transcript_formatted', null,
    'transcript_raw',       null,
    -- The transcribe stage refuses to start from anything but this.
    'status',               'processing',
    'started_at',           now(),
    'ended_at',             now(),
    'transcribed_at',       null,
    'ai_graded_at',         null,
    'ai_error',             null,
    'ai_failed_at',         null,
    'gp_requested_at',      null,
    'discarded_at',         null,
    'sent_to_candidate_at', null,
    'candidate_viewed_at',  null
  )
) as t
from public.station_recordings r
where r.id = 'c1ede096-fd0f-4d27-a78d-4601b9e9b0bf'
returning id, status, station_title, doctor_audio_path, patient_audio_path;

-- Then, in the browser console on scafocus.com while signed in:
--
--   fetch('/api/recordings/<the id above>/process?stage=transcribe', { method: 'POST' })
--     .then(r => r.text()).then(console.log)
--
-- Watch /recordings: the bar should move and the chip should reach
-- "Your call" without a refresh.

-- Afterwards:
-- delete from public.station_recordings where station_title like '%(pipeline test)';
