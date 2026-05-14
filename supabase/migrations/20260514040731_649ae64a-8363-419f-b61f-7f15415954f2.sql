
CREATE OR REPLACE FUNCTION public.gen_referral_code() RETURNS text
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
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
REVOKE EXECUTE ON FUNCTION public.gen_referral_code() FROM PUBLIC, anon, authenticated;
