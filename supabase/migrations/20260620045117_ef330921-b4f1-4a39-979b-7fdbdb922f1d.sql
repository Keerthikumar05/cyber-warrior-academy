
-- =====================================================
-- ROLES (for mentor/admin pinning)
-- =====================================================
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'mentor', 'user');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- =====================================================
-- LEADERBOARDS (view over profiles + xp events)
-- =====================================================
CREATE OR REPLACE VIEW public.leaderboard_alltime AS
  SELECT id AS user_id, username, avatar_url, level, xp,
         RANK() OVER (ORDER BY xp DESC) AS rank
  FROM public.profiles
  WHERE xp > 0;

CREATE OR REPLACE VIEW public.leaderboard_weekly AS
  SELECT p.id AS user_id, p.username, p.avatar_url, p.level,
         COALESCE(SUM(e.amount), 0)::INT AS weekly_xp,
         RANK() OVER (ORDER BY COALESCE(SUM(e.amount), 0) DESC) AS rank
  FROM public.profiles p
  LEFT JOIN public.user_xp_events e
    ON e.user_id = p.id AND e.created_at >= date_trunc('week', now())
  GROUP BY p.id
  HAVING COALESCE(SUM(e.amount), 0) > 0;

GRANT SELECT ON public.leaderboard_alltime TO authenticated, anon;
GRANT SELECT ON public.leaderboard_weekly TO authenticated, anon;

-- =====================================================
-- DAILY QUESTS
-- =====================================================
CREATE TABLE public.daily_quests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  quest_type TEXT NOT NULL, -- 'complete_missions' | 'earn_xp' | 'win_battles' | 'forum_help'
  target INT NOT NULL,
  xp_reward INT NOT NULL DEFAULT 50,
  coin_reward INT NOT NULL DEFAULT 10,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.daily_quests TO authenticated, anon;
GRANT ALL ON public.daily_quests TO service_role;
ALTER TABLE public.daily_quests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read quests" ON public.daily_quests FOR SELECT TO authenticated, anon USING (active);

CREATE TABLE public.user_quest_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quest_id UUID NOT NULL REFERENCES public.daily_quests(id) ON DELETE CASCADE,
  quest_date DATE NOT NULL DEFAULT CURRENT_DATE,
  progress INT NOT NULL DEFAULT 0,
  completed BOOLEAN NOT NULL DEFAULT false,
  claimed BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, quest_id, quest_date)
);
GRANT SELECT, INSERT, UPDATE ON public.user_quest_progress TO authenticated;
GRANT ALL ON public.user_quest_progress TO service_role;
ALTER TABLE public.user_quest_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own quest progress" ON public.user_quest_progress FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER touch_quest_progress BEFORE UPDATE ON public.user_quest_progress
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Streak shields & multipliers on profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS streak_shields INT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS xp_multiplier_until TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS xp_multiplier_value NUMERIC NOT NULL DEFAULT 1.0;

-- =====================================================
-- 1v1 BATTLES
-- =====================================================
CREATE TABLE public.battle_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  skill_level INT NOT NULL DEFAULT 1,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, DELETE ON public.battle_queue TO authenticated;
GRANT ALL ON public.battle_queue TO service_role;
ALTER TABLE public.battle_queue ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read queue" ON public.battle_queue FOR SELECT TO authenticated USING (true);
CREATE POLICY "own queue insert" ON public.battle_queue FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own queue delete" ON public.battle_queue FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TABLE public.battles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_a UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  player_b UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  problem_slug TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active', -- 'active' | 'finished' | 'abandoned'
  winner UUID REFERENCES auth.users(id),
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  finished_at TIMESTAMPTZ
);
GRANT SELECT, INSERT, UPDATE ON public.battles TO authenticated;
GRANT ALL ON public.battles TO service_role;
ALTER TABLE public.battles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "participants read" ON public.battles FOR SELECT TO authenticated
  USING (auth.uid() = player_a OR auth.uid() = player_b);
CREATE POLICY "participants update" ON public.battles FOR UPDATE TO authenticated
  USING (auth.uid() = player_a OR auth.uid() = player_b);

CREATE TABLE public.battle_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  battle_id UUID NOT NULL REFERENCES public.battles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  passed BOOLEAN NOT NULL DEFAULT false,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.battle_submissions TO authenticated;
GRANT ALL ON public.battle_submissions TO service_role;
ALTER TABLE public.battle_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "battle participants read subs" ON public.battle_submissions FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.battles b WHERE b.id = battle_id AND (b.player_a = auth.uid() OR b.player_b = auth.uid())));
CREATE POLICY "own sub insert" ON public.battle_submissions FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

ALTER PUBLICATION supabase_realtime ADD TABLE public.battle_queue;
ALTER PUBLICATION supabase_realtime ADD TABLE public.battles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.battle_submissions;

-- =====================================================
-- GUILDS & FORUMS
-- =====================================================
CREATE TABLE public.guilds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  tag TEXT NOT NULL UNIQUE,
  description TEXT,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  member_count INT NOT NULL DEFAULT 1,
  total_xp INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.guilds TO authenticated;
GRANT SELECT ON public.guilds TO anon;
GRANT ALL ON public.guilds TO service_role;
ALTER TABLE public.guilds ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read guilds" ON public.guilds FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "create guild" ON public.guilds FOR INSERT TO authenticated WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "owner updates guild" ON public.guilds FOR UPDATE TO authenticated USING (auth.uid() = owner_id);

