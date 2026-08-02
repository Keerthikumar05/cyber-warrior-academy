
-- PROFILES
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT,
  avatar_url TEXT,
  level INT NOT NULL DEFAULT 1,
  xp INT NOT NULL DEFAULT 0,
  coins INT NOT NULL DEFAULT 0,
  current_streak INT NOT NULL DEFAULT 0,
  last_active_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own profile read" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "own profile insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "own profile update" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- USER PROGRESS
CREATE TABLE public.user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  world_slug TEXT NOT NULL,
  mission_slug TEXT NOT NULL,
  step_index INT NOT NULL DEFAULT 0,
  completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMPTZ,
  best_score INT NOT NULL DEFAULT 0,
  attempts INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, world_slug, mission_slug)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_progress TO authenticated;
GRANT ALL ON public.user_progress TO service_role;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own progress all" ON public.user_progress FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- XP EVENTS
CREATE TABLE public.user_xp_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount INT NOT NULL,
  source TEXT NOT NULL,
  mission_slug TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.user_xp_events TO authenticated;
GRANT ALL ON public.user_xp_events TO service_role;
ALTER TABLE public.user_xp_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own xp read" ON public.user_xp_events FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own xp insert" ON public.user_xp_events FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- BADGES
CREATE TABLE public.user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_slug TEXT NOT NULL,
  earned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, badge_slug)
);
GRANT SELECT, INSERT ON public.user_badges TO authenticated;
GRANT ALL ON public.user_badges TO service_role;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own badges read" ON public.user_badges FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own badges insert" ON public.user_badges FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- MENTOR MESSAGES
CREATE TABLE public.mentor_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user','assistant','system')),
  content TEXT NOT NULL,
  context JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, DELETE ON public.mentor_messages TO authenticated;
GRANT ALL ON public.mentor_messages TO service_role;
ALTER TABLE public.mentor_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own mentor all" ON public.mentor_messages FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX mentor_messages_user_created_idx ON public.mentor_messages(user_id, created_at DESC);

-- CODE SUBMISSIONS
CREATE TABLE public.code_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mission_slug TEXT NOT NULL,
  language TEXT NOT NULL,
  code TEXT NOT NULL,
  passed BOOLEAN NOT NULL DEFAULT false,
  output TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.code_submissions TO authenticated;
GRANT ALL ON public.code_submissions TO service_role;
ALTER TABLE public.code_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own subs all" ON public.code_submissions FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- AUTO-CREATE PROFILE ON SIGNUP
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'username', SPLIT_PART(NEW.email,'@',1), 'CodeWarrior'));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- UPDATED_AT TRIGGER
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;
CREATE TRIGGER profiles_touch BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER user_progress_touch BEFORE UPDATE ON public.user_progress
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- LEVEL CALCULATION + XP AWARD RPC
CREATE OR REPLACE FUNCTION public.award_xp(_amount INT, _source TEXT, _mission TEXT DEFAULT NULL)
RETURNS TABLE(new_xp INT, new_level INT, leveled_up BOOLEAN)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  uid UUID := auth.uid();
  old_level INT;
  cur_xp INT;
  cur_level INT;
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'not authenticated'; END IF;
  INSERT INTO public.user_xp_events(user_id, amount, source, mission_slug)
  VALUES (uid, _amount, _source, _mission);
  SELECT level, xp INTO old_level, cur_xp FROM public.profiles WHERE id = uid FOR UPDATE;
  cur_xp := COALESCE(cur_xp,0) + _amount;
  -- Level curve: level n requires n*100 cumulative XP buckets of 100
  cur_level := GREATEST(1, FLOOR(cur_xp / 100)::INT + 1);
  UPDATE public.profiles
    SET xp = cur_xp,
        level = cur_level,
        coins = coins + GREATEST(0, _amount / 2),
        last_active_date = CURRENT_DATE
  WHERE id = uid;
  RETURN QUERY SELECT cur_xp, cur_level, (cur_level > old_level);
END;
$$;
GRANT EXECUTE ON FUNCTION public.award_xp(INT, TEXT, TEXT) TO authenticated;
