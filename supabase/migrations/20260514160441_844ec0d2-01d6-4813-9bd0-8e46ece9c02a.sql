
-- 1. Paid chapter content protection
-- Revoke direct SELECT on the content column from anon/authenticated.
REVOKE SELECT (content) ON public.chapters FROM anon, authenticated;

-- Authorized content reader
CREATE OR REPLACE FUNCTION public.get_chapter_content(_chapter_id uuid)
RETURNS text
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _content text;
  _is_paid boolean;
  _author uuid;
  _manuscript uuid;
  _status manuscript_status;
  _me uuid := auth.uid();
BEGIN
  SELECT c.content, c.is_paid, c.manuscript_id, m.author_id, m.status
    INTO _content, _is_paid, _manuscript, _author, _status
  FROM public.chapters c
  JOIN public.manuscripts m ON m.id = c.manuscript_id
  WHERE c.id = _chapter_id;

  IF _manuscript IS NULL THEN RETURN NULL; END IF;
  IF _status <> 'published' AND _author <> _me THEN RETURN NULL; END IF;

  IF NOT _is_paid OR _author = _me THEN
    RETURN _content;
  END IF;

  IF _me IS NULL THEN RETURN NULL; END IF;

  IF EXISTS (SELECT 1 FROM public.chapter_unlocks
             WHERE chapter_id = _chapter_id AND user_id = _me) THEN
    RETURN _content;
  END IF;

  RETURN NULL;
END $$;

REVOKE EXECUTE ON FUNCTION public.get_chapter_content(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_chapter_content(uuid) TO authenticated;

-- 2. Contest entries: restrict listing to authenticated users
DROP POLICY IF EXISTS "Entries viewable by everyone" ON public.contest_entries;
CREATE POLICY "Entries viewable by authenticated"
  ON public.contest_entries FOR SELECT
  TO authenticated
  USING (true);

-- 3. Persistent AI usage tracking
CREATE TABLE IF NOT EXISTS public.daily_ai_usage (
  user_id uuid NOT NULL,
  date date NOT NULL,
  count integer NOT NULL DEFAULT 0,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, date)
);
ALTER TABLE public.daily_ai_usage ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own ai usage" ON public.daily_ai_usage
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.bump_ai_usage()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _me uuid := auth.uid();
  _today date := (now() at time zone 'utc')::date;
  _count integer;
BEGIN
  IF _me IS NULL THEN RAISE EXCEPTION 'unauthorized'; END IF;
  INSERT INTO public.daily_ai_usage (user_id, date, count)
  VALUES (_me, _today, 1)
  ON CONFLICT (user_id, date) DO UPDATE
    SET count = public.daily_ai_usage.count + 1,
        updated_at = now()
  RETURNING count INTO _count;
  RETURN _count;
END $$;

REVOKE EXECUTE ON FUNCTION public.bump_ai_usage() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.bump_ai_usage() TO authenticated;

-- 4. Lock down SECURITY DEFINER helpers from anonymous callers
REVOKE EXECUTE ON FUNCTION public.get_my_profile_settings() FROM PUBLIC, anon;
GRANT  EXECUTE ON FUNCTION public.get_my_profile_settings() TO authenticated;

REVOKE EXECUTE ON FUNCTION public.my_invited_count() FROM PUBLIC, anon;
GRANT  EXECUTE ON FUNCTION public.my_invited_count() TO authenticated;

REVOKE EXECUTE ON FUNCTION public.award_achievement(text, uuid) FROM PUBLIC, anon;
GRANT  EXECUTE ON FUNCTION public.award_achievement(text, uuid) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.send_notification(uuid, text, text, uuid) FROM PUBLIC, anon;
GRANT  EXECUTE ON FUNCTION public.send_notification(uuid, text, text, uuid) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.redeem_referral(text) FROM PUBLIC, anon;
GRANT  EXECUTE ON FUNCTION public.redeem_referral(text) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.has_active_subscription(uuid, text) FROM PUBLIC, anon;
GRANT  EXECUTE ON FUNCTION public.has_active_subscription(uuid, text) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.gen_referral_code() FROM PUBLIC, anon;
