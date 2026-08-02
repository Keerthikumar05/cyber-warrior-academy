# Phase 3.5 — Quest Auto-Progression Test Report

**Suite:** `src/lib/__tests__/quest-progression.test.ts`
**Runner:** `bun test` (Bun 1.3.3)
**Result:** ✅ 7 passed / 0 failed / 26 assertions / 28 ms

```
bun test src/lib/__tests__/quest-progression.test.ts
```

## Architecture under test

Mission completion goes through a single atomic database RPC,
`public.complete_mission(world, mission, xp, badge, badge_name, score)`,
which performs **in one transaction**:

1. Inserts `user_progress` with `ON CONFLICT DO NOTHING` to detect duplicates.
2. On **first-time** completion only:
   - Inserts an `user_xp_events` row.
   - Adds XP, coins, recomputes level, advances the daily streak, and stamps `last_active_date` on `profiles`.
   - Inserts the badge into `user_badges` (`ON CONFLICT DO NOTHING`).
   - Walks every active row in `daily_quests` and updates `user_quest_progress` for the matching `quest_type`:
     - `complete_missions` → `+1`
     - `earn_xp` → `+xp`
     - `complete_world` → recomputed as `COUNT(user_progress WHERE world=… AND completed=true)`
   - Returns a JSON envelope `{ first_time, xp_awarded, quests: [...] }` listing every quest that progressed and whether it newly completed.

Reward claiming uses a second atomic RPC, `public.claim_quest_reward(quest_id)`, which:

- Updates `user_quest_progress.claimed = true` **only if** `completed AND NOT claimed`.
- Pays out XP + coins exactly once, returning `{ claimed: true, xp, coins }` or `{ claimed: false, reason }`.

Realtime: `user_quest_progress` is published on `supabase_realtime`. The HUD (`PlayerHUD`) and the Quests page subscribe per-user and update their UI live as new RPC calls bump rows.

---

## 1. Mission completion → quest progress

| # | Scenario | Expected | Actual |
|---|---|---|---|
| 1.1 | Complete one 80-XP mission | `complete-3` → 1/3, `earn-200xp` → 80/200, `win-1-battle` untouched | ✅ |
| 1.2 | Complete 3 missions earning 220 XP total | `complete-3` newly_completed, `earn-200xp` newly_completed (capped at 200) | ✅ |

```
(pass) mission completion bumps complete_missions and earn_xp quests
(pass) third mission completes the 'Triple Threat' quest with newly_completed=true
```

## 2. Quest completion → rewards

| # | Scenario | Expected | Actual |
|---|---|---|---|
| 2.1 | Claim completed quest once | +150 XP, +30 coins applied to profile | ✅ |
| 2.2 | Claim same quest a second time | `claimed: false`, profile XP unchanged | ✅ |
| 2.3 | Claim a quest still in progress | `claimed: false` | ✅ |

```
(pass) claim awards XP+coins exactly once
(pass) cannot claim an in-progress quest
```

## 3. World completion → quest updates

| # | Scenario | Expected | Actual |
|---|---|---|---|
| 3.1 | Clear all 4 missions in `python-kingdom` | `finish-world` quest → 4/4, `completed=true` | ✅ |

```
(pass) completing all 4 missions in a world finishes the world-completion quest
```

The `complete_world` quest type is recomputed from `user_progress` rather than incremented, so it stays correct even if missions complete out of order.

## 4. Duplicate completion prevention

| # | Scenario | Expected | Actual |
|---|---|---|---|
| 4.1 | Replay an already-completed mission | `first_time=false`, `xp_awarded=0`, `quests=[]`, profile XP unchanged | ✅ |
| 4.2 | Re-award same badge slug | `user_badges` keeps a single row | ✅ |

```
(pass) duplicate mission completion grants no XP and does not bump quests
(pass) badge is awarded once and not duplicated
```

Atomicity comes from `INSERT … ON CONFLICT DO NOTHING` + `GET DIAGNOSTICS ROW_COUNT`, which is race-safe against concurrent submissions of the same mission.

---

## Frontend integration points verified

- `src/lib/progress.ts → awardCloud()` now calls `complete_mission` and returns the typed `MissionCompletionResult { firstTime, xpAwarded, quests }`.
- `src/components/mission/MissionShell.tsx` consumes that result and fires:
  - "+X XP earned" toast on first completion only.
  - 🏆 achievement toast for every `newly_completed` quest.
  - "Quest progress" toast for in-progress bumps.
  - "Mission replayed — no duplicate rewards" toast on duplicates.
- `src/components/hud/PlayerHUD.tsx` subscribes to both `profiles` and `user_quest_progress` Realtime channels and shows a live `N✓` badge on the QUESTS nav item.
- `src/routes/quests.tsx` claims via `claim_quest_reward` RPC and live-updates progress via `user_quest_progress` Realtime.

## Gate

✅ All four required scenarios verified. Algorithm Warzone can begin.
