# Code Quest Academy

Learn to code by saving the universe. Code Quest turns programming education into a game — interactive missions, boss battles, real in-browser Python, and a personal AI mentor named **Cipher** that adapts to you.

Built on **TanStack Start** (React 19 + SSR) with **Lovable Cloud** (Supabase) for auth, database, and server functions, and the **Lovable AI Gateway** (Gemini) for the mentor.

---

## Features

- **8-world progression** — Logic Land and Python Kingdom shipped; Bug Hunter City, Data Structure Arena, Algorithm Warzone, Web Realm, AI Dimension, and Placement Universe scaffolded.
- **Mission engine** — 6-step loop per mission: Intro → Concept → Practice → Code → Boss → Mastery.
- **Real Python in the browser** — Pyodide + Monaco editor with stdout capture and automated test grading.
- **Cipher AI mentor** — context-aware (mission, code, last error), defaults to hints over answers, persistent chat history.
- **Gamification** — XP, levels, coins, badges, streaks, leaderboard.
- **Guest mode** — play World 1 without signing up; progress syncs to your account on sign-up.
- **Auth** — email/password + Google OAuth via Supabase.
- **Dark cyberpunk neon theme** — fully tokenized design system.

## Tech stack

- **Frontend:** React 19, TanStack Start v1, TanStack Router, TanStack Query, Tailwind CSS v4, shadcn/ui
- **Backend:** Supabase (Postgres + RLS + Auth), TanStack `createServerFn` server functions
- **AI:** Lovable AI Gateway (Gemini 3 Flash) via the Vercel AI SDK
- **Code execution:** Pyodide (CPython in WebAssembly), Monaco editor
- **Runtime:** Cloudflare Workers (via the TanStack Start adapter)

---

## Local development

### Prerequisites

- **Bun** ≥ 1.1 (recommended) or **Node.js** ≥ 20 with npm
- A Supabase project (free tier is fine) — or use [Lovable Cloud](https://lovable.dev) which provisions one automatically.

### Setup

```bash
# 1. Install dependencies
bun install            # or: npm install

# 2. Configure environment
cp .env.example .env
# then edit .env with your Supabase URL + publishable key and your LOVABLE_API_KEY

# 3. Apply database migrations to your Supabase project
#    (run the SQL in supabase/migrations/ in order, via the Supabase SQL editor
#     or the supabase CLI: `supabase db push`)

# 4. Start the dev server
bun run dev            # or: npm run dev
```

The app is now running at http://localhost:8080.

### Available scripts

| Command | What it does |
|---|---|
| `bun run dev` | Start the Vite dev server with HMR |
| `bun run build` | Production build (Cloudflare Worker output) |
| `bun run start` | Preview the production build locally |
| `bun run lint` | ESLint over the project |

---

## Environment variables

See `.env.example` for the full list. Summary:

| Variable | Where used | Notes |
|---|---|---|
| `VITE_SUPABASE_URL` / `VITE_SUPABASE_PUBLISHABLE_KEY` / `VITE_SUPABASE_PROJECT_ID` | Browser | Publishable keys — safe to ship to the client. RLS protects data. |
| `SUPABASE_URL` / `SUPABASE_PUBLISHABLE_KEY` | SSR | Mirror of the VITE_* vars for server-side rendering. |
| `LOVABLE_API_KEY` | Server only | Required for the AI mentor. Never expose to the client. |

> **Service role key** and DB password are intentionally **not** used — server functions authenticate as the calling user via `requireSupabaseAuth` middleware and rely on RLS.

---

## Project structure

```
src/
  routes/              # File-based routes (TanStack Router)
    __root.tsx         # Root layout + head/meta
    index.tsx          # World map / landing
    play.$world.$mission.tsx
    auth.tsx, profile.tsx
  components/
    mission/           # Step renderers (Intro/Concept/Practice/Code/Boss/Mastery)
    hud/PlayerHUD.tsx  # XP/Level/Coins HUD with realtime updates
    MentorPanel.tsx    # Cipher chat UI
    ui/                # shadcn primitives
  lib/
    missions/          # Mission content (logic-land, python-kingdom)
    mentor.functions.ts# AI mentor server function
    pyodide.ts         # In-browser Python runtime
    progress.ts        # Guest-mode localStorage progression
  integrations/supabase/  # Auto-generated client + auth middleware
supabase/
  migrations/          # SQL migrations (profiles, progress, XP, mentor, etc.)
  config.toml
```

---

## Deployment

The build targets the **Cloudflare Workers** runtime via the TanStack Start adapter.

### Deploy via Lovable (easiest)

1. Open the project in [Lovable](https://lovable.dev).
2. Click **Publish** in the top-right.

### Deploy to Cloudflare Workers manually

```bash
bun run build
# Output is in .output/ — deploy with wrangler:
npx wrangler deploy
```

Set the runtime secrets in your Cloudflare dashboard (or via `wrangler secret put`):
`SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `LOVABLE_API_KEY`.

### Other targets

The build is a standard Web Fetch handler (`src/server.ts`). It can be adapted to Node, Vercel Edge, or Deno Deploy by swapping the TanStack Start target in `vite.config.ts`.

---

## Contributing

Adding a new mission:
1. Create the content in `src/lib/missions/<your-world>.ts` following the `Mission` type in `src/lib/missions/types.ts`.
2. Add the mission to the array in `src/lib/missions/index.ts`.
3. Flip the world's `status` to `"available"` once enough missions exist.

The 6-step `MissionStep` union (`intro | concept | practice | code | boss | mastery`) lets you plug any future world (Bug Hunter, DSA, Algorithms, Web, AI, Placement) into the existing engine with no refactor.

---

## License

MIT — go build the universe.
