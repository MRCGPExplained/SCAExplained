-- Migrate video_course_systems from YouTube to Bunny Stream
-- Run in Supabase SQL editor

alter table video_course_systems
  add column if not exists bunny_video_id text,
  add column if not exists thumbnail_url text,
  add column if not exists duration_minutes integer;

-- youtube_url is retained for backwards compatibility but no longer used by the app
