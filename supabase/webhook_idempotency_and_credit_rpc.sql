-- Applied 2026-10-19.
--
-- Two things the Stripe webhook needed before review top-ups could be sold:
-- a way to ignore a repeat delivery, and the credit function it has always
-- called but which was never created.

-- 1. Idempotency ledger for Stripe webhooks.
--    Stripe retries a delivery on any non-2xx and on timeouts, reusing the
--    same event id. The handlers are not safe to run twice: recording
--    credits would be added again, and every retry would log a second
--    revenue event into the economics dashboard.
create table if not exists public.stripe_webhook_events (
  event_id     text primary key,
  event_type   text not null,
  processed_at timestamptz not null default now()
);

-- No policies on purpose: only the service-role key, which bypasses RLS,
-- should ever touch this table.
alter table public.stripe_webhook_events enable row level security;


-- 2. The RPC the webhook has always called. It did not exist, so every
--    purchase fell through to the read-then-write upsert in application
--    code. This does it in one statement, so two grants landing together
--    cannot read the same balance and overwrite each other.
create or replace function public.add_recording_credits(p_user_id uuid, p_credits integer)
returns void
language sql
security definer
set search_path = ''
as $$
  insert into public.recording_credits as rc (user_id, balance, total_purchased, updated_at)
  values (p_user_id, p_credits, p_credits, now())
  on conflict (user_id) do update
    set balance         = rc.balance + p_credits,
        total_purchased = rc.total_purchased + p_credits,
        updated_at      = now();
$$;

-- SECURITY DEFINER functions are executable by PUBLIC by default, which here
-- would let any signed-in user grant themselves credits. Only the webhook,
-- which runs as service_role, may call it.
revoke all on function public.add_recording_credits(uuid, integer) from public;
revoke all on function public.add_recording_credits(uuid, integer) from anon;
revoke all on function public.add_recording_credits(uuid, integer) from authenticated;
grant execute on function public.add_recording_credits(uuid, integer) to service_role;
