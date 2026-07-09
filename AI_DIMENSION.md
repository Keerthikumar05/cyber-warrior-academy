# World 7 — AI Dimension

Teach AI/ML end-to-end through 8 interactive missions. Reuses the
existing 6-step mission pipeline (Intro → Concept → Practice → Code →
Boss → Mastery), Pyodide runner, hidden `expectEval` tests, AI mentor
integration, and `complete_mission` RPC for XP/quests/badges.

## Architecture

- Content lives in `src/lib/missions/ai-dimension.ts` and is registered
  in `src/lib/missions/index.ts` alongside the other worlds.
- Coding challenges are pure-Python so Pyodide can grade them. Data
  science APIs (Pandas/NumPy/sklearn) are simulated via list/dict work
  so students focus on **concepts**, not package installs.
- Every mission ends with a badge; the final mission grants
  `ai-dimension-master`.
- No new infra required — XP, daily quests, leaderboard, guild activity
  are all triggered by the existing RPC on Mastery completion.

## Missions

| # | Slug | Focus | Badge |
|---|---|---|---|
| 1 | `data-explorer` | Cleaning, DataFrames, missing values | `data-explorer` |
| 2 | `machine-learning-camp` | Supervised/unsupervised, train/test, accuracy | `ml-recruit` |
| 3 | `feature-engineering-lab` | Scaling, one-hot, preprocessing | `feature-engineer` |
| 4 | `model-trainer` | Precision/Recall/F1, ensemble voting | `model-trainer` |
| 5 | `computer-vision-arena` | Convolution intuition, IoU | `vision-warrior` |
| 6 | `natural-language-temple` | Tokenization, sentiment | `language-adept` |
| 7 | `prompt-engineering-nexus` | Prompt anatomy, RAG retrieval | `prompt-engineer` |
| 8 | `build-an-ai-application` | Validation, full pipeline | `ai-dimension-master` |

## Test plan

Each coding step has hidden `expectEval` tests (see `ai-dimension.ts`).
Verify:

1. Import loads without TypeScript errors (`tsgo`).
2. `/play/ai-dimension/data-explorer` renders every step.
3. Boss steps grade correctly against sample inputs listed in each
   mission's `tests` array.
4. Completing the final mission awards the `ai-dimension-master` badge
   through `complete_mission`.

## Not in scope

World 8 (Placement Universe) — awaits explicit approval.
