-- Run this in Supabase SQL Editor

create table if not exists live_sessions (
  id uuid primary key default gen_random_uuid(),
  zoom_url text not null,
  scheduled_at timestamptz not null,
  created_at timestamptz not null default now()
);

alter table live_sessions enable row level security;

-- Anyone can read (public page)
create policy "Public can read live_sessions"
  on live_sessions for select
  using (true);
