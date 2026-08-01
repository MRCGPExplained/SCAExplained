-- Site-wide settings key/value store
CREATE TABLE IF NOT EXISTS site_settings (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL DEFAULT ''
);

-- Recording bypass: when enabled, users whose email is in examiners table
-- OR in the bypass_emails list can record without spending credits.
INSERT INTO site_settings (key, value) VALUES ('recording_bypass_enabled', 'false') ON CONFLICT DO NOTHING;
INSERT INTO site_settings (key, value) VALUES ('recording_bypass_emails',  '')      ON CONFLICT DO NOTHING;
