-- Free chapters in published books must be readable before sign-in.
grant execute on function public.get_chapter_content(uuid) to anon, authenticated;

-- Give PostgREST an explicit relationship from comments to public author profiles.
alter table public.comments
  drop constraint if exists comments_user_profile_fkey;
alter table public.comments
  add constraint comments_user_profile_fkey
  foreign key (user_id) references public.profiles(id) on delete cascade;

notify pgrst, 'reload schema';
