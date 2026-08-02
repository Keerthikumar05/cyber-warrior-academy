# Code Quest Academy — Version 1.0 Release Notes

Release date: 2026-07-11
Tag: `v1.0.0`

## Highlights

Version 1.0 ships the complete 8-world learning platform:

1. **Logic Land** — sequence, condition, loops.
2. **Python Kingdom** — variables → functions.
3. **Bug Hunter City** — debugging drills.
4. **Data Structure Arena** — arrays, stacks, queues, trees.
5. **Algorithm Warzone** — 8 missions: search, sort, recursion, greedy, DP, backtracking, with a full frame-based visualizer.
6. **Web Developer Realm** — 8 missions: HTML → deploy.
7. **AI Dimension** — 8 missions: data → generative AI.
8. **Placement Universe** — 8 missions: aptitude → hiring simulation.

Platform features that are live in 1.0:
- XP + level curve, coins, streaks
- Daily quests with claim rewards
- Guilds with XP contribution
- Global + weekly leaderboard
- Badges + graduation certificate
- Real-time HUD via Supabase realtime
- AI Mentor (frame-aware on Algorithm Warzone)
- 1v1 Battle Arena
- Community Forum with upvotes
- Pyodide-powered in-browser Python runner

## What changed since the last preview build

- Added Worlds 5–8 (Algorithm Warzone, Web Developer Realm, AI Dimension, Placement Universe).
- Full frame-generation architecture for algorithm visualizations.
- Graduation certificate wired to `placement-universe-master` badge.
- 26 automated tests covering frame generators, mission schema, quest progression, badge de-duplication, and reward claiming — all green.

## Known issues

- Manual walkthrough of one mission per world (guest + authenticated) is deferred to first hosted QA pass.
- Lighthouse audit on live production URL pending publish.
- Mobile viewport spot-check pending on Missions 7 & 8 of Placement Universe (very long lists).
- The AI Mentor uses `LOVABLE_API_KEY`; if the key is rotated, edge function needs a redeploy to pick up the new secret.
- Company-track content in Placement Universe Mission 7 is explicitly marked UNOFFICIAL.

## Upgrade / rollback

No migrations required beyond what is already applied. All content additions are code-only. Rollback is safe — replay a previously deployed commit.

## Contributors

Built on Lovable with TanStack Start + Supabase (Lovable Cloud) + Pyodide.
