-- Add FK from station_recordings.examiner_id → examiners.id
-- This is required for Supabase's join syntax: examiners(name)
ALTER TABLE station_recordings
  ADD CONSTRAINT station_recordings_examiner_id_fkey
  FOREIGN KEY (examiner_id) REFERENCES examiners(id) ON DELETE SET NULL;
