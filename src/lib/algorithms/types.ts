// Frame-driven visualization primitives shared by every Algorithm Warzone algo.

export type FrameRole =
  | "compare"
  | "swap"
  | "pointer"
  | "sorted"
  | "pivot"
  | "found"
  | "window"
  | "merge"
  | "split"
  | "discard"
  | "chosen"
  | "rejected"
  | "filled"
  | "current"
  | "pruned"
  | "base";

export interface FrameHighlight {
  indices: number[];
  role: FrameRole;
}

export interface FramePointer {
  name: string;
  index: number;
}

export interface FrameSubArray {
  start: number;
  end: number;
  label?: string;
}

/** A node in a recursion / decision tree. Layout is parent-based. */
export interface FrameTreeNode {
  id: string;
  parentId?: string;
  label: string;
  status?: "active" | "returned" | "base" | "pruned" | "chosen";
  detail?: string;
}

/** A single cell in a 2D grid view (DP tables, chess boards, etc). */
export interface FrameGridCell {
  value: number | string;
  role?: FrameRole;
  label?: string;
}

export interface FrameGrid {
  rows: number;
  cols: number;
  cells: FrameGridCell[][]; // rows × cols
  rowLabels?: string[];
  colLabels?: string[];
  /** Optional caption such as "dp[i][w]". */
  caption?: string;
}

export interface Frame {
  /** Default array-view snapshot. Empty array means "no array view". */
  array: (number | string)[];
  highlights?: FrameHighlight[];
  pointers?: FramePointer[];
  subArrays?: FrameSubArray[];
  /** Recursion / decision tree to render alongside or instead of the array. */
  tree?: FrameTreeNode[];
  /** DP grid / chessboard view. */
  grid?: FrameGrid;
  /** Active call stack chips, e.g. ["fact(4)","fact(3)"]. */
  stack?: string[];
  note: string;
  stats?: Record<string, number>;
}

export type AlgoId =
  | "linear-search"
  | "binary-search"
  | "bubble-sort"
  | "merge-sort"
  | "recursion"
  | "greedy"
  | "dp"
  | "backtracking";

export interface AlgoSpec {
  algo: AlgoId;
  input: number[];
  target?: number;
  /** Used by recursion (factorial n), DP (fib/stairs n), n-queens. */
  n?: number;
  /** Greedy coin change. */
  coins?: number[];
  amount?: number;
  /** Variant selector for missions that demo multiple sub-cases. */
  variant?: string;
}

export interface AlgoMeta {
  id: AlgoId;
  title: string;
  oneLine: string;
  generate: (spec: AlgoSpec) => Frame[];
}
