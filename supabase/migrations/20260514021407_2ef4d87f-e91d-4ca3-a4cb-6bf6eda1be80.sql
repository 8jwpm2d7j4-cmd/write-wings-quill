
-- Contests
CREATE TABLE public.contests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  theme text NOT NULL,
  prize text NOT NULL DEFAULT 'Featured on Quill + $100',
  starts_at timestamptz NOT NULL DEFAULT now(),
  ends_at timestamptz NOT NULL,
  min_words int NOT NULL DEFAULT 500,
  max_words int NOT NULL DEFAULT 5000,
  members_only boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.contests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Contests viewable by everyone" ON public.contests FOR SELECT USING (true);

-- Contest entries
CREATE TABLE public.contest_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contest_id uuid NOT NULL REFERENCES public.contests(id) ON DELETE CASCADE,
  manuscript_id uuid NOT NULL,
  user_id uuid NOT NULL,
  submitted_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (contest_id, manuscript_id)
);
ALTER TABLE public.contest_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Entries viewable by everyone" ON public.contest_entries FOR SELECT USING (true);
CREATE POLICY "Authors submit own entries" ON public.contest_entries FOR INSERT WITH CHECK (
  auth.uid() = user_id AND EXISTS (
    SELECT 1 FROM public.manuscripts m WHERE m.id = contest_entries.manuscript_id AND m.author_id = auth.uid()
  )
);
CREATE POLICY "Authors withdraw own entries" ON public.contest_entries FOR DELETE USING (auth.uid() = user_id);

-- Memberships
CREATE TABLE public.memberships (
  user_id uuid PRIMARY KEY,
  tier text NOT NULL DEFAULT 'pro',
  active boolean NOT NULL DEFAULT true,
  started_at timestamptz NOT NULL DEFAULT now(),
  renews_at timestamptz,
  provider text,
  provider_customer_id text,
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own membership" ON public.memberships FOR SELECT USING (auth.uid() = user_id);

-- Seed a current contest
INSERT INTO public.contests (title, theme, prize, ends_at, min_words, max_words, members_only)
VALUES (
  'May Flash Fiction Prize',
  'Write a story that begins with a found letter.',
  'Featured on Quill homepage + $100 gift card',
  (now() + interval '21 days'),
  500, 3000, true
);
