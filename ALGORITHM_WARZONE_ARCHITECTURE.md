# Algorithm Warzone — Architecture (Phase 4, missions 1–4)

## Goal
A *learning* world for the eight core algorithm topics. Intuition and visualization first, optimization later. Missions reuse the existing `MissionShell` pipeline; no new schemas, no new mission step kinds.

## Layered model

```
       ┌──────────────────────────────────────────────────────────┐
       │  src/lib/missions/algorithm-warzone.ts                   │
       │   Mission[]  ── content, briefs, tests, boss, mastery    │
       └─────────────────────┬────────────────────────────────────┘
                             │  ConceptStep.demo = { type: "algo-viz", … }
                             ▼
       ┌──────────────────────────────────────────────────────────┐
       │  src/components/viz/AlgoVisualizer.tsx                   │
       │   Generic frame renderer: bars / cells, pointers,        │
       │   highlights, scrub bar, play/pause/speed                │
       └─────────────────────┬────────────────────────────────────┘
                             │  Frame[]
                             ▼
       ┌──────────────────────────────────────────────────────────┐
       │  src/lib/algorithms/*                                    │
       │   Pure generateFrames(spec) — no React, no DOM           │
       │   linear-search · binary-search · bubble-sort · merge-sort│
       └──────────────────────────────────────────────────────────┘
```

## Frame schema (`src/lib/algorithms/types.ts`)

One shape, used by every algorithm:

```ts
interface Frame {
  array: (number | string)[];
  highlights?: { indices: number[]; role: FrameRole }[];
  pointers?:   { name: string; index: number }[];
  subArrays?:  { start: number; end: number; label?: string }[];
  note: string;             // one-line teaching narration
  stats?: Record<string, number>;
}
```

`FrameRole = "compare" | "swap" | "pointer" | "sorted" | "pivot" | "found" | "window" | "merge" | "split" | "discard"` — the visualizer maps each role to a styled cell variant.

This single primitive scales to the next four missions (recursion stack, greedy choice, DP grid cells, backtracking decision tree) by adding new roles + a tree/grid render branch — no API churn.

## Mission step pipeline (unchanged)

`intro → concept(algo-viz) → practice → code → boss → mastery`

Only one piece is new: `ConceptStep.demo` now accepts `{ type: "algo-viz"; algo; input; target? }`. The `StepConcept` component routes that into `<AlgoVisualizer />` and forwards the current frame note to `MissionShell`'s mentor context, so Cipher's hints are frame-aware.

## AI mentor — frame-aware

`MentorContext` already carries `missionBrief`. We append `\n\nCurrent frame: <note>` whenever `AlgoVisualizer` advances, so:

- "Give me a hint" → Cipher sees what the learner is staring at.
- "Explain this step" → answers in terms of the actual sub-array / pointer.

No new server fn, no migrations.

## Coding challenges & hidden tests

Every mission has two code surfaces:

- `code` step — guided implementation of the algorithm itself (e.g. `linear_search`).
- `boss` step — a harder variant (e.g. all-indices, insertion point, optimized stats).

Tests use the existing `CodeTest` shape from `src/lib/missions/types.ts`:

- `expectExact` / `expectIncludes` — printed output checks.
- `expectEval { expr, equals }` — runs an extra Pyodide expression against the student's namespace to validate the *function itself* (the "hidden tests" requirement). This catches solutions that hard-code the demo output.

## Integration with the rest of the platform

| System | Wiring |
|---|---|
| **XP** | `MasteryStep.xpReward` flows through `complete_mission` RPC (unchanged). |
| **Daily quests** | `complete_mission` already progresses `complete_missions`, `earn_xp`, and `complete_world` quest types — Warzone missions get auto-progression for free. |
| **Leaderboards** | XP awarded by the RPC publishes through the existing realtime channel on `profiles` / `leaderboard_*`. |
| **Guilds** | Member XP rolls up to guild totals on the existing leaderboard view. |
| **AI mentor** | Same `askMentor` server fn; richer context via per-frame note. |
| **Badges** | Each Warzone mission grants a unique badge slug (`scout`, `bisector`, `bubbler`, `divider`). |

## What was NOT built (deferred to missions 5–8)

- Recursion call-stack tree visualizer (extends `Frame` with `tree`).
- DP grid cell visualizer (extends `Frame` with `grid`).
- Backtracking decision tree with prune marks.
- Greedy choice highlighter.

Their generators will live next to the current four, sharing the same `Frame` shape — no visualizer rewrite expected.
