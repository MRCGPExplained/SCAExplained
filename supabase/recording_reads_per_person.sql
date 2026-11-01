-- Per-person read state for reports.
--
-- station_recordings.candidate_viewed_at was one timestamp for the whole row,
-- which was right while a report was only ever addressed to one person. It is
-- now addressed to everyone who was in the room: the patient and the observers
-- find a consultation they sat in waiting in their own envelope.
--
-- One column cannot say WHO has read it. Left as it was, whoever opened a
-- report first would clear the badge for all four people in the room, and a
-- trainee's own mark would be marked read by their study partner. So read
-- state moves to one row per person per report, which is what it has always
-- been in meaning.

create table if not exists public.recording_reads (
  recording_id uuid        not null references public.station_recordings(id) on delete cascade,
  user_id      uuid        not null references auth.users(id)                on delete cascade,
  viewed_at    timestamptz not null default now(),
  primary key (recording_id, user_id)
);

-- The envelope asks "what has this person read", which the primary key cannot
-- answer on its own: it leads on recording_id.
create index if not exists recording_reads_user_id_idx
  on public.recording_reads (user_id);

-- Everything that touches this table goes through the service-role client, the
-- way the envelope and the report page already read station_recordings. RLS on
-- with no policy therefore denies anon and authenticated outright, rather than
-- leaving the table readable through PostgREST by anyone with the anon key.
alter table public.recording_reads enable row level security;

-- Carry over whatever the old column held. A no-op on the day this was
-- written — no report has ever been sent to a candidate, so not one row is
-- stamped — but written as a real backfill, because a file does not always run
-- the day it is written.
insert into public.recording_reads (recording_id, user_id, viewed_at)
select r.id, r.doctor_user_id, r.candidate_viewed_at
  from public.station_recordings r
 where r.candidate_viewed_at is not null
   and r.doctor_user_id is not null
on conflict (recording_id, user_id) do nothing;

-- Deliberately NOT dropped. It holds nothing this table does not now hold, and
-- nothing in the application reads or writes it any more, but dropping a column
-- cannot be undone and this one is not in the way. The comment is the guard: it
-- shows up in the dashboard and in \d+, so the next person to find the column
-- learns that it stopped being maintained rather than wiring it back in.
comment on column public.station_recordings.candidate_viewed_at is
  'DEAD as of supabase/recording_reads_per_person.sql. Read state moved to public.recording_reads — one row per person per report. Nothing writes this column any more; do not read it.';
