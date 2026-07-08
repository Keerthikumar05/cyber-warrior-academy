# Web Developer Realm — World 6

## Architecture
Reuses the existing data-driven mission engine (`src/lib/missions/`) and the 6-step pipeline (Intro → Concept → Practice → Code → Boss → Mastery). No new schema, no new runner. Code challenges are graded by the existing Pyodide runner: students write Python that *produces* web artifacts (HTML strings, CSS rules, mock request handlers, SQL statements) so real conceptual work is verified with hidden `expectEval` tests. AI Mentor picks up the mission's topics + brief automatically via `MissionShell`. XP, daily quests, guild activity, leaderboards, and badges all flow through the existing `complete_mission` RPC.

Files:
- `src/lib/missions/web-developer-realm.ts` — all 8 missions
- `src/lib/missions/index.ts` — world flipped to `status: "available"` and missions registered

## Mission Plan
| # | Slug | Title | Focus | XP | Badge |
|---|---|---|---|---|---|
| 1 | `html-fortress` | HTML Fortress | Semantic tags, forms, a11y | 110 | html-architect |
| 2 | `css-styling-forge` | CSS Styling Forge | Selectors, flex, grid, responsive | 130 | css-smith |
| 3 | `javascript-village` | JavaScript Village | Vars, functions, DOM, events | 140 | js-villager |
| 4 | `react-kingdom` | React Kingdom | Components, props, state, hooks | 160 | react-heir |
| 5 | `nodejs-gateway` | Node.js Gateway | Express, routing, middleware | 160 | gateway-keeper |
| 6 | `database-caverns` | Database Caverns | SQL, Postgres, CRUD, injection safety | 150 | cavern-cartographer |
| 7 | `full-stack-castle` | Full Stack Castle | React ↔ API ↔ DB integration | 200 | castellan |
| 8 | `build-and-deploy` | Boss — Build & Deploy | Build pipeline, env, deploy | 240 | **web-developer-realm-master** |

Total world XP: **1,290**.

## Project List (per-mission mini-projects)
1. Semantic marketing page + accessible login form
2. Responsive card grid with mobile media query
3. Click counter + dark-mode toggle (state model)
4. Todo reducer (add/toggle) — React state pattern
5. Auth-guarded REST router with middleware
6. Parameterized CRUD suite for `posts`
7. End-to-end create-post round trip
8. Deployment checklist + CI-style pipeline aggregator

## Test Plan
- **Static**: every mission conforms to `Mission` schema (compile-time via existing `algorithms.test.ts`-style checks).
- **Per code step**: 3–4 hidden `expectEval`/`expectExact` tests each — 30 total across the world.
- **Manual QA path**: navigate `/play/web-developer-realm/<slug>`, verify Intro → Concept demo renders, Practice grades, Code runner passes with reference solution, Boss unlocks, Mastery awards XP + badge via `complete_mission`.
- **Integration**: mission-completion RPC already emits realtime quest progress; final mission's `web-developer-realm-master` badge is awarded through the existing badge path in `progress.ts::awardCloud`.
- **Do not start**: World 7 (AI Dimension) or World 8 (Placement Universe) until this world is verified in preview.
