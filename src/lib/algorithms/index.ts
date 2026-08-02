import type { AlgoId, AlgoMeta, AlgoSpec, Frame } from "./types";
import { linearSearchFrames } from "./linear-search";
import { binarySearchFrames } from "./binary-search";
import { bubbleSortFrames } from "./bubble-sort";
import { mergeSortFrames } from "./merge-sort";
import { recursionFrames } from "./recursion";
import { greedyFrames } from "./greedy";
import { dpFrames } from "./dp";
import { backtrackingFrames } from "./backtracking";

export const algorithms: Record<AlgoId, AlgoMeta> = {
  "linear-search": {
    id: "linear-search",
    title: "Linear Search",
    oneLine: "Walk left-to-right; check each cell.",
    generate: linearSearchFrames,
  },
  "binary-search": {
    id: "binary-search",
    title: "Binary Search",
    oneLine: "Halve the window until you hit the target.",
    generate: binarySearchFrames,
  },
  "bubble-sort": {
    id: "bubble-sort",
    title: "Bubble Sort",
    oneLine: "Swap adjacent out-of-order pairs until calm.",
    generate: bubbleSortFrames,
  },
  "merge-sort": {
    id: "merge-sort",
    title: "Merge Sort",
    oneLine: "Split to size 1, merge sorted halves back.",
    generate: mergeSortFrames,
  },
  recursion: {
    id: "recursion",
    title: "Recursion",
    oneLine: "A function that calls itself toward a base case.",
    generate: recursionFrames,
  },
  greedy: {
    id: "greedy",
    title: "Greedy",
    oneLine: "Take the locally best choice. Sometimes optimal — sometimes wrong.",
    generate: greedyFrames,
  },
  dp: {
    id: "dp",
    title: "Dynamic Programming",
    oneLine: "Solve each subproblem once. Reuse the answer.",
    generate: dpFrames,
  },
  backtracking: {
    id: "backtracking",
    title: "Backtracking",
    oneLine: "Try, recurse, undo. Prune dead branches.",
    generate: backtrackingFrames,
  },
};

export function generateFrames(spec: AlgoSpec): Frame[] {
  return algorithms[spec.algo].generate(spec);
}

export type { Frame, AlgoId, AlgoSpec } from "./types";
