-- Keep community records consistent when users, manuscripts, chapters, or comments are removed.
delete from public.comment_likes cl
where not exists (select 1 from public.comments c where c.id = cl.comment_id)
   or not exists (select 1 from auth.users u where u.id = cl.user_id);

delete from public.reactions r
where not exists (select 1 from public.chapters c where c.id = r.chapter_id)
   or not exists (select 1 from auth.users u where u.id = r.user_id);

delete from public.likes l
where not exists (select 1 from public.manuscripts m where m.id = l.manuscript_id)
   or not exists (select 1 from auth.users u where u.id = l.user_id);

delete from public.follows f
where not exists (select 1 from public.profiles p where p.id = f.follower_id)
   or not exists (select 1 from public.profiles p where p.id = f.following_id);

delete from public.notifications n
where not exists (select 1 from public.profiles p where p.id = n.user_id);

update public.notifications n set actor_id = null
where actor_id is not null
  and not exists (select 1 from public.profiles p where p.id = n.actor_id);

update public.notifications n set manuscript_id = null
where manuscript_id is not null
  and not exists (select 1 from public.manuscripts m where m.id = n.manuscript_id);

alter table public.comment_likes
  add constraint comment_likes_comment_id_fkey foreign key (comment_id)
    references public.comments(id) on delete cascade,
  add constraint comment_likes_user_id_fkey foreign key (user_id)
    references auth.users(id) on delete cascade;

alter table public.reactions
  add constraint reactions_chapter_id_fkey foreign key (chapter_id)
    references public.chapters(id) on delete cascade,
  add constraint reactions_user_id_fkey foreign key (user_id)
    references auth.users(id) on delete cascade;

alter table public.likes
  add constraint likes_manuscript_id_fkey foreign key (manuscript_id)
    references public.manuscripts(id) on delete cascade,
  add constraint likes_user_id_fkey foreign key (user_id)
    references auth.users(id) on delete cascade;

alter table public.follows
  add constraint follows_follower_id_fkey foreign key (follower_id)
    references public.profiles(id) on delete cascade,
  add constraint follows_following_id_fkey foreign key (following_id)
    references public.profiles(id) on delete cascade;

alter table public.notifications
  add constraint notifications_user_id_fkey foreign key (user_id)
    references public.profiles(id) on delete cascade,
  add constraint notifications_actor_id_fkey foreign key (actor_id)
    references public.profiles(id) on delete set null,
  add constraint notifications_manuscript_id_fkey foreign key (manuscript_id)
    references public.manuscripts(id) on delete set null;

create index if not exists reactions_chapter_idx on public.reactions(chapter_id);
create index if not exists likes_manuscript_idx on public.likes(manuscript_id);
create index if not exists follows_following_idx on public.follows(following_id);
