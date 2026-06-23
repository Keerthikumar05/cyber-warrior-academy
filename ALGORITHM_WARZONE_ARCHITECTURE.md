# Algorithm Warzone — Architecture (Updated, Missions 1–8)

Algorithm Warzone is a **learning world**. All eight missions reuse the same
mission shell (Intro → Concept → Practice → Code → Boss → Mastery) and share a
single frame-driven visualizer.

## Layered model

```text
+----------------------------------------------------------------+
|  src/lib/missions/algorithm-warzone.ts   (content)             |
|  - 8 missions, each step kind drives a UI component            |
+----------------------------------------------------------------+
|  src/components/viz/AlgoVisualizer.tsx   (renderer)            |
|  - Plays Frame[] with controls; renders array | grid | tree    |
|  - Surfaces call stack chips; forwards frame note to AI mentor |
+----------------------------------------------------------------+
|  src/lib/algorithms/*.ts                 (generators)          |
|  - Pure functions: (AlgoSpec) -> Frame[]                       |
|  - 8 algos: linear, binary, bubble, merge, recursion, greedy,  |
|    dp, backtracking                                            |
+----------------------------------------------------------------+
|  src/lib/algorithms/types.ts             (frame primitives)    |
|  - Frame: { array | tree | grid, highlights, pointers, stack } |
+----------------------------------------------------------------+
```

## Frame primitives (extended in Phase 2)

A `Frame` may carry any combination of:

- `array` + `highlights` + `pointers` + `subArrays` — the original
  search/sort visualization.
- `tree: FrameTreeNode[]` — recursion / decision trees. Nodes carry a
  `status` (`active | returned | base | pruned | chosen`) and an optional
  `detail` (e.g. `= 5 × 24 = 120`). Layout is computed from `parentId`.
- `grid: { rows, cols, cells, caption? }` — DP tables and chess boards.
  Each cell has a `value`, optional `role` (driving color), and `label`.
- `stack: string[]` — live call stack, rendered as chips alongside the
  visualization.

`AlgoVisualizer` picks the right view automatically — if `frame.grid` is
present it renders the grid; if `frame.tree` is present it renders the tree;
otherwise it falls back to the array/bar view. A frame may include both
(e.g. greedy renders the coin row AND a status caption).

## Mission inventory

| #  | Slug             | View                  | Boss                  | Badge                          | XP  |
| -- | ---------------- | --------------------- | --------------------- | ------------------------------ | --- |
| 1  | `linear-search`  | array sweep           | All indices           | `scout`                        | 100 |
| 2  | `binary-search`  | array window          | Insertion point       | `bisector`                     | 120 |
| 3  | `bubble-sort`    | bars + swaps          | Optimized sort stats  | `bubbler`                      | 130 |
| 4  | `merge-sort`     | split/merge sub-bars  | Full merge sort       | `divider`                      | 160 |
| 5  | `recursion`      | call tree + stack     | Tower of Hanoi        | `echo-keeper`                  | 140 |
| 6  | `greedy`         | coin row + verdict    | Min meeting rooms     | `quick-draw`                   | 150 |
| 7  | `dp-basics`      | DP grid               | 0/1 knapsack          | `archivist`                    | 180 |
| 8  | `backtracking`   | n×n chess board       | Rat in a Maze         | `algorithm-warzone-veteran` ★  | 200 |

★ World-completion badge granted by the final mastery step.

## AI mentor wiring

`StepConcept` forwards each frame's `note` to the `MissionShell` mentor
context as `missionBrief`. The mentor RPC sees the user's last visible step
verbatim, so its hints are grounded in *what the learner is looking at* —
e.g. "you're currently at the merge step combining [3,9] with [27,43]".
This is unchanged from Phase 1; the new views (tree, grid) automatically
benefit because they share the same `onFrameChange` plumbing.

## Platform integrations

All 8 missions call the existing `complete_mission` RPC. That single
transaction handles:

- XP and coin grant (atomic, no duplicates).
- Streak progression.
- Daily quest auto-progression (`complete_missions`, `earn_xp`,
  `complete_world`).
- Badge unlock (per-mission badge + the `algorithm-warzone-veteran`
  completion badge on mission 8).
- Real-time leaderboard / HUD updates via the `user_quest_progress` and
  `profiles` realtime channels.

No schema change is required for missions 5–8.

## Files added in Phase 2

- `src/lib/algorithms/recursion.ts` — factorial call-tree generator.
- `src/lib/algorithms/greedy.ts` — coin-change generator (incl.
  counterexample variant) with brute-force optimum check.
- `src/lib/algorithms/dp.ts` — climbing-stairs DP table generator.
- `src/lib/algorithms/backtracking.ts` — N-Queens board generator with
  prune frames.
- `src/lib/missions/algorithm-warzone.ts` — extended with missions 5–8.
- `src/components/viz/AlgoVisualizer.tsx` — added `TreeView`, `GridView`,
  and call-stack chips.
- `src/lib/__tests__/algorithms.test.ts` — added coverage for all four
  new generators and the 8-mission integration.
- `src/routes/algo-demo.tsx` — added presets and a counterexample panel.
