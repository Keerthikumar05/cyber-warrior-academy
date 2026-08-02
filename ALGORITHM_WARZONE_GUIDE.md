# Algorithm Warzone — Mission Guide

Welcome to the Warzone. Eight missions, one toolkit. Each mission teaches
**intuition first**, then asks you to code it for real.

Every mission follows the same six steps:

1. **Intro** — the story sets the scene.
2. **Concept** — the algorithm explained, with a live visualizer you can
   scrub, pause, and replay.
3. **Practice** — a quick multiple-choice or prediction puzzle to check
   you read the visualizer.
4. **Code** — write the algorithm in Python. Hidden tests check your
   work, including edge cases.
5. **Boss** — a harder twist on the same idea. Pass and earn the mission
   badge.
6. **Mastery** — takeaways and XP reward.

The AI mentor is always available. It sees exactly which frame you're on,
so asking "why did this happen?" gets a hint about the *specific* step.

---

## 1. Linear Search — Scout the Convoy
Walk left to right, check each cell. Slow on huge data, unbeatable when
the array is unsorted or tiny. **Boss:** find every index where the target
appears.

## 2. Binary Search — Splitting the Battlefield
On a SORTED array, halve the window each step. log₂(1,000,000) ≈ 20
checks. **Boss:** find the insertion point that keeps the array sorted.

## 3. Bubble Sort — Rising Bubbles
Swap adjacent out-of-order pairs. After each pass the largest sinks to
the end. Use the early-exit trick on near-sorted data. **Boss:** return
the sorted list AND the number of passes you used.

## 4. Merge Sort — Divide the Front
Split until size 1, then merge sorted halves upward. n log n beats n²
hard. **Boss:** wire your `merge` into a full divide-and-conquer.

## 5. Recursion — Echo Chamber
A function that calls itself toward a base case. The call tree on the
right shows every active and returned call; the stack chips show what's
currently "in flight". **Boss:** Tower of Hanoi — print every move to
relocate n disks.

## 6. Greedy — The Quick Draw
Take the locally best choice. Watch the canonical US coins succeed, then
watch coins [1, 3, 4] fail for amount 6. The counterexample panel below
the demo is the lesson. **Boss:** minimum meeting rooms via sweep.

## 7. Dynamic Programming Basics — Memory Bunker
Overlapping subproblems + optimal substructure = DP. Watch a 1×(n+1)
table fill in cell by cell. Each cell highlights its two dependencies
before being written. **Boss:** classic 0/1 knapsack with a 2D table.

## 8. Backtracking — The Labyrinth
DFS with discipline: try, recurse, undo. The chess board lights up green
on placements and red on prunes. **Boss:** Rat in a Maze — find a path
through a grid with only Down/Right moves.

Clear mission 8 and you unlock the **Algorithm Warzone Veteran** badge —
proof that search, sort, recursion, greedy, DP, and backtracking are in
your toolbox.

---

## Visualizer controls

- **Play / Pause** — autoplay starts on; pause anytime.
- **◀ / ▶** — step one frame at a time. Best for understanding why a
  specific decision was made.
- **Reset** — back to frame 1 of the current animation.
- **Speed slider** — change ms-per-frame.
- **Scrub bar** — jump to any frame.

Need the demo on its own? `/algo-demo` runs every visualizer in
isolation, including the greedy counterexample.

## Tips before you start the boss

- Re-read the **step note** at the bottom of the visualizer — it always
  describes the current frame in one line.
- Open the AI mentor with the chat button. Ask "what is this frame
  doing?" — the mentor knows.
- Boss hidden tests cover edge cases (empty inputs, capacity 0,
  unreachable goals). If your function works on the demo but fails the
  boss, check the edges first.

Good luck out there.
