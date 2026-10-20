-- Normalise consultation_type casing.  APPLIED TO PRODUCTION 2026-10-20.
--
-- The column held four values for two types:
--
--   Telephone Consultation   83
--   Telephone consultation   68
--   Video Consultation       63
--   Video consultation       32
--
-- Two problems, one of them live.
--
-- Grouping or filtering on this column split every type roughly in half, so
-- any count of "how many telephone stations are there" was wrong.
--
-- Worse, the admin editor offers exactly two options, both title case
-- (app/admin/stations/StationForm.tsx:397-398), and sets defaultValue from
-- the stored string.  A lowercase row matches neither option, so the browser
-- falls back to the first one and the select silently reads "Video
-- Consultation".  Opening one of those 100 stations and saving anything at
-- all would have rewritten its type.  68 telephone stations were one click
-- from becoming video stations.
--
-- Title case wins because it is what the form writes and what the newer half
-- of the rows already use.

update public.stations
set consultation_type = case consultation_type
      when 'Telephone consultation' then 'Telephone Consultation'
      when 'Video consultation'     then 'Video Consultation'
      else consultation_type
    end,
    updated_at = now()
where consultation_type in ('Telephone consultation', 'Video consultation');

-- Result: 151 Telephone Consultation, 95 Video Consultation, 246 total.
--
-- Not added here: a CHECK constraint pinning the column to those two values.
-- It would stop this recurring, but it is a schema change rather than a data
-- fix and deserves its own decision, including what should happen to a future
-- third type such as a face-to-face station.
