import type { Frame, AlgoSpec, FrameGridCell } from "./types";

/**
 * Backtracking visualization — N-Queens (default n=4).
 * Renders an n×n grid. Each frame shows a tentative queen placement,
 * marks safe/attacked cells, and visualizes pruning when a row has no
 * valid column.
 */
export function backtrackingFrames(spec: AlgoSpec): Frame[] {
  const n = Math.max(4, Math.min(spec.n ?? 4, 6));
  const frames: Frame[] = [];
  const cols: number[] = new Array(n).fill(-1); // cols[row] = col of queen
  let placements = 0;
  let prunes = 0;
  let solutions = 0;

  function safe(row: number, col: number): boolean {
    for (let r = 0; r < row; r++) {
      const c = cols[r];
      if (c === col) return false;
      if (Math.abs(c - col) === Math.abs(r - row)) return false;
    }
    return true;
  }

  function gridFor(currentRow: number, tryCol?: number, status?: "try" | "place" | "prune" | "solved"): FrameGridCell[][] {
    const cells: FrameGridCell[][] = [];
    for (let r = 0; r < n; r++) {
      const row: FrameGridCell[] = [];
      for (let c = 0; c < n; c++) {
        let value: string = ".";
        let role: FrameGridCell["role"];
        if (r < currentRow && cols[r] === c) {
          value = "Q";
          role = "filled";
        } else if (r === currentRow && c === tryCol) {
          value = status === "place" ? "Q" : status === "prune" ? "✗" : "?";
          role = status === "place" ? "chosen" : status === "prune" ? "pruned" : "current";
        } else if (status === "solved" && r < n && cols[r] === c) {
          value = "Q";
          role = "found";
        }
        row.push({ value, role });
      }
      cells.push(row);
    }
    return cells;
  }

  frames.push({
    array: [],
    grid: { rows: n, cols: n, cells: gridFor(0), caption: `${n}-Queens: place ${n} queens so none attack.` },
    note: `Backtracking: try a queen in each row; if no column is safe, undo and try the next option above.`,
    stats: { placements, prunes, solutions },
  });

  function solve(row: number): boolean {
    if (row === n) {
      solutions++;
      frames.push({
        array: [],
        grid: { rows: n, cols: n, cells: gridFor(row, undefined, "solved"), caption: `Solution #${solutions}: ${cols.join(", ")}` },
        note: `Solution found! Columns by row: [${cols.join(", ")}].`,
        stats: { placements, prunes, solutions },
      });
      return true; // stop at first solution for clarity
    }
    for (let c = 0; c < n; c++) {
      frames.push({
        array: [],
        grid: { rows: n, cols: n, cells: gridFor(row, c, "try"), caption: `Try row ${row}, col ${c}.` },
        note: `Try placing queen at (${row}, ${c}).`,
        stats: { placements, prunes, solutions },
      });
      if (!safe(row, c)) {
        prunes++;
        frames.push({
          array: [],
          grid: { rows: n, cols: n, cells: gridFor(row, c, "prune"), caption: `Pruned (${row}, ${c}).` },
          note: `(${row}, ${c}) is attacked. Prune this branch.`,
          stats: { placements, prunes, solutions },
        });
        continue;
      }
      cols[row] = c;
      placements++;
      frames.push({
        array: [],
        grid: { rows: n, cols: n, cells: gridFor(row, c, "place"), caption: `Place queen (${row}, ${c}).` },
        note: `(${row}, ${c}) is safe. Place queen, recurse to row ${row + 1}.`,
        stats: { placements, prunes, solutions },
      });
      if (solve(row + 1)) return true;
      // backtrack
      cols[row] = -1;
      frames.push({
        array: [],
        grid: { rows: n, cols: n, cells: gridFor(row, c, "prune"), caption: `Backtrack from (${row}, ${c}).` },
        note: `Subtree failed. Undo (${row}, ${c}) and try the next column.`,
        stats: { placements, prunes, solutions },
      });
    }
    return false;
  }

  solve(0);

  if (solutions === 0) {
    frames.push({
      array: [],
      grid: { rows: n, cols: n, cells: gridFor(0), caption: `No solution.` },
      note: `Exhausted all branches with no solution.`,
      stats: { placements, prunes, solutions },
    });
  }
  return frames;
}
