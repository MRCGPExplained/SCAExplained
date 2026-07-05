-- Room activity tracking + 14-day inactivity cleanup
-- Run in Supabase SQL editor (two separate queries if needed to avoid deadlocks)

-- 1. Add last_activity_at to study_rooms
alter table study_rooms
  add column if not exists last_activity_at timestamptz not null default now();

-- Backfill existing rows from created_at
update study_rooms set last_activity_at = created_at where true;

-- 2. Trigger: bump last_activity_at whenever the room row itself is updated
--    (covers station changes, host transfers, any direct room update)
create or replace function touch_room_on_update()
returns trigger as $$
begin
  new.last_activity_at := now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists room_updated_activity on study_rooms;
create trigger room_updated_activity
  before update on study_rooms
  for each row execute function touch_room_on_update();

-- 3. Trigger: bump last_activity_at whenever a chat message is sent to the room
create or replace function touch_room_on_message()
returns trigger as $$
begin
  update study_rooms set last_activity_at = now() where id = new.room_id;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists room_message_activity on room_messages;
create trigger room_message_activity
  after insert on room_messages
  for each row execute function touch_room_on_message();

-- 4. Replace old cron jobs with 14-day inactivity-based cleanup
select cron.unschedule('delete-old-study-rooms');
select cron.unschedule('delete-old-room-messages');

-- Delete rooms with no activity in 14 days (cascade removes participants + messages)
select cron.schedule(
  'delete-old-study-rooms',
  '30 * * * *',
  $$ delete from study_rooms where last_activity_at < now() - interval '14 days'; $$
);

-- Clean up any orphaned messages (belt-and-suspenders in case cascade misses any)
select cron.schedule(
  'delete-old-room-messages',
  '0 * * * *',
  $$
    delete from room_messages
    where created_at < now() - interval '14 days'
      and room_id not in (select id from study_rooms);
  $$
);
