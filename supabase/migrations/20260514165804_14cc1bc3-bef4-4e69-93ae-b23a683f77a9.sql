DROP POLICY IF EXISTS "Entries viewable by authenticated" ON public.contest_entries;
CREATE POLICY "Users view own contest entries"
  ON public.contest_entries FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Service role manages memberships"
  ON public.memberships FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');