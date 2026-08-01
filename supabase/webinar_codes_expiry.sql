-- Add optional expiry date to webinar_codes
-- A code with expires_at = NULL never expires (existing behaviour).
ALTER TABLE webinar_codes ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ DEFAULT NULL;
