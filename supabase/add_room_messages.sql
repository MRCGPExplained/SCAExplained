-- Persistent chat messages for study rooms (retained 48 hours)
create table if not exists room_messages (
  id           uuid        primary key default gen_random_uuid(),
  room_id      uuid        not null references study_rooms(id) on delete cascade,
  user_id      uuid        not null,
  display_name text        not null,
  message      text        not null,
  created_at   timestamptz not null default now()
);

alter table room_messages enable row level security;

create policy "authenticated users can read room messages"
  on room_messages for select
  using (auth.uid() is not null);

create policy "authenticated users can insert own messages"
  on room_messages for insert
  with check (auth.uid() = user_id);

-- Enable realtime so new inserts are pushed to subscribers
alter publication supabase_realtime add table room_messages;

-- Optional: schedule auto-cleanup with pg_cron (run in Supabase SQL editor if pg_cron is enabled)
-- select cron.schedule(
--   'delete-old-room-messages',
--   '0 * * * *',
--   $$ delete from room_messages where created_at < now() - interval '48 hours'; $$
-- );