CREATE TABLE public.guild_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guild_id UUID NOT NULL REFERENCES public.guilds(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member', -- 'owner' | 'officer' | 'member'
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (guild_id, user_id),
  UNIQUE (user_id)
);
GRANT SELECT, INSERT, DELETE ON public.guild_members TO authenticated;
GRANT SELECT ON public.guild_members TO anon;
GRANT ALL ON public.guild_members TO service_role;
ALTER TABLE public.guild_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read members" ON public.guild_members FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "join guild" ON public.guild_members FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "leave guild" ON public.guild_members FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TABLE public.forum_threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  world_slug TEXT,
  mission_slug TEXT,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  upvotes INT NOT NULL DEFAULT 0,
  reply_count INT NOT NULL DEFAULT 0,
  pinned BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.forum_threads TO authenticated;
GRANT SELECT ON public.forum_threads TO anon;
GRANT ALL ON public.forum_threads TO service_role;
ALTER TABLE public.forum_threads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read threads" ON public.forum_threads FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "create thread" ON public.forum_threads FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);
CREATE POLICY "edit own thread" ON public.forum_threads FOR UPDATE TO authenticated
  USING (auth.uid() = author_id OR public.has_role(auth.uid(), 'mentor') OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (auth.uid() = author_id OR public.has_role(auth.uid(), 'mentor') OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "delete own thread" ON public.forum_threads FOR DELETE TO authenticated USING (auth.uid() = author_id);

CREATE TRIGGER touch_forum_threads BEFORE UPDATE ON public.forum_threads
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TABLE public.forum_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID NOT NULL REFERENCES public.forum_threads(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  upvotes INT NOT NULL DEFAULT 0,
  is_mentor_answer BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.forum_replies TO authenticated;
GRANT SELECT ON public.forum_replies TO anon;
GRANT ALL ON public.forum_replies TO service_role;
ALTER TABLE public.forum_replies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read replies" ON public.forum_replies FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "create reply" ON public.forum_replies FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);
CREATE POLICY "edit own reply" ON public.forum_replies FOR UPDATE TO authenticated
  USING (auth.uid() = author_id OR public.has_role(auth.uid(), 'mentor') OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "delete own reply" ON public.forum_replies FOR DELETE TO authenticated USING (auth.uid() = author_id);

CREATE TABLE public.forum_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  thread_id UUID REFERENCES public.forum_threads(id) ON DELETE CASCADE,
  reply_id UUID REFERENCES public.forum_replies(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK ((thread_id IS NOT NULL) <> (reply_id IS NOT NULL)),
  UNIQUE (user_id, thread_id),
  UNIQUE (user_id, reply_id)
);
GRANT SELECT, INSERT, DELETE ON public.forum_votes TO authenticated;
GRANT ALL ON public.forum_votes TO service_role;
ALTER TABLE public.forum_votes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read votes" ON public.forum_votes FOR SELECT TO authenticated USING (true);
CREATE POLICY "own vote" ON public.forum_votes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "remove own vote" ON public.forum_votes FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Vote counter triggers
CREATE OR REPLACE FUNCTION public.bump_forum_vote() RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.thread_id IS NOT NULL THEN UPDATE public.forum_threads SET upvotes = upvotes + 1 WHERE id = NEW.thread_id;
    ELSE UPDATE public.forum_replies SET upvotes = upvotes + 1 WHERE id = NEW.reply_id; END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.thread_id IS NOT NULL THEN UPDATE public.forum_threads SET upvotes = GREATEST(0, upvotes - 1) WHERE id = OLD.thread_id;
    ELSE UPDATE public.forum_replies SET upvotes = GREATEST(0, upvotes - 1) WHERE id = OLD.reply_id; END IF;
    RETURN OLD;
  END IF;
  RETURN NULL;
END $$;
CREATE TRIGGER forum_votes_count AFTER INSERT OR DELETE ON public.forum_votes
  FOR EACH ROW EXECUTE FUNCTION public.bump_forum_vote();

CREATE OR REPLACE FUNCTION public.bump_reply_count() RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN UPDATE public.forum_threads SET reply_count = reply_count + 1 WHERE id = NEW.thread_id;
  ELSIF TG_OP = 'DELETE' THEN UPDATE public.forum_threads SET reply_count = GREATEST(0, reply_count - 1) WHERE id = OLD.thread_id; END IF;
  RETURN NULL;
END $$;
CREATE TRIGGER forum_reply_count AFTER INSERT OR DELETE ON public.forum_replies
  FOR EACH ROW EXECUTE FUNCTION public.bump_reply_count();

-- =====================================================
-- SEED DAILY QUESTS
-- =====================================================
INSERT INTO public.daily_quests (slug, title, description, quest_type, target, xp_reward, coin_reward) VALUES
  ('complete-3', 'Triple Threat', 'Complete 3 missions today', 'complete_missions', 3, 150, 30),
  ('earn-200xp', 'XP Hunter', 'Earn 200 XP today', 'earn_xp', 200, 100, 20),
  ('win-1-battle', 'First Blood', 'Win 1 code battle today', 'win_battles', 1, 200, 50),
  ('help-2', 'Forum Helper', 'Get 2 upvotes on a forum reply', 'forum_help', 2, 120, 25)
ON CONFLICT (slug) DO NOTHING;
