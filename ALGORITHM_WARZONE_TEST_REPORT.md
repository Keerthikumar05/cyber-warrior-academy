# Algorithm Warzone — Test Report (missions 1–4)

## Test suites

`src/lib/__tests__/algorithms.test.ts` — unit tests for frame generators and mission integrity.

Run with: `bunx vitest run` (or `bun test src/lib/__tests__/algorithms.test.ts`).

## Coverage

### Frame generators

| Generator | Cases |
|---|---|
| `linearSearchFrames` | found-at-index, missing-target sweep, duplicates → first index |
| `binarySearchFrames` | finds target, comparisons ≤ ⌈log₂ n⌉+1 on n=1024, missing target, auto-sorts unsorted input |
| `bubbleSortFrames` | final frame sorted, early-exit on sorted input (0 swaps + note), correct swap count on `[3,1,2]`, 5 random inputs cross-checked against `Array.prototype.sort` |
| `mergeSortFrames` | final frame sorted, empty + single-element edges, comparisons ≤ n log₂ n on n=64, 5 random inputs cross-checked against `Array.prototype.sort` |

### Mission integrity

- All 4 missions are tagged `worldSlug: "algorithm-warzone"`.
- Each mission starts with `intro` and ends with a `mastery` step with `xpReward > 0`.
- Each `concept` step uses `demo.type === "algo-viz"`.
- Each mission ships a `code` step **and** a `boss` step.
- Every code/boss challenge has ≥ 2 tests (hidden-test gate).

## Manual verification matrix

| Behavior | Mission | How verified |
|---|---|---|
| Visualizer plays / pauses / scrubs | all 4 | `/algo-demo` route — pick algo, scrub, randomize input |
| Mentor sees current frame | all 4 | Frame note is fed into `missionBrief` so "Hint" replies on the current step |
| Hidden function-level test rejects hard-coded prints | code + boss | `expectEval { expr: "linear_search([1,2,3], 9)", equals: -1 }` style assertions |
| XP awarded, quest progress, no duplicate rewards | all 4 | Reuses the existing `complete_mission` RPC and `MissionShell` toast flow (covered by `quest-progression.test.ts`) |
| Boss → mastery progression | all 4 | Standard `MissionShell` pipeline |
| World listed on home map | — | `worlds[]` entry status flipped from `"soon"` to `"available"`, missions slug-listed |

## Sample mapping

1. **Mission completion → quest progress** — Beating `algorithm-warzone/linear-search` invokes `complete_mission`, bumping `complete_missions` and `earn_xp` daily quests in one transaction.
2. **Boss → quest completion → reward claim** — Boss XP is part of the same RPC payload; the user claims via `claim_quest_reward` on `/quests`.
3. **World completion bonus** — On the 4th mission, `complete_world` quest type sees `world_done = 4` and fires achievement toasts.
4. **Duplicate prevention** — Replays return `first_time = false`; the toast says "Mission replayed — no duplicate rewards."

## Known limitations

- Pyodide-backed code tests are exercised manually inside the browser — `bun test` cannot run them without a browser Pyodide instance. The frame-generator suite covers the algorithm correctness invariants; code submissions are validated by `CodeRunner` at runtime.
- Frame counts are not snapshot-tested; only invariants (final state, monotonic stats, role of last frame) are asserted. This keeps the suite resilient when we tune narration.
