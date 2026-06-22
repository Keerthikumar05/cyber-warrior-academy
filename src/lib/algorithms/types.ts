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
  | "discard";

export interface FrameHighlight {
  indices: number[];
  role: FrameRole;
}

export interface FramePointer {
  name: string; // e.g. "lo", "hi", "i", "j"
  index: number;
}

export interface FrameSubArray {
  start: number;
  end: number; // inclusive
  label?: string;
}

export interface Frame {
  /** Snapshot of the visible array at this step. */
  array: (number | string)[];
  highlights?: FrameHighlight[];
  pointers?: FramePointer[];
  /** Optional bracketed sub-ranges (used by merge sort splits). */
  subArrays?: FrameSubArray[];
  /** One-line teaching note for this frame — also fed to the AI mentor. */
  note: string;
  /** Optional counters surfaced as chips (comparisons, swaps, recursion depth). */
  stats?: Record<string, number>;
}

export type AlgoId =
  | "linear-search"
  | "binary-search"
  | "bubble-sort"
  | "merge-sort";

export interface AlgoSpec {
  algo: AlgoId;
  input: number[];
  target?: number;
}

export interface AlgoMeta {
  id: AlgoId;
  title: string;
  oneLine: string;
  generate: (spec: AlgoSpec) => Frame[];
}
