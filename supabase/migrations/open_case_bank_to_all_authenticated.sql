-- Open case bank to all authenticated users (was gated on user_access)
DROP POLICY IF EXISTS "Programme subscribers can read published stations" ON stations;

CREATE POLICY "Authenticated users can read published stations"
ON stations FOR SELECT
USING (published = true AND auth.uid() IS NOT NULL);
