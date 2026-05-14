
-- 1) Revoke direct SELECT on chapters.content; force RPC for content reads
REVOKE SELECT (content) ON public.chapters FROM anon, authenticated, PUBLIC;

-- 2) Tighten contest_entries INSERT to enforce Pro membership for members_only contests
DROP POLICY IF EXISTS "Authors submit own entries" ON public.contest_entries;

CREATE POLICY "Authors submit own entries"
ON public.contest_entries
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
  AND EXISTS (
    SELECT 1 FROM public.manuscripts m
    WHERE m.id = contest_entries.manuscript_id AND m.author_id = auth.uid()
  )
  AND (
    NOT COALESCE((SELECT c.members_only FROM public.contests c WHERE c.id = contest_entries.contest_id), true)
    OR EXISTS (
      SELECT 1 FROM public.subscriptions s
      WHERE s.user_id = auth.uid()
        AND (
          (s.status IN ('active','trialing','past_due') AND (s.current_period_end IS NULL OR s.current_period_end > now()))
          OR (s.status = 'canceled' AND s.current_period_end > now())
        )
    )
    OR EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.bonus_pro_until > now()
    )
  )
);
