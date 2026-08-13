ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS full_name text,
  ADD COLUMN IF NOT EXISTS instagram_id text,
  ADD COLUMN IF NOT EXISTS bio text;