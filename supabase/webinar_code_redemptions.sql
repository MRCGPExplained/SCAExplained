-- Track per-user code redemptions (prevents reuse of same code by same account)
CREATE TABLE IF NOT EXISTS webinar_code_redemptions (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  code_id    UUID NOT NULL REFERENCES webinar_codes(id) ON DELETE CASCADE,
  redeemed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, code_id)
);

ALTER TABLE webinar_code_redemptions ENABLE ROW LEVEL SECURITY;

-- Add configurable max uses to webinar_codes (default 10)
ALTER TABLE webinar_codes
  ADD COLUMN IF NOT EXISTS max_uses INT NOT NULL DEFAULT 10;
