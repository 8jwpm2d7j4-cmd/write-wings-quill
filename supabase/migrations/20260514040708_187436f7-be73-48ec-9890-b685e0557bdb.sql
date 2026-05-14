
-- Referral fields
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS referral_code text UNIQUE,
  ADD COLUMN IF NOT EXISTS referred_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS bonus_pro_until timestamptz;

-- Generate referral codes for existing profiles
CREATE OR REPLACE FUNCTION public.gen_referral_code() RETURNS text
LANGUAGE plpgsql AS $$
DECLARE
  code text;
BEGIN
  LOOP
    code := lower(substring(replace(encode(gen_random_bytes(6), 'base64'), '/', '') || replace(encode(gen_random_bytes(6),'base64'),'+',''), 1, 8));
    code := regexp_replace(code, '[^a-z0-9]', '', 'g');
    IF length(code) >= 6 AND NOT EXISTS (SELECT 1 FROM public.profiles WHERE referral_code = code) THEN
      RETURN code;
    END IF;
  END LOOP;
END $$;

UPDATE public.profiles SET referral_code = public.gen_referral_code() WHERE referral_code IS NULL;

-- Trigger to assign on new profiles
CREATE OR REPLACE FUNCTION public.set_referral_code() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.referral_code IS NULL THEN
    NEW.referral_code := public.gen_referral_code();
  END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS profiles_set_referral_code ON public.profiles;
CREATE TRIGGER profiles_set_referral_code BEFORE INSERT ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.set_referral_code();

-- Public member count (no PII)
CREATE OR REPLACE FUNCTION public.public_member_count() RETURNS integer
LANGUAGE sql SECURITY DEFINER SET search_path = public STABLE AS $$
  SELECT COUNT(*)::int FROM public.profiles;
$$;

GRANT EXECUTE ON FUNCTION public.public_member_count() TO anon, authenticated;

-- Atomic referral redemption: grants 30 days bonus Pro to referrer + new user
CREATE OR REPLACE FUNCTION public.redeem_referral(_code text)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  ref_id uuid;
  me uuid := auth.uid();
  my_existing uuid;
BEGIN
  IF me IS NULL THEN RETURN jsonb_build_object('ok',false,'error','not_authenticated'); END IF;
  SELECT referred_by INTO my_existing FROM profiles WHERE id = me;
  IF my_existing IS NOT NULL THEN RETURN jsonb_build_object('ok',false,'error','already_redeemed'); END IF;
  SELECT id INTO ref_id FROM profiles WHERE referral_code = lower(_code);
  IF ref_id IS NULL OR ref_id = me THEN RETURN jsonb_build_object('ok',false,'error','invalid_code'); END IF;

  UPDATE profiles SET referred_by = ref_id,
    bonus_pro_until = GREATEST(COALESCE(bonus_pro_until, now()), now()) + INTERVAL '30 days'
    WHERE id = me;
  UPDATE profiles SET
    bonus_pro_until = GREATEST(COALESCE(bonus_pro_until, now()), now()) + INTERVAL '30 days'
    WHERE id = ref_id;
  RETURN jsonb_build_object('ok',true);
END $$;

GRANT EXECUTE ON FUNCTION public.redeem_referral(text) TO authenticated;
