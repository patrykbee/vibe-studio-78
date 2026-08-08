INSERT INTO public.profiles (id, username, birth_date)
SELECT u.id,
       COALESCE(u.raw_user_meta_data->>'username', 'user_' || substr(u.id::text, 1, 8)),
       NULLIF(u.raw_user_meta_data->>'birth_date', '')::date
FROM auth.users u
ON CONFLICT (id) DO NOTHING;