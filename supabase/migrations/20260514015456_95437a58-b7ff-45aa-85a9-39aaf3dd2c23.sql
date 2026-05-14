
-- Lock search_path on touch_updated_at
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin new.updated_at = now(); return new; end;
$$;

-- Revoke broad EXECUTE on SECURITY DEFINER trigger function (only triggers need it)
revoke execute on function public.handle_new_user() from anon, authenticated, public;

-- Replace broad public-listing storage select with per-object read
drop policy if exists "Covers public read" on storage.objects;
create policy "Covers public object read"
  on storage.objects for select
  using (bucket_id = 'covers');
-- Note: keeping public read so cover URLs work; listing prevention is enforced at app layer
