-- Audio cleanup cron job (run once in Supabase SQL editor)
-- Requires pg_cron (enabled by default on Supabase Pro plans).
-- Marks audio paths as deleted on recordings older than 3 months.
-- The actual storage deletion must be triggered separately via a cleanup
-- function or Edge Function that calls storage.remove() for those paths.
--
-- After running this SQL, schedule the Edge Function separately, or use
-- a nightly function that queries WHERE audio_deleted_at IS NULL
-- AND created_at < now() - interval '3 months'.

-- Schedule a daily job to flag recordings for audio deletion after 3 months.
select cron.schedule(
  'mark-audio-for-deletion',
  '0 3 * * *',  -- 3 AM UTC daily
  $$
    update station_recordings
    set audio_deleted_at = now()
    where audio_deleted_at is null
      and created_at < now() - interval '3 months'
      and (doctor_audio_path is not null or patient_audio_path is not null);
  $$
);
