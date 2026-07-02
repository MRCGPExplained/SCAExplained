-- Enable realtime on study_rooms so timer and station changes propagate to guests.
-- REPLICA IDENTITY FULL is required for row-level filters on postgres_changes.
alter table study_rooms replica identity full;
alter publication supabase_realtime add table study_rooms;
