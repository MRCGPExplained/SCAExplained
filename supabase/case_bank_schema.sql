-- ============================================================
-- SCA Case Bank - run this in the Supabase SQL editor
-- ============================================================

-- Subscriber access (one row per 90-day purchase)
create table if not exists case_bank_access (
  id                     uuid primary key default gen_random_uuid(),
  user_id                uuid references auth.users not null,
  purchased_at           timestamptz default now(),
  expires_at             timestamptz not null,
  stripe_payment_intent_id text
);
alter table case_bank_access enable row level security;
create policy "Users see own access" on case_bank_access
  for select using (auth.uid() = user_id);

-- Stations (the 246 practice cases)
create table if not exists stations (
  id                     uuid primary key default gen_random_uuid(),
  number                 integer unique not null,
  title                  text not null,
  subject                text not null,
  consultation_type      text not null, -- Video Consultation or Telephone Consultation
  published              boolean default false,

  -- Doctor's Brief
  patient_name           text not null default '',
  patient_age            text not null default '',
  pmh                    text[] not null default '{}',
  medications_and_allergies           text[] not null default '{}',
  recent_notes           text,
  reason_for_consultation text not null default '',

  -- Patient's Story
  opening_statement      text not null default '',
  if_asked_further       text not null default '',
  only_if_asked          text[] not null default '{}',
  social_history         text not null default '',
  ice_ideas              text not null default '',
  ice_concerns           text not null default '',
  ice_expectations       text not null default '',
  scenarios              text[],
  question_for_doctor    text,
  role_player_instruction text,

  -- Marking scheme
  data_gathering         text[] not null default '{}',
  management             text[] not null default '{}',

  -- Post-consultation
  example_explanation    text not null default '',
  key_takeaways          text[] not null default '{}',

  -- Optional video
  editor_video_url       text, -- YouTube unlisted URL. NULL means section is hidden.

  created_at             timestamptz default now(),
  updated_at             timestamptz default now()
);
alter table stations enable row level security;
create policy "Authenticated users with active access can read published stations"
  on stations for select
  using (
    published = true
    and exists (
      select 1 from case_bank_access
      where user_id = auth.uid()
      and expires_at > now()
    )
  );

-- Trigger to keep updated_at fresh
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;
create trigger stations_updated_at before update on stations
  for each row execute function update_updated_at();

-- Station attempts (written when timer starts)
create table if not exists station_attempts (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid references auth.users not null,
  station_id   uuid references stations not null,
  attempted_at timestamptz default now(),
  unique(user_id, station_id)
);
alter table station_attempts enable row level security;
create policy "Users manage own attempts" on station_attempts
  for all using (auth.uid() = user_id);

-- Personal notes per station per user
create table if not exists station_notes (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users not null,
  station_id uuid references stations not null,
  content    text,
  updated_at timestamptz default now(),
  unique(user_id, station_id)
);
alter table station_notes enable row level security;
create policy "Users manage own notes" on station_notes
  for all using (auth.uid() = user_id);

-- Starred stations
create table if not exists station_stars (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users not null,
  station_id uuid references stations not null,
  created_at timestamptz default now(),
  unique(user_id, station_id)
);
alter table station_stars enable row level security;
create policy "Users manage own stars" on station_stars
  for all using (auth.uid() = user_id);

-- Issue reports
create table if not exists station_reports (
  id         uuid primary key default gen_random_uuid(),
  station_id uuid references stations not null,
  user_id    uuid references auth.users,
  content    text not null,
  resolved   boolean default false,
  created_at timestamptz default now()
);
alter table station_reports enable row level security;
create policy "Users can insert reports" on station_reports
  for insert with check (auth.uid() = user_id);
create policy "Users can read own reports" on station_reports
  for select using (auth.uid() = user_id);

-- Friend requests
create table if not exists friend_requests (
  id          uuid primary key default gen_random_uuid(),
  sender_id   uuid references auth.users not null,
  receiver_id uuid references auth.users not null,
  status      text default 'pending', -- pending / accepted / declined
  created_at  timestamptz default now(),
  unique(sender_id, receiver_id)
);
alter table friend_requests enable row level security;
create policy "Users manage own friend requests" on friend_requests
  for all using (auth.uid() = sender_id or auth.uid() = receiver_id);

-- Study rooms
create table if not exists study_rooms (
  id                    uuid primary key default gen_random_uuid(),
  room_code             text unique not null,
  host_user_id          uuid references auth.users not null,
  current_station_id    uuid references stations,
  timer_phase           text default 'PREREAD', -- PREREAD or CONSULT
  timer_started_at      timestamptz,
  timer_paused_at       timestamptz,
  timer_paused_remaining integer, -- seconds left when paused
  timer_skipped_preread boolean default false,
  created_at            timestamptz default now()
);
alter table study_rooms enable row level security;
-- room_participants_can_read_rooms policy added below, after that table is created
create policy "Host can update room" on study_rooms
  for update using (host_user_id = auth.uid());
create policy "Authenticated users can create rooms" on study_rooms
  for insert with check (auth.uid() = host_user_id);

-- Room participants
create table if not exists room_participants (
  id       uuid primary key default gen_random_uuid(),
  room_id  uuid references study_rooms not null,
  user_id  uuid references auth.users not null,
  joined_at timestamptz default now(),
  muted    boolean default false,
  unique(room_id, user_id)
);
alter table room_participants enable row level security;
create policy "Participants manage own rows" on room_participants
  for all using (auth.uid() = user_id);
create policy "Room members can read participant list" on room_participants
  for select using (
    exists (
      select 1 from room_participants rp2
      where rp2.room_id = room_participants.room_id and rp2.user_id = auth.uid()
    )
  );

-- Now safe: room_participants table exists above
create policy "Room participants can read rooms" on study_rooms
  for select using (
    exists (
      select 1 from room_participants
      where room_id = study_rooms.id and user_id = auth.uid()
    )
    or host_user_id = auth.uid()
  );

-- User profiles (display name, initials for rooms)
create table if not exists user_profiles (
  id           uuid primary key references auth.users,
  display_name text not null,
  initials     text not null,
  updated_at   timestamptz default now()
);
alter table user_profiles enable row level security;
create policy "Users manage own profile" on user_profiles
  for all using (auth.uid() = id);
create policy "All authenticated users can read profiles" on user_profiles
  for select using (auth.uid() is not null);

-- Expiry reminder tracking (so we only send once)
create table if not exists case_bank_reminders_sent (
  user_id    uuid primary key references auth.users,
  sent_at    timestamptz default now()
);
