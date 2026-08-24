-- Preserve recoverable chapter snapshots without creating a row for every keystroke.
alter table public.chapter_revisions
  add column if not exists title text not null default 'Untitled chapter';

delete from public.chapter_revisions r
where not exists (select 1 from public.chapters c where c.id = r.chapter_id);

alter table public.chapter_revisions
  drop constraint if exists chapter_revisions_chapter_id_fkey;
alter table public.chapter_revisions
  add constraint chapter_revisions_chapter_id_fkey
  foreign key (chapter_id) references public.chapters(id) on delete cascade;

create or replace function public.capture_chapter_revision()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  recent_id uuid;
begin
  if old.content is not distinct from new.content
     and old.title is not distinct from new.title then
    return new;
  end if;

  select id into recent_id
  from public.chapter_revisions
  where chapter_id = old.id
    and created_at > now() - interval '10 minutes'
  order by created_at desc
  limit 1;

  if recent_id is null then
    insert into public.chapter_revisions (chapter_id, title, content, word_count)
    values (old.id, old.title, old.content, old.word_count);
  else
    update public.chapter_revisions
    set title = old.title,
        content = old.content,
        word_count = old.word_count,
        created_at = now()
    where id = recent_id;
  end if;

  return new;
end;
$$;

drop trigger if exists capture_chapter_revision_on_update on public.chapters;
create trigger capture_chapter_revision_on_update
  before update of title, content on public.chapters
  for each row execute function public.capture_chapter_revision();
