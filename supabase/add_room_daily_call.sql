-- The live call, discoverable from the room instead of only from an event.
--
-- The Daily room's name and url used to exist in exactly one place: the
-- payload of the "recording-start" broadcast. A broadcast can only be heard
-- once, by whoever is already listening, so:
--
--   * someone joining a study room mid-consultation could never join the
--     call, however legitimately they belonged there. They saw the timer
--     counting down and heard silence, and their own client did not even
--     know a consultation was running.
--   * if the HOST reloaded mid-consultation they lost the room details from
--     memory and nobody could be let in either.
--
-- Both are the same bug: state that only exists as an event. These two
-- columns put it on the room, where anyone who can see the room can find it.
--
-- Nullable and cleared when the take ends, so a latecomer cannot be sent to
-- a call that has already been torn down.

alter table study_rooms
  add column if not exists daily_room_name text,
  add column if not exists daily_room_url  text;

-- Applied to production 2026-10-28.
