# Changelog

All notable changes to Code Quest Academy are documented in this file.
Format loosely follows [Keep a Changelog](https://keepachangelog.com).

## [1.0.0] — 2026-07-11

### Added
- **World 5 — Algorithm Warzone** (8 missions) with full frame-based `AlgoVisualizer`.
  - Frame generators for linear search, binary search, bubble sort, merge sort, recursion (call-stack + tree), greedy (with counterexample), DP (grid), and backtracking (N-Queens board).
  - Frame-aware AI Mentor hints.
  - 19 unit tests for algorithm frames + mission schema.
  - Completion badge: `algorithm-warzone-veteran`.
- **World 6 — Web Developer Realm** (8 missions). HTML → CSS → JS → React → Node → SQL → full stack → deploy. Badge `web-developer-realm-master`.
- **World 7 — AI Dimension** (8 missions). Data → ML → features → training → CV → NLP → prompts → deploy. Badge `ai-dimension-master`.
- **World 8 — Placement Universe** (8 missions). Aptitude → DSA → core CS → resume → HR → tech interview → company tracks → hiring boss. Badge `placement-universe-master` (also treated as the graduation certificate).
- Frame-generation architecture (`src/lib/algorithms/*`) with shared `Frame`/`AlgoSpec` types.
- Quest-progression harness (`quest-progression.test.ts`) covering mission→quest bumps, world completion, duplicate prevention, badge de-dup, and reward claiming.
- Stabilization documentation: `RELEASE_NOTES_V1.md`, `RELEASE_CHECKLIST_V1.md`, `PRODUCTION_READINESS.md`, `KNOWN_ISSUES.md`.

### Changed
- All 8 worlds' `status` set to `available` in `src/lib/missions/index.ts`.
- Mission types extended to carry `hintTopic` on boss steps and `algo-viz` demos on concept steps.

### Fixed
- Idempotent `complete_mission` RPC: replays award zero rewards, badges are `ON CONFLICT DO NOTHING`.
- Streak calculation only advances on a first-time mission completion.

### Security
- All `public` schema tables carry explicit GRANTs for `authenticated` + `service_role`; `anon` only where a policy allows public read.
- Roles stored in `user_roles`, checked via `has_role()` security-definer function — no client-trusted role bit on profiles.
