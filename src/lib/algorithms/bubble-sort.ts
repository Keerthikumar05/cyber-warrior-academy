import type { Frame, AlgoSpec } from "./types";

export function bubbleSortFrames(spec: AlgoSpec): Frame[] {
  const arr = [...spec.input];
  const n = arr.length;
  const frames: Frame[] = [];
  let comparisons = 0;
  let swaps = 0;

  frames.push({
    array: [...arr],
    note: `Bubble sort: keep swapping adjacent out-of-order pairs. Largest values "bubble" to the end.`,
    stats: { comparisons, swaps },
  });

  for (let i = 0; i < n - 1; i++) {
    let swappedThisPass = false;
    for (let j = 0; j < n - i - 1; j++) {
      comparisons++;
      frames.push({
        array: [...arr],
        highlights: [
          { indices: [j, j + 1], role: "compare" },
          { indices: range(n - i, n - 1), role: "sorted" },
        ],
        pointers: [{ name: "j", index: j }],
        note: `Compare arr[${j}]=${arr[j]} with arr[${j + 1}]=${arr[j + 1]}.`,
        stats: { comparisons, swaps },
      });
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swaps++;
        swappedThisPass = true;
        frames.push({
          array: [...arr],
          highlights: [
            { indices: [j, j + 1], role: "swap" },
            { indices: range(n - i, n - 1), role: "sorted" },
          ],
          pointers: [{ name: "j", index: j }],
          note: `Swap — left was larger. Array is now [${arr.join(", ")}].`,
          stats: { comparisons, swaps },
        });
      }
    }
    frames.push({
      array: [...arr],
      highlights: [{ indices: range(n - i - 1, n - 1), role: "sorted" }],
      note: `End of pass ${i + 1}. arr[${n - i - 1}] = ${arr[n - i - 1]} is now in its final spot.`,
      stats: { comparisons, swaps },
    });
    if (!swappedThisPass) {
      frames.push({
        array: [...arr],
        highlights: [{ indices: range(0, n - 1), role: "sorted" }],
        note: `No swaps this pass — already sorted. Early exit after ${comparisons} comparisons, ${swaps} swaps.`,
        stats: { comparisons, swaps },
      });
      return frames;
    }
  }

  frames.push({
    array: [...arr],
    highlights: [{ indices: range(0, n - 1), role: "sorted" }],
    note: `Sorted in ${comparisons} comparisons and ${swaps} swaps. Worst case O(n²).`,
    stats: { comparisons, swaps },
  });
  return frames;
}

function range(a: number, b: number): number[] {
  const out: number[] = [];
  for (let i = a; i <= b; i++) out.push(i);
  return out;
}
