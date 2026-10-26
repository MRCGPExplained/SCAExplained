-- Model Consultation: a real take, chosen by an admin, shown on the station.
--
-- Sits in the Trainer Insight tab between the trainer's recording and Common
-- Questions, and is hidden when empty, like the two blocks either side of it.
--
-- Two audio columns because a consultation is two files, not one: each
-- browser records its own track and DualTrackPlayer plays them in sync. The
-- same component the examiner view already uses renders this.
--
-- The files are COPIED into the audio-lessons bucket rather than referenced
-- where they are. consultation-recordings is candidate storage and
-- deleteOldCandidateAudioAction empties it on a retention sweep; a reference
-- would also break the moment the trainee discarded their own take, which
-- they may do at any time.
--
-- recording_id is kept for provenance — which take this came from, so it can
-- be traced back to the people who agreed to it — and is deliberately not a
-- foreign key: the source row may be deleted later and that must not take
-- the published model consultation with it.

alter table public.stations
  add column if not exists model_consultation_doctor_url   text,
  add column if not exists model_consultation_patient_url  text,
  add column if not exists model_consultation_transcript   text,
  add column if not exists model_consultation_recording_id uuid,
  add column if not exists model_consultation_added_at     timestamptz;

comment on column public.stations.model_consultation_recording_id is
  'The station_recordings row this was copied from. Provenance only: not a
   foreign key, because deleting the original take must not remove the
   published copy.';

-- Check: nothing set yet on any station.
select count(*) filter (where model_consultation_doctor_url is not null) as with_model_consultation,
       count(*) as stations
from public.stations;
