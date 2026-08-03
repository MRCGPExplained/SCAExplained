-- Add payment tracking column to station_recordings
ALTER TABLE station_recordings
  ADD COLUMN IF NOT EXISTS examiner_paid_at TIMESTAMPTZ;
