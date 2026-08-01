-- Admin passcodes: additional named admin logins beyond the ADMIN_PASSWORD env var
CREATE TABLE IF NOT EXISTS admin_passcodes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  passcode text NOT NULL,
  created_at timestamptz DEFAULT now()
);
