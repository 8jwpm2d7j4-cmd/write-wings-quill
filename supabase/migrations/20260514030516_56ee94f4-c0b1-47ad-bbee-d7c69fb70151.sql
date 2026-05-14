
-- Manuscripts: slug + featured
alter table public.manuscripts add column if not exists slug text unique;
alter table public.manuscripts add column if not exists is_featured boolean not null default false;

-- Chapters: paid gating
alter table public.chapters add column if not exists is_paid boolean not null default false;
alter table public.chapters add column if not exists unlock_price_cents integer;

-- Profiles: reminder + notif prefs
alter table public.profiles add column if not exists daily_reminder_at time;
alter table public.profiles add column if not exists email_notifications boolean not null default true;
alter table public.profiles add column if not exists genres text[] default '{}';
alter table public.profiles add column if not exists onboarded boolean not null default false;

-- Comments: optional chapter scope
alter table public.comments add column if not exists chapter_id uuid;

-- TIPS
create table if not exists public.tips (
  id uuid primary key default gen_random_uuid(),
  from_user_id uuid not null,
  to_user_id uuid not null,
  manuscript_id uuid,
  amount_cents integer not null,
  paddle_transaction_id text unique,
  environment text not null default 'sandbox',
  created_at timestamptz not null default now()
);
alter table public.tips enable row level security;
create policy "Tips viewable by sender or recipient" on public.tips for select using (auth.uid() = from_user_id or auth.uid() = to_user_id);
create policy "Service role manages tips" on public.tips for all using (auth.role() = 'service_role');
create index if not exists idx_tips_to on public.tips(to_user_id);

-- CHAPTER UNLOCKS
create table if not exists public.chapter_unlocks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  chapter_id uuid not null,
  amount_cents integer not null,
  paddle_transaction_id text unique,
  environment text not null default 'sandbox',
  created_at timestamptz not null default now(),
  unique(user_id, chapter_id)
);
alter table public.chapter_unlocks enable row level security;
create policy "Users view own unlocks" on public.chapter_unlocks for select using (auth.uid() = user_id);
create policy "Service role manages unlocks" on public.chapter_unlocks for all using (auth.role() = 'service_role');

-- READING STREAKS
create table if not exists public.reading_streaks (
  user_id uuid primary key,
  current_streak integer not null default 0,
  longest_streak integer not null default 0,
  last_read_date date,
  updated_at timestamptz not null default now()
);
alter table public.reading_streaks enable row level security;
create policy "Users view own reading streak" on public.reading_streaks for select using (auth.uid() = user_id);
create policy "Users upsert own reading streak" on public.reading_streaks for insert with check (auth.uid() = user_id);
create policy "Users update own reading streak" on public.reading_streaks for update using (auth.uid() = user_id);

-- DAILY WORD LOG
create table if not exists public.daily_word_log (
  user_id uuid not null,
  date date not null,
  words integer not null default 0,
  primary key (user_id, date)
);
alter table public.daily_word_log enable row level security;
create policy "Users view own word log" on public.daily_word_log for select using (auth.uid() = user_id);
create policy "Users insert own word log" on public.daily_word_log for insert with check (auth.uid() = user_id);
create policy "Users update own word log" on public.daily_word_log for update using (auth.uid() = user_id);

-- ACHIEVEMENTS
create table if not exists public.achievements (
  code text primary key,
  title text not null,
  description text not null,
  icon text not null default '🏆'
);
alter table public.achievements enable row level security;
create policy "Achievements viewable by all" on public.achievements for select using (true);

create table if not exists public.user_achievements (
  user_id uuid not null,
  code text not null references public.achievements(code) on delete cascade,
  earned_at timestamptz not null default now(),
  primary key (user_id, code)
);
alter table public.user_achievements enable row level security;
create policy "User achievements viewable by everyone" on public.user_achievements for select using (true);
create policy "Users insert own achievements" on public.user_achievements for insert with check (auth.uid() = user_id);

insert into public.achievements (code, title, description, icon) values
  ('first_words', 'First Words', 'Wrote your first 100 words', '✍️'),
  ('thousand_words', 'Wordsmith', 'Reached 1,000 total words', '📜'),
  ('ten_thousand', 'Novelist', '10,000 words and counting', '📚'),
  ('first_publish', 'Published Author', 'Published your first work', '🎉'),
  ('streak_7', 'Week of Words', '7-day writing streak', '🔥'),
  ('streak_30', 'Month of Mastery', '30-day writing streak', '⚡'),
  ('first_tip', 'Patron', 'Tipped an author', '💝'),
  ('first_follower', 'Notable', 'Got your first follower', '✨')
on conflict (code) do nothing;

-- REACTIONS
create table if not exists public.reactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  chapter_id uuid not null,
  emoji text not null,
  created_at timestamptz not null default now(),
  unique(user_id, chapter_id, emoji)
);
alter table public.reactions enable row level security;
create policy "Reactions viewable by all" on public.reactions for select using (true);
create policy "Users add own reactions" on public.reactions for insert with check (auth.uid() = user_id);
create policy "Users remove own reactions" on public.reactions for delete using (auth.uid() = user_id);

-- FOLLOWS
create table if not exists public.follows (
  follower_id uuid not null,
  following_id uuid not null,
  created_at timestamptz not null default now(),
  primary key (follower_id, following_id),
  check (follower_id <> following_id)
);
alter table public.follows enable row level security;
create policy "Follows viewable by all" on public.follows for select using (true);
create policy "Users follow as themselves" on public.follows for insert with check (auth.uid() = follower_id);
create policy "Users unfollow own" on public.follows for delete using (auth.uid() = follower_id);

-- NOTES (worldbuilding)
create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  manuscript_id uuid not null,
  kind text not null default 'note',
  title text not null default 'Untitled',
  body text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.notes enable row level security;
create policy "Authors manage own notes" on public.notes for all
  using (exists (select 1 from public.manuscripts m where m.id = notes.manuscript_id and m.author_id = auth.uid()))
  with check (exists (select 1 from public.manuscripts m where m.id = notes.manuscript_id and m.author_id = auth.uid()));

-- REVISIONS
create table if not exists public.chapter_revisions (
  id uuid primary key default gen_random_uuid(),
  chapter_id uuid not null,
  content text not null,
  word_count integer not null default 0,
  created_at timestamptz not null default now()
);
alter table public.chapter_revisions enable row level security;
create policy "Authors view own revisions" on public.chapter_revisions for select
  using (exists (select 1 from public.chapters c join public.manuscripts m on m.id = c.manuscript_id where c.id = chapter_revisions.chapter_id and m.author_id = auth.uid()));
create policy "Authors insert own revisions" on public.chapter_revisions for insert
  with check (exists (select 1 from public.chapters c join public.manuscripts m on m.id = c.manuscript_id where c.id = chapter_revisions.chapter_id and m.author_id = auth.uid()));
create index if not exists idx_revisions_chapter on public.chapter_revisions(chapter_id, created_at desc);
