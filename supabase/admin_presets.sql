-- ============================================================================
-- Admin preset settings
-- Run once in the Supabase SQL editor to seed the settings used by the admin
-- "Presets" page. These become the default values when creating a new event.
-- Safe to re-run — uses ON CONFLICT DO NOTHING.
-- ============================================================================

insert into settings (key, value) values
  ('DEFAULT_WEBINAR_TITLE',               'How To Get A Clear Pass'),
  ('DEFAULT_WEBINAR_CAPACITY',            '200'),
  ('DEFAULT_WEBINAR_START',               '18:00'),
  ('DEFAULT_WEBINAR_END',                 '20:00'),
  ('DEFAULT_WEBINAR_DESCRIPTION',         '2-hour free training on what examiners are scoring.'),
  ('DEFAULT_INTENSIVE_TITLE',             'SCA Intensive'),
  ('DEFAULT_INTENSIVE_ACTIVE_CAPACITY',   '2'),
  ('DEFAULT_INTENSIVE_ACTIVE_PRICE',      '20000'),
  ('DEFAULT_INTENSIVE_OBSERVER_CAPACITY', '8'),
  ('DEFAULT_INTENSIVE_OBSERVER_PRICE',    '5000'),
  ('DEFAULT_INTENSIVE_START',             '10:00'),
  ('DEFAULT_INTENSIVE_END',               '12:00'),
  ('DEFAULT_INTENSIVE_DESCRIPTION',       'Small-group live workshop. Two active candidates, three consultations each.')
on conflict (key) do nothing;
