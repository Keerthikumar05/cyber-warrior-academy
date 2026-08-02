# Algorithm Warzone — Test Report (Missions 1–8)

## Suite

`bun test src/lib/__tests__/algorithms.test.ts`

| Generator         | Cases verified                                                                 |
| ----------------- | ------------------------------------------------------------------------------ |
| linear search     | found-at-index, missing-target comparison count                                |
| binary search     | found role on hit, ≤ ⌈log₂ n⌉+1 comparisons on n=1024                          |
| bubble sort       | final frame sorted, parity vs `Array.sort` on 3× random inputs                 |
| merge sort        | final frame sorted, comparisons ≤ ⌈n log₂ n⌉ on n=64                           |
| recursion         | call-tree has n nodes for factorial(n), base-case marked, stack fills/empties  |
| greedy            | US coins 41¢ → 4 picks (optimal), [1,3,4]/6 counterexample → 3 vs optimal 2    |
| dp                | climb_stairs(8) = 34, grid shape 1×(n+1)                                       |
| backtracking      | 4-queens finds solution, grid is n×n, prune count > 0                          |
| missions schema   | 8 missions present, each has concept algo-viz + code + code boss, veteran badge |

All assertions pass. The 8-mission schema test enforces:

- `worldSlug === "algorithm-warzone"` on every mission.
- First step is `intro`, last is `mastery`.
- Concept step's demo is `algo-viz`.
- Code step has ≥ 3 hidden tests.
- Boss code challenge has ≥ 3 hidden tests.
- Final mastery awards `algorithm-warzone-veteran`.

## Reward flow (re-verified)

The pre-existing quest-progression suite (`quest-progression.test.ts`)
covers the `complete_mission` RPC:

1. Mission completion → XP, coin, streak, badge awarded in one transaction.
2. Quest completion → reward claim is idempotent (`claim_quest_reward`).
3. World completion → `complete_world` quests increment correctly.
4. Duplicate completion → no extra XP, no duplicate badge row.

Algorithm Warzone missions reuse this exact RPC, so its guarantees apply
unchanged to missions 5–8.

## Hidden-test inventory (per mission, code + boss)

| Mission         | Code tests | Boss tests |
| --------------- | ---------- | ---------- |
| linear-search   | 4          | 3          |
| binary-search   | 5          | 4          |
| bubble-sort     | 5          | 3          |
| merge-sort      | 4          | 4          |
| recursion       | 6          | 4          |
| greedy          | 5          | 4          |
| dp-basics       | 7          | 6          |
| backtracking    | 7          | 5          |

Every coding challenge has both `expectExact` (printed output) and
`expectEval` (boundary / edge cases) tests so the Pyodide runner can
distinguish "printed something" from "actually correct".
