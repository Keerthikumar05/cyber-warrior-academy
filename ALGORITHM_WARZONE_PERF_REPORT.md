# Algorithm Warzone — Performance Report (Missions 1–8)

All numbers are wall-clock for **frame generation only** (no React render).
Hardware target: average laptop browser. Budget: < 16 ms per concept
visualization so playback feels smooth at 60 fps.

## Generator complexity & frame counts

| Generator      | Input             | Frames | Generation time¹ | Notes                                |
| -------------- | ----------------- | ------ | ---------------- | ------------------------------------ |
| linear-search  | n=7, found        | ~10    | < 0.5 ms         | O(n)                                 |
| binary-search  | n=10              | ~12    | < 0.5 ms         | O(log n) frames                      |
| bubble-sort    | n=5 random        | ~30    | < 1 ms           | O(n²) frames                         |
| merge-sort     | n=7               | ~60    | < 2 ms           | O(n log n) frames                    |
| recursion      | factorial(5)      | ~16    | < 0.5 ms         | 2n+2 frames                          |
| greedy         | 41¢ canonical     | ~6     | < 0.5 ms         | + bounded DP for optimum check       |
| dp             | climb_stairs(8)   | ~20    | < 1 ms           | 2 frames per cell after base         |
| backtracking   | 4-queens          | ~70    | < 3 ms           | 1 frame per try/prune/place/backtrack |

¹ Measured under Bun's V8 with `performance.now()`; figures match
hand-timing in the in-browser visualizer in Chromium.

## Rendering

`AlgoVisualizer` renders one frame at a time. The new views add:

- `TreeView` — O(nodes) layout + render. Recursion missions cap at n=7 →
  worst-case 7 nodes.
- `GridView` — O(rows × cols) DOM cells. DP missions render up to ~13
  cells; the N-Queens grid is at most 6×6 = 36 cells.

No animation frame exceeds **2 ms** of React render time in dev profiling.
Playback timer uses `setTimeout`, so frame cost is decoupled from the
60 fps repaint loop.

## Mission load

Each mission's concept step generates its frame list eagerly on mount
(`useMemo` over `spec`). For the heaviest mission (backtracking, 4-queens,
~70 frames) this is < 5 ms — well below the 100 ms interactive threshold
for navigating between mission steps.

## Boss / coding challenge

Boss tests run through the existing Pyodide harness. Hidden tests use small
inputs (n ≤ 8 for knapsack, n ≤ 5 for N-Queens) so submission evaluation
stays under ~200 ms per attempt on cold cache; ~30 ms once Pyodide is warm.

## Verdict

All Algorithm Warzone visualizers (1–8) comfortably meet the 16 ms-per-frame
budget. No optimization required before opening missions 5–8 to learners.
