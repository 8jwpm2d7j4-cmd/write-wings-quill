CREATE OR REPLACE FUNCTION public._seed_create_user(_uid uuid, _email text)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = auth, public
AS $$
BEGIN
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password,
    email_confirmed_at, created_at, updated_at,
    raw_app_meta_data, raw_user_meta_data, is_super_admin
  ) VALUES (
    _uid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
    _email, '', now(), now(), now(),
    '{"provider":"seed","providers":["seed"]}'::jsonb, '{}'::jsonb, false
  );
END $$;
REVOKE EXECUTE ON FUNCTION public._seed_create_user(uuid, text) FROM PUBLIC, anon, authenticated;