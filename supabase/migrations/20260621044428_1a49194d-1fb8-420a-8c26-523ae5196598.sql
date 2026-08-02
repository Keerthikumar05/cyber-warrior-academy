
-- Atomic mission completion: progress, XP, coins, level, streak, badge, and quest progression in one txn.
CREATE OR REPLACE FUNCTION public.complete_mission(
  _world text,
  _mission text,
  _xp integer,
  _badge text DEFAULT NULL,
  _badge_name text DEFAULT NULL,
  _score integer DEFAULT 100
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid := auth.uid();
  first_time boolean := false;
  inserted_count int := 0;
  today_d date := CURRENT_DATE;
  q record;
  quest_events jsonb := '[]'::jsonb;
  world_done int;
  awarded_xp int := 0;
  cur_progress int;
  is_completed boolean;
  newly boolean;
  last_date date;
  cur_streak int;
  new_streak int;
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'not authenticated'; END IF;

  -- Race-safe first-time detection: insert only if it does not already exist completed.
  INSERT INTO public.user_progress(user_id, world_slug, mission_slug, step_index, completed, completed_at, best_score, attempts)
  VALUES (uid, _world, _mission, 999, true, now(), COALESCE(_score,100), 1)
  ON CONFLICT (user_id, world_slug, mission_slug) DO NOTHING;

  GET DIAGNOSTICS inserted_count = ROW_COUNT;
  first_time := inserted_count = 1;

  IF NOT first_time THEN
    -- Already completed before: bump attempt, raise best score, no rewards.
    UPDATE public.user_progress
       SET best_score = GREATEST(best_score, COALESCE(_score,100)),
           attempts   = attempts + 1,
           updated_at = now()
     WHERE user_id = uid AND world_slug = _world AND mission_slug = _mission;
  ELSE
    awarded_xp := _xp;
    INSERT INTO public.user_xp_events(user_id, amount, source, mission_slug)
    VALUES (uid, _xp, 'mission_complete', _world || '/' || _mission);

    SELECT current_streak, last_active_date INTO cur_streak, last_date
      FROM public.profiles WHERE id = uid FOR UPDATE;
    new_streak := CASE
      WHEN last_date = today_d THEN GREATEST(cur_streak, 1)
      WHEN last_date = today_d - 1 THEN COALESCE(cur_streak,0) + 1
      ELSE 1
    END;

    UPDATE public.profiles
       SET xp = xp + _xp,
           coins = coins + GREATEST(0, _xp/2),
           level = GREATEST(1, FLOOR((xp + _xp)/100)::int + 1),
           current_streak = new_streak,
           last_active_date = today_d
     WHERE id = uid;

    IF _badge IS NOT NULL THEN
      INSERT INTO public.user_badges(user_id, badge_slug)
      VALUES (uid, _badge)
      ON CONFLICT DO NOTHING;
    END IF;

    -- Quest progression: only on first-time completion.
    FOR q IN SELECT * FROM public.daily_quests WHERE active = true LOOP
      IF q.quest_type NOT IN ('complete_missions','earn_xp','complete_world') THEN
        CONTINUE;
      END IF;

      INSERT INTO public.user_quest_progress(user_id, quest_id, quest_date, progress, completed, claimed)
      VALUES (uid, q.id, today_d, 0, false, false)
      ON CONFLICT (user_id, quest_id, quest_date) DO NOTHING;

      SELECT progress, completed INTO cur_progress, is_completed
        FROM public.user_quest_progress
       WHERE user_id = uid AND quest_id = q.id AND quest_date = today_d;

      IF is_completed THEN
        CONTINUE;
      END IF;

      IF q.quest_type = 'complete_missions' THEN
        cur_progress := cur_progress + 1;
      ELSIF q.quest_type = 'earn_xp' THEN
        cur_progress := cur_progress + _xp;
      ELSIF q.quest_type = 'complete_world' THEN
        SELECT COUNT(*) INTO world_done
          FROM public.user_progress
         WHERE user_id = uid AND world_slug = _world AND completed = true;
        cur_progress := world_done;
      END IF;

      newly := cur_progress >= q.target;
      UPDATE public.user_quest_progress
         SET progress = LEAST(cur_progress, q.target),
             completed = newly,
             updated_at = now()
       WHERE user_id = uid AND quest_id = q.id AND quest_date = today_d;

      quest_events := quest_events || jsonb_build_object(
        'slug', q.slug,
        'title', q.title,
        'quest_type', q.quest_type,
        'progress', LEAST(cur_progress, q.target),
        'target', q.target,
        'newly_completed', newly,
        'xp_reward', q.xp_reward,
        'coin_reward', q.coin_reward
      );
    END LOOP;
  END IF;

  RETURN jsonb_build_object(
    'first_time', first_time,
    'xp_awarded', awarded_xp,
    'quests', quest_events
  );
END $$;

GRANT EXECUTE ON FUNCTION public.complete_mission(text,text,integer,text,text,integer) TO authenticated;

-- Race-safe quest reward claim: only awards if completed and not already claimed.
CREATE OR REPLACE FUNCTION public.claim_quest_reward(_quest_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid := auth.uid();
  today_d date := CURRENT_DATE;
  q record;
  upd_count int;
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'not authenticated'; END IF;
  SELECT * INTO q FROM public.daily_quests WHERE id = _quest_id AND active = true;
  IF NOT FOUND THEN RAISE EXCEPTION 'quest not found'; END IF;

  UPDATE public.user_quest_progress
     SET claimed = true, updated_at = now()
   WHERE user_id = uid AND quest_id = _quest_id AND quest_date = today_d
     AND completed = true AND claimed = false;

  GET DIAGNOSTICS upd_count = ROW_COUNT;
  IF upd_count = 0 THEN
    RETURN jsonb_build_object('claimed', false, 'reason', 'not_completed_or_already_claimed');
  END IF;

  INSERT INTO public.user_xp_events(user_id, amount, source, mission_slug)
  VALUES (uid, q.xp_reward, 'daily_quest', q.slug);

  UPDATE public.profiles
     SET xp = xp + q.xp_reward,
         coins = coins + q.coin_reward,
         level = GREATEST(1, FLOOR((xp + q.xp_reward)/100)::int + 1),
         last_active_date = today_d
   WHERE id = uid;

  RETURN jsonb_build_object('claimed', true, 'xp', q.xp_reward, 'coins', q.coin_reward);
END $$;

GRANT EXECUTE ON FUNCTION public.claim_quest_reward(uuid) TO authenticated;

-- Add a world-completion daily quest
INSERT INTO public.daily_quests (slug, title, description, quest_type, target, xp_reward, coin_reward, active)
VALUES ('finish-world', 'World Conqueror', 'Complete every mission in a world today.', 'complete_world', 4, 300, 80, true)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  quest_type = EXCLUDED.quest_type,
  target = EXCLUDED.target,
  xp_reward = EXCLUDED.xp_reward,
  coin_reward = EXCLUDED.coin_reward,
  active = true;

-- Enable realtime for HUD live quest updates
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'user_quest_progress'
  ) THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.user_quest_progress';
  END IF;
END $$;
