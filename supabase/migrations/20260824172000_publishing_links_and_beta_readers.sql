-- Generate stable public slugs for published books.
create or replace function public.ensure_manuscript_slug()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  base_slug text;
  candidate text;
  suffix integer := 1;
begin
  if new.status <> 'published' or new.slug is not null then
    return new;
  end if;

  base_slug := trim(both '-' from regexp_replace(lower(coalesce(new.title, 'book')), '[^a-z0-9]+', '-', 'g'));
  if base_slug = '' then base_slug := 'book'; end if;
  candidate := base_slug;

  while exists (select 1 from public.manuscripts where slug = candidate and id <> new.id) loop
    suffix := suffix + 1;
    candidate := base_slug || '-' || suffix::text;
  end loop;

  new.slug := candidate;
  return new;
end;
$$;

drop trigger if exists ensure_manuscript_slug_before_write on public.manuscripts;
create trigger ensure_manuscript_slug_before_write
  before insert or update of status, title, slug on public.manuscripts
  for each row execute function public.ensure_manuscript_slug();

update public.manuscripts set slug = null
where status = 'published' and slug is null;

-- A token grants read-only access to one draft and its chapters for beta review.
create or replace function public.get_beta_book(_token text)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select jsonb_build_object(
    'id', m.id,
    'title', m.title,
    'synopsis', m.synopsis,
    'genre', m.genre,
    'cover_url', m.cover_url,
    'word_count', m.word_count,
    'author', p.pen_name,
    'chapters', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', c.id,
        'title', c.title,
        'content', c.content,
        'word_count', c.word_count
      ) order by c."order")
      from public.chapters c
      where c.manuscript_id = m.id
    ), '[]'::jsonb)
  )
  from public.beta_invites b
  join public.manuscripts m on m.id = b.manuscript_id
  join public.profiles p on p.id = m.author_id
  where b.token = _token
  limit 1;
$$;

revoke all on function public.get_beta_book(text) from public;
grant execute on function public.get_beta_book(text) to anon, authenticated;
