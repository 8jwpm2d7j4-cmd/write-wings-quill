-- Drop legacy Paddle-era memberships table
DROP TABLE IF EXISTS public.memberships CASCADE;

-- Enforce 10/day AI cap for non-Pro users
CREATE OR REPLACE FUNCTION public.bump_ai_usage()
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  _me uuid := auth.uid();
  _today date := (now() at time zone 'utc')::date;
  _count integer;
  _current integer;
  _is_pro boolean;
BEGIN
  IF _me IS NULL THEN RAISE EXCEPTION 'unauthorized'; END IF;

  SELECT count INTO _current FROM public.daily_ai_usage
    WHERE user_id = _me AND date = _today;
  _current := COALESCE(_current, 0);

  -- Check Pro status (sandbox OR live) + referral bonus
  SELECT
    EXISTS (
      SELECT 1 FROM public.subscriptions s
      WHERE s.user_id = _me
        AND (
          (s.status IN ('active','trialing','past_due') AND (s.current_period_end IS NULL OR s.current_period_end > now()))
          OR (s.status = 'canceled' AND s.current_period_end > now())
        )
    )
    OR EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = _me AND p.bonus_pro_until IS NOT NULL AND p.bonus_pro_until > now()
    )
  INTO _is_pro;

  IF NOT _is_pro AND _current >= 10 THEN
    RAISE EXCEPTION 'ai_free_limit_reached' USING HINT = 'Upgrade to Quill Pro for unlimited AI assists';
  END IF;

  INSERT INTO public.daily_ai_usage (user_id, date, count)
  VALUES (_me, _today, 1)
  ON CONFLICT (user_id, date) DO UPDATE
    SET count = public.daily_ai_usage.count + 1,
        updated_at = now()
  RETURNING count INTO _count;
  RETURN _count;
END $function$;