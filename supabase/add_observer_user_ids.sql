-- station_recordings.observer_user_ids — already applied to production on
-- 2026-10-27. Kept here so the checked-in schema matches the database.
--
-- That is not bookkeeping for its own sake. Earlier the same day an agent read
-- supabase/case_bank_schema.sql, saw `Host can update room` on study_rooms, and
-- reported that a non-host's role change would silently do nothing. Production
-- had `Participant can update room` with check true, so the write really did
-- land and really could take a room out from under its host. The file and the
-- database had drifted and the file was believed. Any column added from a tool
-- rather than from here needs writing down, or the next person reads a schema
-- that is quietly wrong.
--
-- Safe to re-run: IF NOT EXISTS, nullable, no default, no backfill. Recordings
-- made before this simply have no observers.

alter table public.station_recordings
  add column if not exists observer_user_ids uuid[];

comment on column public.station_recordings.observer_user_ids is
  'Everyone who was in the room for this take but was neither doctor nor patient, snapshotted when the recording starts. room_participants rows are deleted on leave, so this is the only lasting record that an observer was present.';

-- No RLS change. Both sides use the service-role client: the write is in
-- startRecordingAction (app/case-bank/actions.ts) and the read is the
-- last-attempt fold behind app/case-bank/page.tsx, which reaches for
-- getSupabaseAdmin() precisely so it can see takes the viewer only watched.
