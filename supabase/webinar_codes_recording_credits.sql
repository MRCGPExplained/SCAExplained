-- Add per-code configurable recording credits to webinar_codes
ALTER TABLE webinar_codes
  ADD COLUMN IF NOT EXISTS recording_credits INT NOT NULL DEFAULT 3;
