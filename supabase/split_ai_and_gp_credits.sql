-- Applied 2026-10-20.
--
-- Two meters, because there are two costs and they are nothing alike. An AI
-- grade costs about 40p and scales without limit. A GP review costs twenty
-- minutes of a person you cannot buy more of. Metering only one of them, or
-- metering the recording (which is 5% of the bill), prices the wrong thing.

-- 1. The table called recording_credits has always held GP review credits:
--    "GP review credits remaining" on /recordings reads its balance. Adding
--    an AI meter next to a table named for recordings would have made that
--    confusion permanent, and with three rows in it this is the cheapest the
--    rename will ever be.
alter table if exists public.recording_credits rename to gp_review_credits;

-- 2. AI allowance lives on user_access, beside the ai_uses_count the grading
--    pipeline already increments on every run. Remaining is allowance minus
--    used, so the lifetime usage count survives for the economics dashboard
--    rather than being destroyed by a decrementing balance. This replaces
--    AI_USE_SOFT_CAP = 500, which was hardcoded in two files and applied the
--    same number to everyone regardless of what they had bought.
alter table public.user_access
  add column if not exists ai_allowance integer not null default 0;

comment on column public.user_access.ai_allowance is
  'AI gradings granted (tier allowance plus any top-ups). Remaining = ai_allowance - ai_uses_count.';

-- 3. Grandfather the existing customers onto Intensive. There were three, all
--    predating any allowance, none of whom bought a plan that had one.
update public.user_access
set ai_allowance = 400
where ai_allowance = 0;

-- 4. The RPC follows the table. Same body, same hardening: definer with an
--    empty search_path, executable only by the webhook's service role, since
--    a definer function left open to PUBLIC would let any signed-in user
--    grant themselves credits.
drop function if exists public.add_recording_credits(uuid, integer);

create or replace function public.add_gp_review_credits(p_user_id uuid, p_credits integer)
returns void
language sql
security definer
set search_path = ''
as $$
  insert into public.gp_review_credits as gc (user_id, balance, total_purchased, updated_at)
  values (p_user_id, p_credits, p_credits, now())
  on conflict (user_id) do update
    set balance         = gc.balance + p_credits,
        total_purchased = gc.total_purchased + p_credits,
        updated_at      = now();
$$;

revoke all on function public.add_gp_review_credits(uuid, integer) from public;
revoke all on function public.add_gp_review_credits(uuid, integer) from anon;
revoke all on function public.add_gp_review_credits(uuid, integer) from authenticated;
grant execute on function public.add_gp_review_credits(uuid, integer) to service_role;

-- 5. And one for the AI side, so a top-up is a single atomic statement rather
--    than a read-then-write that two purchases landing together can race.
create or replace function public.add_ai_allowance(p_user_id uuid, p_credits integer)
returns void
language sql
security definer
set search_path = ''
as $$
  update public.user_access
  set ai_allowance = ai_allowance + p_credits
  where user_id = p_user_id;
$$;

revoke all on function public.add_ai_allowance(uuid, integer) from public;
revoke all on function public.add_ai_allowance(uuid, integer) from anon;
revoke all on function public.add_ai_allowance(uuid, integer) from authenticated;
grant execute on function public.add_ai_allowance(uuid, integer) to service_role;

-- Not renamed on purpose: webinar_codes.recording_credits is a column meaning
-- "how many GP review credits this code grants", which is a different thing
-- from the table and is referenced by the redeem flow and the admin screens.

-- ── Applied 2026-10-20, second part: the state between the two halves ───────
alter table public.station_recordings
  add column if not exists transcribed_at  timestamptz,
  add column if not exists gp_requested_at timestamptz,
  add column if not exists discarded_at    timestamptz;

comment on column public.station_recordings.transcribed_at is
  'When transcription finished and the recording entered status=transcribed, awaiting the candidate''s decision to grade, send to a GP, or discard.';
comment on column public.station_recordings.gp_requested_at is
  'Set when the candidate chose "send to a GP" from the transcribed state. The grading run reads it to finish in pending_examiner rather than ai_graded.';
comment on column public.station_recordings.discarded_at is
  'Set when the candidate discarded a transcribed take rather than spending a credit on it. Audio is deleted; the row is kept.';
