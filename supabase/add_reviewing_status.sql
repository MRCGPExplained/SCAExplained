-- Add 'reviewing' to station_recordings status check constraint
ALTER TABLE station_recordings DROP CONSTRAINT IF EXISTS station_recordings_status_check;

ALTER TABLE station_recordings
  ADD CONSTRAINT station_recordings_status_check
  CHECK (status IN ('uploading', 'processing', 'pending_examiner', 'reviewing', 'reviewed', 'sent', 'failed'));
