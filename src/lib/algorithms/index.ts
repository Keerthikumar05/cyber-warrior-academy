import type { AlgoId, AlgoMeta, AlgoSpec, Frame } from "./types";
import { linearSearchFrames } from "./linear-search";
import { binarySearchFrames } from "./binary-search";
import { bubbleSortFrames } from "./bubble-sort";
import { mergeSortFrames } from "./merge-sort";

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
};

export function generateFrames(spec: AlgoSpec): Frame[] {
  return algorithms[spec.algo].generate(spec);
}

export type { Frame, AlgoId, AlgoSpec } from "./types";
