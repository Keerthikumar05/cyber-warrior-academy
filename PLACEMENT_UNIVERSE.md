# World 8 — Placement Universe

Final learning world in Code Quest Academy. Prepares students end-to-end for software engineering placements: aptitude, DSA revision, core CS, resume, HR, technical interviews, company-specific tracks, and a full hiring simulation that awards the `placement-universe-master` badge and the Code Quest Academy graduation certificate.

## Architecture

- Reuses the existing 6-step mission pipeline (Intro → Concept → Practice → Code → Boss → Mastery) with the AI Mentor sidebar.
- Coding challenges run in Pyodide with hidden `expectEval` / `expectExact` tests.
- Non-code rounds (HR, aptitude, resume review, company tracks) use `mcq`, `pattern`, `predict`, and `bug-diff` challenges.
- Fully integrated with the existing `complete_mission` RPC → XP, daily quests, streaks, leaderboards, guild XP, and badges are updated in a single transaction.
- Final mission grants `placement-universe-master` (also treated as the Code Quest Academy graduation certificate on the profile page).

## Mission list

| # | Mission | Difficulty | XP | Badge |
|---|---------|-----------|----|-------|
| 1 | Aptitude Arena | 2 | 130 | Aptitude Ace |
| 2 | DSA Challenge Zone | 3 | 160 | DSA Veteran |
| 3 | Core CS Vault | 2 | 140 | Core CS Guardian |
| 4 | Resume Workshop | 1 | 110 | Resume Architect |
| 5 | HR Interview Studio | 1 | 110 | HR Storyteller |
| 6 | Technical Interview Lab | 3 | 170 | Interview Engineer |
| 7 | Company Tracks | 2 | 140 | Track Strategist |
| 8 | Final Boss: Placement Challenge | 5 | 300 | **placement-universe-master** |

## Company Tracks — DISCLAIMER

Mission 7 covers preparation paths for Infosys, TCS, Wipro, Accenture, Cognizant, Capgemini, Deloitte, and IBM. All content is **UNOFFICIAL** preparation material compiled from publicly reported patterns. It is **not endorsed by any company** and hiring processes change frequently. The disclaimer is surfaced in the intro step of that mission. Users are directed to verify against each company's official careers portal.

## AI Mentor integration

- STAR responses, resume bullets, and mock-interview answers are forwarded to the mentor via the existing `MentorContext` on the concept and code steps.
- Boss steps in Missions 5, 6, and 8 include a `hintTopic` that the mentor uses for frame-aware coaching (e.g. "reflect on the STAR structure", "narrate your two-pointer plan out loud").

## Reward integration

- All 8 missions call `complete_mission` on completion, awarding XP, coins, streak progress, and quest progress in a single transaction (idempotent — replays award nothing).
- Final mission's mastery step passes `badgeSlug: 'placement-universe-master'` which is stored in `user_badges` and rendered on the profile as the graduation certificate.

## Test plan

Automated (via existing `src/lib/__tests__/quest-progression.test.ts` harness):

1. Completing each of the 8 missions increments `complete_missions` daily quest by 1.
2. Completing all 8 missions increments the `complete_world` quest to 8 (world completion).
3. Replaying any mission returns `first_time: false` and awards zero rewards.
4. Final mission grants `placement-universe-master` badge exactly once.

Manual QA:

1. Walk mission 1 → 8 in order; verify each mastery card shows correct XP + badge.
2. Verify mission 7 intro clearly displays the unofficial-content disclaimer.
3. Verify HUD live-updates quest progress after each mission completion.
4. Verify profile page shows the graduation badge after completing mission 8.

## Performance notes

- No new dependencies; missions reuse the existing Pyodide worker and visualizer components.
- Content-only addition: mission bundle grows by ~15 KB gzipped.
- No new routes, migrations, or server functions.
