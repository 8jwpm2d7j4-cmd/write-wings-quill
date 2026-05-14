
-- =========================================================
-- 1) PROFILES: column-level grants to hide private fields
-- =========================================================
REVOKE SELECT ON public.profiles FROM anon, authenticated;
GRANT SELECT (id, pen_name, bio, avatar_url, genres, created_at, updated_at)
  ON public.profiles TO anon, authenticated;

-- Owner-accessible private fields via SECURITY DEFINER helper
CREATE OR REPLACE FUNCTION public.get_my_profile_settings()
RETURNS TABLE (
  id uuid,
  pen_name text,
  bio text,
  avatar_url text,
  genres text[],
  onboarded boolean,
  email_notifications boolean,
  daily_reminder_at time,
  bonus_pro_until timestamptz,
  referral_code text,
  referred_by uuid,
  created_at timestamptz,
  updated_at timestamptz
)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT id, pen_name, bio, avatar_url, genres, onboarded, email_notifications,
         daily_reminder_at, bonus_pro_until, referral_code, referred_by,
         created_at, updated_at
  FROM public.profiles WHERE id = auth.uid();
$$;
REVOKE EXECUTE ON FUNCTION public.get_my_profile_settings() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_my_profile_settings() TO authenticated;

-- Count of users a referrer has invited (replaces eq("referred_by", me) which now lacks column access)
CREATE OR REPLACE FUNCTION public.my_invited_count()
RETURNS integer
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT COUNT(*)::int FROM public.profiles WHERE referred_by = auth.uid();
$$;
REVOKE EXECUTE ON FUNCTION public.my_invited_count() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.my_invited_count() TO authenticated;

-- =========================================================
-- 2) NOTIFICATIONS: lock down INSERT, expose validated RPC
-- =========================================================
DROP POLICY IF EXISTS "Authenticated insert notifications" ON public.notifications;
-- Only service_role may insert directly (webhooks, server fns)
CREATE POLICY "Service role inserts notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

CREATE OR REPLACE FUNCTION public.send_notification(
  _user_id uuid, _kind text, _message text, _manuscript_id uuid DEFAULT NULL
) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _actor uuid := auth.uid();
BEGIN
  IF _actor IS NULL THEN RAISE EXCEPTION 'unauthorized'; END IF;
  IF _actor = _user_id THEN RETURN; END IF;
  IF _kind NOT IN ('like','comment','follow') THEN
    RAISE EXCEPTION 'invalid kind';
  END IF;
  IF _message IS NULL OR length(_message) = 0 OR length(_message) > 280 THEN
    RAISE EXCEPTION 'invalid message';
  END IF;

  IF _kind = 'follow' THEN
    IF NOT EXISTS (SELECT 1 FROM follows WHERE follower_id = _actor AND following_id = _user_id) THEN
      RAISE EXCEPTION 'no follow';
    END IF;
  ELSIF _kind = 'like' THEN
    IF _manuscript_id IS NULL OR NOT EXISTS (
      SELECT 1 FROM likes l JOIN manuscripts m ON m.id = l.manuscript_id
      WHERE l.user_id = _actor AND l.manuscript_id = _manuscript_id AND m.author_id = _user_id
    ) THEN RAISE EXCEPTION 'no like'; END IF;
  ELSIF _kind = 'comment' THEN
    IF _manuscript_id IS NULL OR NOT EXISTS (
      SELECT 1 FROM comments c JOIN manuscripts m ON m.id = c.manuscript_id
      WHERE c.user_id = _actor AND c.manuscript_id = _manuscript_id AND m.author_id = _user_id
    ) THEN RAISE EXCEPTION 'no comment'; END IF;
  END IF;

  INSERT INTO notifications (user_id, actor_id, kind, message, manuscript_id)
  VALUES (_user_id, _actor, _kind, _message, _manuscript_id);
