create table if not exists homepage_videos (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  bunny_video_id text,
  display_order integer not null default 1,
  published boolean not null default false,
  created_at timestamptz default now()
);
