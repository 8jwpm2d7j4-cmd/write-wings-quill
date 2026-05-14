
-- 1. Bookmarks
create table public.bookmarks (
  user_id uuid not null,
  manuscript_id uuid not null,
  created_at timestamptz not null default now(),
  primary key (user_id, manuscript_id)
);
alter table public.bookmarks enable row level security;
create policy "Bookmarks viewable by owner" on public.bookmarks for select using (auth.uid() = user_id);
create policy "Users add own bookmarks" on public.bookmarks for insert with check (auth.uid() = user_id);
create policy "Users remove own bookmarks" on public.bookmarks for delete using (auth.uid() = user_id);

-- 2. Reading progress
create table public.reading_progress (
  user_id uuid not null,
  manuscript_id uuid not null,
  chapter_id uuid,
  scroll_pct integer not null default 0,
  updated_at timestamptz not null default now(),
  primary key (user_id, manuscript_id)
);
alter table public.reading_progress enable row level security;
create policy "Progress viewable by owner" on public.reading_progress for select using (auth.uid() = user_id);
create policy "Users upsert own progress" on public.reading_progress for insert with check (auth.uid() = user_id);
create policy "Users update own progress" on public.reading_progress for update using (auth.uid() = user_id);

-- 3. Notifications
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  actor_id uuid,
  kind text not null,
  manuscript_id uuid,
  message text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.notifications enable row level security;
create index notifications_user_idx on public.notifications (user_id, created_at desc);
create policy "Users view own notifications" on public.notifications for select using (auth.uid() = user_id);
create policy "Users mark own notifications" on public.notifications for update using (auth.uid() = user_id);
create policy "Authenticated insert notifications" on public.notifications for insert with check (auth.uid() = actor_id or actor_id is null);

-- 4. Content reports (moderation)
create table public.content_reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null,
  manuscript_id uuid,
  comment_id uuid,
  reason text not null,
  details text,
  status text not null default 'open',
  created_at timestamptz not null default now()
);
alter table public.content_reports enable row level security;
create policy "Users create own reports" on public.content_reports for insert with check (auth.uid() = reporter_id);
create policy "Users view own reports" on public.content_reports for select using (auth.uid() = reporter_id);

-- 5. Comment likes
create table public.comment_likes (
  user_id uuid not null,
  comment_id uuid not null,
  created_at timestamptz not null default now(),
  primary key (user_id, comment_id)
);
alter table public.comment_likes enable row level security;
create policy "Comment likes viewable by all" on public.comment_likes for select using (true);
create policy "Users like comments" on public.comment_likes for insert with check (auth.uid() = user_id);
create policy "Users unlike comments" on public.comment_likes for delete using (auth.uid() = user_id);
