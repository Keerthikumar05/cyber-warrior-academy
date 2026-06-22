import type { Frame, AlgoSpec } from "./types";

export function linearSearchFrames(spec: AlgoSpec): Frame[] {
  const arr = [...spec.input];
  const target = spec.target ?? arr[0];
  const frames: Frame[] = [];
  let comparisons = 0;

  frames.push({
    array: arr,
    note: `Scan for ${target}. We will check each cell from left to right.`,
    pointers: [{ name: "i", index: 0 }],
    stats: { comparisons },
  });

  for (let i = 0; i < arr.length; i++) {
    comparisons++;
    if (arr[i] === target) {
      frames.push({
        array: arr,
        highlights: [{ indices: [i], role: "found" }],
        pointers: [{ name: "i", index: i }],
        note: `arr[${i}] = ${arr[i]} matches ${target}. Found after ${comparisons} comparison${comparisons === 1 ? "" : "s"}.`,
        stats: { comparisons },
      });
      return frames;
    }
    frames.push({
      array: arr,
      highlights: [{ indices: [i], role: "compare" }],
      pointers: [{ name: "i", index: i }],
      note: `arr[${i}] = ${arr[i]} ≠ ${target}. Keep going.`,
      stats: { comparisons },
    });
  }

  frames.push({
    array: arr,
    note: `Reached the end. ${target} is not in the array. ${comparisons} comparisons in total — that's O(n).`,
    stats: { comparisons },
  });
  return frames;
}
