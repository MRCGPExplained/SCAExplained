-- ============================================================
-- Migration: consolidate to has_programme + live session URL
-- Run in Supabase SQL Editor
-- ============================================================

-- 1. Drop old user_access and recreate with has_programme only
drop table if exists user_access cascade;

create table user_access (
  user_id                  uuid references auth.users primary key,
  has_programme            boolean not null default false,
  expires_at               timestamptz,
  renewal_reminder_sent_at timestamptz
);

alter table user_access enable row level security;

create policy "Users read own access" on user_access
  for select using (auth.uid() = user_id);

-- 2. Rebuild stations RLS against has_programme
drop policy if exists "Authenticated users with active access can read published stations" on stations;
drop policy if exists "Authenticated users with active access can read published stati" on stations;

create policy "Programme subscribers can read published stations"
  on stations for select using (
    published = true
    and exists (
      select 1 from user_access
      where user_access.user_id = auth.uid()
        and user_access.has_programme = true
        and user_access.expires_at > now()
    )
  );

-- 3. Rebuild video_course_systems RLS against has_programme
drop policy if exists "Authenticated users read published systems" on video_course_systems;

create policy "Programme subscribers read published systems"
  on video_course_systems for select using (
    published = true
    and exists (
      select 1 from user_access
      where user_access.user_id = auth.uid()
        and user_access.has_programme = true
        and user_access.expires_at > now()
    )
  );

-- 4. Add Live Session Zoom URL to settings
insert into settings (key, value)
values ('LIVE_SESSION_ZOOM_URL', '')
on conflict (key) do nothing;
