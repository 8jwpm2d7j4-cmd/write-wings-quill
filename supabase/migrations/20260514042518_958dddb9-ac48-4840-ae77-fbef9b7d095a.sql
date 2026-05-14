CREATE OR REPLACE FUNCTION public._seed_exec(_sql text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  EXECUTE _sql;
END $$;
REVOKE ALL ON FUNCTION public._seed_exec(text) FROM PUBLIC;