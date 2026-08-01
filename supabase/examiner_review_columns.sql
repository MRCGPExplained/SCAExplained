-- Add examiner review columns to station_recordings
-- Safe to run multiple times (IF NOT EXISTS / IF NOT EXISTS checks)

ALTER TABLE station_recordings
  ADD COLUMN IF NOT EXISTS examiner_id UUID REFERENCES examiners(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS examiner_data_gathering TEXT,
  ADD COLUMN IF NOT EXISTS examiner_clinical_management TEXT,
  ADD COLUMN IF NOT EXISTS examiner_relating_to_others TEXT,
  ADD COLUMN IF NOT EXISTS examiner_comment_data_gathering TEXT,
  ADD COLUMN IF NOT EXISTS examiner_comment_clinical_management TEXT,
  ADD COLUMN IF NOT EXISTS examiner_comment_relating_to_others TEXT,
  ADD COLUMN IF NOT EXISTS examiner_overall_comment TEXT,
  ADD COLUMN IF NOT EXISTS examiner_voice_note_path TEXT,
  ADD COLUMN IF NOT EXISTS examiner_reviewed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS sent_to_candidate_at TIMESTAMPTZ;
