-- Where the recording flow's logs go now that the console is not enough.
--
-- On 28 Oct a consultation lost one of its two tracks. Everything that could
-- have explained it — whether the recorder started, whether the upload began,
-- whether it threw — went to a browser console that was closed before anyone
-- thought to look. The answer existed for about a minute and then did not,
-- and what was left was an evening of inference from timestamps.
--
-- A diagnostic table, not a feature. Nothing in the product reads it. It
-- exists so the next one takes seconds.
--
-- Written only by the server through /api/recordings/log, which takes
-- user_id from the session and never from the body. RLS is on with no
-- policies, so every other path is denied by default.

create table if not exists recording_events (
  id            bigserial primary key,
  recording_id  uuid,
  room_id       uuid,
  user_id       uuid,
  role          text,
  level         text not null,   -- status | error | duration
  event         text not null,
  data          jsonb,
  user_agent    text,
  created_at    timestamptz not null default now()
);

create index if not exists recording_events_recording_idx on recording_events (recording_id, created_at);
create index if not exists recording_events_created_idx   on recording_events (created_at desc);

alter table recording_events enable row level security;

-- This grows. Nothing prunes it yet; when it needs it, delete by created_at.
-- Applied to production 2026-10-29.
