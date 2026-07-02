-- ============================================================
-- Migration: user_access + video_course_systems
-- Run in Supabase SQL Editor BEFORE deploying the code update.
-- ============================================================

-- 1. New unified access table
create table if not exists user_access (
  user_id              uuid references auth.users primary key,
  has_video_course     boolean not null default false,
  has_case_bank        boolean not null default false,
  expires_at           timestamptz,
  renewal_reminder_sent_at timestamptz
);
alter table user_access enable row level security;
create policy "Users read own access" on user_access
  for select using (auth.uid() = user_id);

-- 2. Migrate any existing case_bank_access rows
insert into user_access (user_id, has_case_bank, expires_at)
select user_id, true, max(expires_at)
from case_bank_access
group by user_id
on conflict (user_id) do update
  set has_case_bank = true,
      expires_at    = greatest(user_access.expires_at, excluded.expires_at);

-- 3. Drop the stations RLS policy that references case_bank_access,
--    then recreate it pointing at user_access.
drop policy if exists "Authenticated users with active access can read published stati" on stations;

create policy "Authenticated users with active access can read published stations"
  on stations for select using (
    published = true
    and exists (
      select 1 from user_access
      where user_access.user_id = auth.uid()
        and user_access.has_case_bank = true
        and user_access.expires_at > now()
    )
  );

-- 4. Now safe to drop old tables
drop table if exists case_bank_access;
drop table if exists case_bank_reminders_sent;

-- 5. Video course systems table
create table if not exists video_course_systems (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  description   text,
  youtube_url   text,
  display_order integer not null,
  published     boolean not null default false,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);
alter table video_course_systems enable row level security;
create policy "Authenticated users read published systems" on video_course_systems
  for select using (auth.uid() is not null and published = true);
