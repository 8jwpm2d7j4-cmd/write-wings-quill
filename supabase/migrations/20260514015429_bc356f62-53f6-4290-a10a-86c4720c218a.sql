
-- profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  pen_name text not null,
  bio text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
create policy "Profiles are viewable by everyone" on public.profiles for select using (true);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, pen_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'pen_name', split_part(new.email, '@', 1)));
  insert into public.writing_goals (user_id) values (new.id) on conflict do nothing;
  return new;
end;
$$;

-- manuscripts
create type public.manuscript_status as enum ('draft', 'published');

create table public.manuscripts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'Untitled',
  synopsis text,
  genre text,
  cover_url text,
  status public.manuscript_status not null default 'draft',
  word_count int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.manuscripts enable row level security;
create policy "Published manuscripts viewable by everyone"
  on public.manuscripts for select
  using (status = 'published' or auth.uid() = author_id);
create policy "Authors insert own manuscripts"
  on public.manuscripts for insert with check (auth.uid() = author_id);
create policy "Authors update own manuscripts"
  on public.manuscripts for update using (auth.uid() = author_id);
create policy "Authors delete own manuscripts"
  on public.manuscripts for delete using (auth.uid() = author_id);

-- chapters
create table public.chapters (
  id uuid primary key default gen_random_uuid(),
  manuscript_id uuid not null references public.manuscripts(id) on delete cascade,
  title text not null default 'New chapter',
  content text not null default '',
  "order" int not null default 0,
  word_count int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.chapters enable row level security;
create policy "Chapters viewable when manuscript visible"
  on public.chapters for select
  using (exists (
    select 1 from public.manuscripts m
    where m.id = chapters.manuscript_id
      and (m.status = 'published' or m.author_id = auth.uid())
  ));
create policy "Authors manage own chapters"
  on public.chapters for all
  using (exists (select 1 from public.manuscripts m where m.id = chapters.manuscript_id and m.author_id = auth.uid()))
  with check (exists (select 1 from public.manuscripts m where m.id = chapters.manuscript_id and m.author_id = auth.uid()));

-- likes
create table public.likes (
  user_id uuid not null references auth.users(id) on delete cascade,
  manuscript_id uuid not null references public.manuscripts(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, manuscript_id)
);
alter table public.likes enable row level security;
create policy "Likes viewable by everyone" on public.likes for select using (true);
create policy "Users like as themselves" on public.likes for insert with check (auth.uid() = user_id);
create policy "Users unlike own" on public.likes for delete using (auth.uid() = user_id);

-- comments
create table public.comments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  manuscript_id uuid not null references public.manuscripts(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);
alter table public.comments enable row level security;
create policy "Comments viewable by everyone" on public.comments for select using (true);
create policy "Users insert own comments" on public.comments for insert with check (auth.uid() = user_id);
create policy "Users delete own comments" on public.comments for delete using (auth.uid() = user_id);

-- writing goals
create table public.writing_goals (
  user_id uuid primary key references auth.users(id) on delete cascade,
  daily_target int not null default 500,
  current_streak int not null default 0,
  longest_streak int not null default 0,
  last_logged_date date,
  total_words int not null default 0,
  updated_at timestamptz not null default now()
);
alter table public.writing_goals enable row level security;
create policy "Users view own goals" on public.writing_goals for select using (auth.uid() = user_id);
create policy "Users insert own goals" on public.writing_goals for insert with check (auth.uid() = user_id);
create policy "Users update own goals" on public.writing_goals for update using (auth.uid() = user_id);

-- beta invites
create table public.beta_invites (
  id uuid primary key default gen_random_uuid(),
  manuscript_id uuid not null references public.manuscripts(id) on delete cascade,
  token text not null unique default encode(gen_random_bytes(16), 'hex'),
  created_at timestamptz not null default now()
);
alter table public.beta_invites enable row level security;
create policy "Authors manage invites"
  on public.beta_invites for all
  using (exists (select 1 from public.manuscripts m where m.id = beta_invites.manuscript_id and m.author_id = auth.uid()))
  with check (exists (select 1 from public.manuscripts m where m.id = beta_invites.manuscript_id and m.author_id = auth.uid()));

-- trigger for new users
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- updated_at trigger helper
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

create trigger touch_profiles before update on public.profiles for each row execute function public.touch_updated_at();
create trigger touch_manuscripts before update on public.manuscripts for each row execute function public.touch_updated_at();
create trigger touch_chapters before update on public.chapters for each row execute function public.touch_updated_at();

-- storage bucket for covers
insert into storage.buckets (id, name, public) values ('covers', 'covers', true)
  on conflict (id) do nothing;

create policy "Covers public read" on storage.objects for select using (bucket_id = 'covers');
create policy "Authors upload covers" on storage.objects for insert
  with check (bucket_id = 'covers' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "Authors update own covers" on storage.objects for update
  using (bucket_id = 'covers' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "Authors delete own covers" on storage.objects for delete
  using (bucket_id = 'covers' and auth.uid()::text = (storage.foldername(name))[1]);
