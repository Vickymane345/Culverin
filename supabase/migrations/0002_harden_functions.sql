-- Clears two Supabase security advisor warnings.

-- Pin the search path on the updated_at trigger function.
alter function public.touch_updated_at() set search_path = '';

-- handle_new_user only ever runs as a trigger on sign-up. Nobody needs to
-- call it through the API.
revoke execute on function public.handle_new_user() from public, anon, authenticated;

-- is_admin is used inside row level security policies, so signed-in users
-- must keep execute rights. Visitors who are not signed in never need it.
revoke execute on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;
