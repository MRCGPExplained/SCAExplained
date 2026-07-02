-- Add current_station_number so guests who join mid-session land on the right station
-- and so timer state is readable on rejoin (timer columns already existed)
alter table study_rooms
  add column if not exists current_station_number integer;
