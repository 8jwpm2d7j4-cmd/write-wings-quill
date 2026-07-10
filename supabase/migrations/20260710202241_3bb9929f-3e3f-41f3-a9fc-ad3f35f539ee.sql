-- Ensure paid chapter content is never readable via direct table SELECT.
-- Force clients through get_chapter_content() RPC which enforces payment/author checks.
REVOKE ALL ON public.chapters FROM anon, authenticated, PUBLIC;
GRANT SELECT (id, manuscript_id, title, "order", word_count, created_at, updated_at, is_paid, unlock_price_cents) ON public.chapters TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.chapters TO authenticated;
GRANT ALL ON public.chapters TO service_role;