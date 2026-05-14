ALTER TABLE public.manuscripts DROP CONSTRAINT manuscripts_author_id_fkey;
ALTER TABLE public.manuscripts
  ADD CONSTRAINT manuscripts_author_id_fkey
  FOREIGN KEY (author_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
NOTIFY pgrst, 'reload schema';