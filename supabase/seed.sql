-- ============================================================================
-- SCA Explained — sample seed data (optional)
-- Mirrors the dates from the original homepage mockup so the live site has
-- something to render. Safe to delete / replace with real sessions.
-- Times are stored in UTC; adjust to taste. Prices are in pence.
-- ============================================================================

-- ── Clear Pass Webinars (free) ───────────────────────────────────────────────
with w as (
  insert into events (event_type, title, description, start_time, end_time, status)
  values
    ('webinar', 'What Makes a Clear Pass', '2-hour free training on what examiners are scoring.',
       timestamptz '2026-07-08 18:00:00+01', timestamptz '2026-07-08 20:00:00+01', 'scheduled'),
    ('webinar', 'What Makes a Clear Pass', '2-hour free training on what examiners are scoring.',
       timestamptz '2026-07-22 18:00:00+01', timestamptz '2026-07-22 20:00:00+01', 'scheduled'),
    ('webinar', 'What Makes a Clear Pass', '2-hour free training on what examiners are scoring.',
       timestamptz '2026-08-05 18:00:00+01', timestamptz '2026-08-05 20:00:00+01', 'scheduled')
  returning id
)
insert into ticket_types (event_id, name, capacity, price)
select id, 'Webinar (Free)', 200, 0 from w;

-- ── SCA Intensives (paid) ────────────────────────────────────────────────────
-- Each gets two ticket types: Active Candidate (£150, cap 2) and Observer (£50).
do $$
declare
  v_id uuid;
  v_start timestamptz;
  v_starts timestamptz[] := array[
    timestamptz '2026-07-12 10:00:00+01',
    timestamptz '2026-07-26 10:00:00+01',
    timestamptz '2026-08-09 10:00:00+01'
  ];
begin
  foreach v_start in array v_starts loop
    insert into events (event_type, title, description, start_time, end_time, status)
    values ('intensive', 'SCA Intensive',
            'Small-group live workshop. Two active candidates, three consultations each.',
            v_start, v_start + interval '2 hours', 'scheduled')
    returning id into v_id;

    insert into ticket_types (event_id, name, capacity, price) values
      (v_id, 'Active Candidate', 2, 20000),
      (v_id, 'Observer', 8, 5000);
  end loop;
end $$;
