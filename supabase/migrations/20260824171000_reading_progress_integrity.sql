-- Add the relationships required by PostgREST nested reads and remove orphaned rows.
delete from public.reading_progress p
where not exists (select 1 from auth.users u where u.id = p.user_id)
   or not exists (select 1 from public.manuscripts m where m.id = p.manuscript_id)
   or (p.chapter_id is not null and not exists (select 1 from public.chapters c where c.id = p.chapter_id));

alter table public.reading_progress
  drop constraint if exists reading_progress_user_id_fkey,
  drop constraint if exists reading_progress_manuscript_id_fkey,
  drop constraint if exists reading_progress_chapter_id_fkey;

alter table public.reading_progress
  add constraint reading_progress_user_id_fkey
    foreign key (user_id) references auth.users(id) on delete cascade,
  add constraint reading_progress_manuscript_id_fkey
    foreign key (manuscript_id) references public.manuscripts(id) on delete cascade,
  add constraint reading_progress_chapter_id_fkey
    foreign key (chapter_id) references public.chapters(id) on delete set null;

create index if not exists idx_reading_progress_updated
  on public.reading_progress(user_id, updated_at desc);
