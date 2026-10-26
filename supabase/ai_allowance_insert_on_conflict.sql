-- add_ai_allowance: create the row if it is missing, like its GP sibling.
--
-- It was UPDATE-only. An UPDATE matching zero rows is a success in Postgres,
-- not an error, so a grant for a user with no user_access row was a silent
-- no-op: the customer was charged, nothing moved, and no error existed for
-- any caller to check. add_gp_review_credits has always been INSERT ... ON
-- CONFLICT; this brings the AI side into line.
--
-- The top-up path is where this bites: it calls the RPC with no preceding
-- upsert of user_access, so it depended entirely on a row already existing.
--
-- Safe to run at any time, before or after deploying the code that checks the
-- error. It is CREATE OR REPLACE, the signature is unchanged, and every other
-- column on user_access is either nullable or NOT NULL DEFAULT, so the insert
-- needs no columns beyond these two.

create or replace function public.add_ai_allowance(p_user_id uuid, p_credits integer)
returns void
language sql
security definer
set search_path = ''
as $$
  insert into public.user_access as ua (user_id, ai_allowance)
  values (p_user_id, p_credits)
  on conflict (user_id) do update
    set ai_allowance = ua.ai_allowance + p_credits;
$$;

revoke all on function public.add_ai_allowance(uuid, integer) from public;
revoke all on function public.add_ai_allowance(uuid, integer) from anon;
revoke all on function public.add_ai_allowance(uuid, integer) from authenticated;
grant execute on function public.add_ai_allowance(uuid, integer) to service_role;

-- Rollback, if it is ever needed: the previous definition was
--
--   create or replace function public.add_ai_allowance(p_user_id uuid, p_credits integer)
--   returns void language sql security definer set search_path = '' as $$
--     update public.user_access
--     set ai_allowance = ai_allowance + p_credits
--     where user_id = p_user_id;
--   $$;
