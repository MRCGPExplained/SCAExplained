-- Auto-cleanup cron jobs (run once in Supabase SQL editor)
-- Requires pg_cron, which is enabled by default on Supabase Pro plans.
-- To check: select * from pg_extension where extname = 'pg_cron';
--
-- NOTE: superseded by supabase/room_activity_tracking.sql which adds
-- last_activity_at tracking and 14-day inactivity-based deletion.
-- Run room_activity_tracking.sql instead of this file.

-- 1. Delete room chat messages older than 48 hours (runs every hour)
select cron.schedule(
  'delete-old-room-messages',
  '0 * * * *',
  $$ delete from room_messages where created_at < now() - interval '48 hours'; $$
);

-- 2. Delete study rooms older than 24 hours (cascade removes participants + messages)
--    Rooms are ephemeral session objects — no need to keep them permanently.
select cron.schedule(
  'delete-old-study-rooms',
  '30 * * * *',
  $$ delete from study_rooms where created_at < now() - interval '24 hours'; $$
);
