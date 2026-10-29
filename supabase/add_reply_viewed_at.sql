-- When the candidate read the reply to their feedback.
--
-- The envelope now carries two kinds of thing: a GP review, which has
-- candidate_viewed_at on station_recordings, and a reply to feedback, which
-- had nowhere to record that it had been seen. Without this the badge could
-- never clear for a reply, so one answered question would sit on the envelope
-- for the life of the account.
--
-- Deliberately a separate column from `resolved`. Resolved is the admin's
-- state — "I have dealt with this" — and is set when the reply is sent. This
-- is the candidate's, and only they can set it. Reusing one for both would
-- mark a reply read the moment it was written.
--
-- Read with the same rule as a review: unread when replied_at is set and
-- reply_viewed_at is null or older than it. That second half matters — an
-- admin can reply again after the first was read, and a bare null check would
-- call the new one read.

alter table station_reports
  add column if not exists reply_viewed_at timestamptz;

-- Applied to production 2026-10-29.