END $$;
REVOKE EXECUTE ON FUNCTION public.send_notification(uuid, text, text, uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.send_notification(uuid, text, text, uuid) TO authenticated;

-- =========================================================
-- 3) USER_ACHIEVEMENTS: validated awards only
-- =========================================================
DROP POLICY IF EXISTS "Users insert own achievements" ON public.user_achievements;
DROP POLICY IF EXISTS "User achievements viewable by everyone" ON public.user_achievements;
CREATE POLICY "Users view own achievements"
  ON public.user_achievements FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "Service role manages achievements"
  ON public.user_achievements FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

CREATE OR REPLACE FUNCTION public.award_achievement(_code text, _target_user uuid DEFAULT NULL)
RETURNS boolean
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  _me uuid := auth.uid();
  _user uuid;
  _g RECORD;
BEGIN
  IF _me IS NULL THEN RETURN false; END IF;
  _user := COALESCE(_target_user, _me);

  IF _user = _me THEN
    IF _code IN ('first_words','thousand_words','ten_thousand','streak_7','streak_30') THEN
      SELECT total_words, current_streak INTO _g FROM writing_goals WHERE user_id = _me;
      IF _code = 'first_words'    AND COALESCE(_g.total_words,0)    <   100 THEN RETURN false; END IF;
      IF _code = 'thousand_words' AND COALESCE(_g.total_words,0)    <  1000 THEN RETURN false; END IF;
      IF _code = 'ten_thousand'   AND COALESCE(_g.total_words,0)    < 10000 THEN RETURN false; END IF;
      IF _code = 'streak_7'       AND COALESCE(_g.current_streak,0) <     7 THEN RETURN false; END IF;
      IF _code = 'streak_30'      AND COALESCE(_g.current_streak,0) <    30 THEN RETURN false; END IF;
    ELSIF _code = 'first_publish' THEN
      IF NOT EXISTS (SELECT 1 FROM manuscripts WHERE author_id = _me AND status = 'published') THEN RETURN false; END IF;
    ELSIF _code = 'first_tip' THEN
      IF NOT EXISTS (SELECT 1 FROM tips WHERE from_user_id = _me) THEN RETURN false; END IF;
    ELSE
      RETURN false;
    END IF;
  ELSE
    -- Cross-user awards limited to first_follower triggered by the new follower
    IF _code = 'first_follower' THEN
      IF NOT EXISTS (SELECT 1 FROM follows WHERE follower_id = _me AND following_id = _user) THEN RETURN false; END IF;
    ELSE
      RETURN false;
    END IF;
  END IF;

  INSERT INTO user_achievements (user_id, code) VALUES (_user, _code)
  ON CONFLICT DO NOTHING;
  RETURN true;
END $$;
REVOKE EXECUTE ON FUNCTION public.award_achievement(text, uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.award_achievement(text, uuid) TO authenticated;

-- =========================================================
-- 4) Restrict social-graph reads to authenticated users
-- =========================================================
DROP POLICY IF EXISTS "Follows viewable by all" ON public.follows;
CREATE POLICY "Follows viewable by authenticated"
  ON public.follows FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Likes viewable by everyone" ON public.likes;
CREATE POLICY "Likes viewable by authenticated"
  ON public.likes FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Reactions viewable by all" ON public.reactions;
CREATE POLICY "Reactions viewable by authenticated"
  ON public.reactions FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Comment likes viewable by all" ON public.comment_likes;
CREATE POLICY "Comment likes viewable by authenticated"
  ON public.comment_likes FOR SELECT TO authenticated USING (true);

-- =========================================================
-- 5) Lock down SECURITY DEFINER function execute grants
-- =========================================================
REVOKE EXECUTE ON FUNCTION public.has_active_subscription(uuid, text) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.gen_referral_code() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.set_referral_code() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.touch_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.redeem_referral(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.redeem_referral(text) TO authenticated;
-- public_member_count stays callable by anon (used on public landing pages)

NOTIFY pgrst, 'reload schema';
