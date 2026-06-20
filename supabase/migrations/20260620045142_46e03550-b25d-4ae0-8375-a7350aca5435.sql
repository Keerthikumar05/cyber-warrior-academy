
ALTER VIEW public.leaderboard_alltime SET (security_invoker = true);
ALTER VIEW public.leaderboard_weekly SET (security_invoker = true);

REVOKE EXECUTE ON FUNCTION public.bump_forum_vote() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.bump_reply_count() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.touch_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
