import type { Frame, AlgoSpec, FrameGridCell } from "./types";

/**
 * Dynamic programming visualization — climbing stairs / Fibonacci tabulation.
 * Renders a single-row dp grid. Each cell fills with dp[i] = dp[i-1] + dp[i-2]
 * and highlights its two dependencies.
 */
export function dpFrames(spec: AlgoSpec): Frame[] {
  const n = Math.max(2, Math.min(spec.n ?? 8, 12));
  const dp: number[] = new Array(n + 1).fill(0);
  const frames: Frame[] = [];

  function buildGrid(filledUpTo: number, current?: number, deps: number[] = []): FrameGridCell[][] {
    const row: FrameGridCell[] = [];
    for (let i = 0; i <= n; i++) {
      let role: FrameGridCell["role"];
      if (i === current) role = "current";
      else if (deps.includes(i)) role = "compare";
      else if (i <= filledUpTo) role = "filled";
      row.push({ value: i <= filledUpTo || i === current ? dp[i] : "·", label: `dp[${i}]`, role });
    }
    return [row];
  }

  // Base cases
  dp[0] = 1;
  frames.push({
    array: [],
    grid: { rows: 1, cols: n + 1, cells: buildGrid(0), caption: `Climb stairs: dp[i] = ways to reach step i. Base: dp[0]=1.` },
    note: `Base case: dp[0] = 1 (one way to stand still).`,
    stats: { i: 0 },
  });
  if (n >= 1) {
    dp[1] = 1;
    frames.push({
      array: [],
      grid: { rows: 1, cols: n + 1, cells: buildGrid(1), caption: `Base: dp[1]=1.` },
      note: `Base case: dp[1] = 1 (one way: a single step).`,
      stats: { i: 1 },
    });
  }

  for (let i = 2; i <= n; i++) {
    // Show the comparison frame
    frames.push({
      array: [],
      grid: {
        rows: 1,
        cols: n + 1,
        cells: buildGrid(i - 1, i, [i - 1, i - 2]),
        caption: `dp[${i}] = dp[${i - 1}] + dp[${i - 2}]`,
      },
      note: `Look up dp[${i - 1}]=${dp[i - 1]} and dp[${i - 2}]=${dp[i - 2]} — already solved subproblems.`,
      stats: { i },
    });
    dp[i] = dp[i - 1] + dp[i - 2];
    frames.push({
      array: [],
      grid: {
        rows: 1,
        cols: n + 1,
        cells: buildGrid(i),
        caption: `Filled dp[${i}] = ${dp[i]}.`,
      },
      note: `Fill dp[${i}] = ${dp[i - 1]} + ${dp[i - 2]} = ${dp[i]}. Each cell is filled once — that's the DP win.`,
      stats: { i },
    });
  }

  frames.push({
    array: [],
    grid: {
      rows: 1,
      cols: n + 1,
      cells: buildGrid(n),
      caption: `dp[${n}] = ${dp[n]}.`,
    },
    note: `Answer: dp[${n}] = ${dp[n]}. Naive recursion would recompute the same subproblems ~2^n times.`,
    stats: { i: n, answer: dp[n] },
  });
  return frames;
}
