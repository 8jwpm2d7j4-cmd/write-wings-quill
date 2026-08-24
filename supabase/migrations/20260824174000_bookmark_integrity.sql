delete from public.bookmarks b
where not exists (select 1 from public.manuscripts m where m.id = b.manuscript_id)
   or not exists (select 1 from auth.users u where u.id = b.user_id);

alter table public.bookmarks
  drop constraint if exists bookmarks_manuscript_id_fkey,
  drop constraint if exists bookmarks_user_id_fkey;

alter table public.bookmarks
  add constraint bookmarks_manuscript_id_fkey
    foreign key (manuscript_id) references public.manuscripts(id) on delete cascade,
  add constraint bookmarks_user_id_fkey
    foreign key (user_id) references auth.users(id) on delete cascade;

notify pgrst, 'reload schema';
