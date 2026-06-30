-- ============================================================================
-- SCA Explained — database schema
-- Run this in the Supabase SQL editor (or via `supabase db push`).
--
-- Deviation from the build brief: events has an `event_type` column
-- ('webinar' | 'intensive'). The brief's illustrative schema omits it, but a
-- discriminator is required to (a) split the homepage into two date lists and
-- (b) drive the two booking routes (/book/clear-pass-webinar vs
-- /book/sca-intensive) from a single events table. `start_time`/`end_time`
-- remain single full timestamps as specified — no separate time column.
--
-- Money is stored in PENCE (integer) to match Stripe's smallest-unit amounts.
--   Active Candidate = 15000, Observer = 5000, Webinar = 0.
-- ============================================================================

create extension if not exists "pgcrypto"; -- for gen_random_uuid()

-- ── events ──────────────────────────────────────────────────────────────────
create table if not exists events (
  id          uuid primary key default gen_random_uuid(),
  event_type  text not null check (event_type in ('webinar', 'intensive')),
  title       text not null,
  description text,
  start_time  timestamptz not null,   -- full timestamp: date AND time of day
  end_time    timestamptz not null,
  zoom_link   text,                    -- NEVER exposed publicly; emailed on confirmation only
  status      text not null default 'scheduled'
                check (status in ('scheduled', 'cancelled', 'completed')),
  created_at  timestamptz not null default now()
);

create index if not exists events_start_time_idx on events (start_time);
create index if not exists events_type_idx on events (event_type);

-- ── ticket_types ─────────────────────────────────────────────────────────────
create table if not exists ticket_types (
  id         uuid primary key default gen_random_uuid(),
  event_id   uuid not null references events (id) on delete cascade,
  name       text not null,           -- 'Active Candidate' | 'Observer' | 'Webinar (Free)'
  capacity   integer not null check (capacity >= 0),
  price      integer not null default 0 check (price >= 0), -- pence
  created_at timestamptz not null default now()
);

create index if not exists ticket_types_event_id_idx on ticket_types (event_id);

-- ── bookings ─────────────────────────────────────────────────────────────────
create table if not exists bookings (
  id                          uuid primary key default gen_random_uuid(),
  event_id                    uuid not null references events (id),
  ticket_type_id              uuid not null references ticket_types (id),
  customer_name               text not null,
  customer_email              text not null,
  status                      text not null default 'pending'
                                check (status in ('pending', 'confirmed', 'paid', 'cancelled')),
  stripe_checkout_session_id  text,
  created_at                  timestamptz not null default now()
);

create index if not exists bookings_ticket_type_idx on bookings (ticket_type_id);
create index if not exists bookings_stripe_session_idx on bookings (stripe_checkout_session_id);

-- ── availability view ────────────────────────────────────────────────────────
-- Seats are considered "taken" while pending, paid, or confirmed. Counting
-- pending deliberately over-reserves (a stuck/abandoned checkout briefly holds
-- a seat) — for the 2-seat Intensive, never overselling matters more than the
-- rare abandoned pending. A cleanup job can expire stale pendings later.
create or replace view ticket_availability as
select
  tt.id        as ticket_type_id,
  tt.event_id  as event_id,
  tt.name      as name,
  tt.capacity  as capacity,
  tt.price     as price,
  greatest(tt.capacity - coalesce(b.taken, 0), 0) as remaining
from ticket_types tt
left join (
  select ticket_type_id, count(*) as taken
  from bookings
  where status in ('pending', 'paid', 'confirmed')
  group by ticket_type_id
) b on b.ticket_type_id = tt.id;

-- ── Row Level Security ───────────────────────────────────────────────────────
-- All application DB access is server-side via the service-role key, which
-- bypasses RLS. We still enable RLS with NO public policies so that the anon
-- key (and any accidental client-side query) can read nothing — in particular
-- never the zoom_link. Do not add a public SELECT policy on events.
alter table events       enable row level security;
alter table ticket_types enable row level security;
alter table bookings     enable row level security;

-- ── Atomic reservation RPC ────────────────────────────────────────────────────
-- Reserves one seat for a ticket type inside a single transaction. Locks the
-- ticket_types row (FOR UPDATE) so two people clicking "Book" in the same
-- second cannot both pass the capacity check — the core requirement for the
-- 2-active-seat Intensive. Returns the created booking row.
--
-- Free tickets (price 0) are created 'confirmed' immediately; paid tickets are
-- created 'pending' and confirmed later by the Stripe webhook.
create or replace function reserve_booking(
  p_event_id       uuid,
  p_ticket_type_id uuid,
  p_customer_name  text,
  p_customer_email text
) returns bookings
language plpgsql
security definer
set search_path = public
as $$
declare
  v_capacity int;
  v_price    int;
  v_event_id uuid;
  v_taken    int;
  v_booking  bookings;
begin
  -- Serialise concurrent reservations on this ticket type.
  select capacity, price, event_id
    into v_capacity, v_price, v_event_id
  from ticket_types
  where id = p_ticket_type_id
  for update;

  if not found then
    raise exception 'ticket_type_not_found' using errcode = 'P0002';
  end if;

  if v_event_id <> p_event_id then
    raise exception 'ticket_event_mismatch' using errcode = 'P0001';
  end if;

  select count(*) into v_taken
  from bookings
  where ticket_type_id = p_ticket_type_id
    and status in ('pending', 'paid', 'confirmed');

  if v_taken >= v_capacity then
    raise exception 'sold_out' using errcode = 'P0001';
  end if;

  insert into bookings (event_id, ticket_type_id, customer_name, customer_email, status)
  values (
    p_event_id,
    p_ticket_type_id,
    p_customer_name,
    p_customer_email,
    case when v_price > 0 then 'pending' else 'confirmed' end
  )
  returning * into v_booking;

  return v_booking;
end;
$$;
