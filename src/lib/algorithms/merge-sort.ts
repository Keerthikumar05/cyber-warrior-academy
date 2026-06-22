import type { Frame, AlgoSpec, FrameSubArray } from "./types";

export function mergeSortFrames(spec: AlgoSpec): Frame[] {
  const arr = [...spec.input];
  const frames: Frame[] = [];
  let comparisons = 0;
  let writes = 0;

  frames.push({
    array: [...arr],
    note: `Merge sort: split the array in half until each piece is size 1, then merge sorted pieces back together.`,
    stats: { comparisons, writes },
  });

  function sort(lo: number, hi: number, depth: number) {
    if (lo >= hi) return;
    const mid = (lo + hi) >> 1;
    frames.push({
      array: [...arr],
      subArrays: [
        { start: lo, end: mid, label: "L" },
        { start: mid + 1, end: hi, label: "R" },
      ],
      highlights: [{ indices: rangeI(lo, hi), role: "split" }],
      note: `Split [${lo}..${hi}] → [${lo}..${mid}] and [${mid + 1}..${hi}] (depth ${depth}).`,
      stats: { comparisons, writes, depth },
    });
    sort(lo, mid, depth + 1);
    sort(mid + 1, hi, depth + 1);
    merge(lo, mid, hi, depth);
  }

  function merge(lo: number, mid: number, hi: number, depth: number) {
    const left = arr.slice(lo, mid + 1);
    const right = arr.slice(mid + 1, hi + 1);
    let i = 0;
    let j = 0;
    let k = lo;
    const sub: FrameSubArray[] = [
      { start: lo, end: mid, label: "L" },
      { start: mid + 1, end: hi, label: "R" },
    ];
    frames.push({
      array: [...arr],
      subArrays: sub,
      highlights: [{ indices: rangeI(lo, hi), role: "merge" }],
      note: `Merge sorted halves [${lo}..${mid}] and [${mid + 1}..${hi}].`,
      stats: { comparisons, writes, depth },
    });
    while (i < left.length && j < right.length) {
      comparisons++;
      if (left[i] <= right[j]) {
        arr[k] = left[i];
        writes++;
        frames.push({
          array: [...arr],
          subArrays: sub,
          highlights: [{ indices: [k], role: "merge" }],
          pointers: [
            { name: "L", index: lo + i },
            { name: "R", index: mid + 1 + j },
            { name: "k", index: k },
          ],
          note: `${left[i]} ≤ ${right[j]} → write ${left[i]} at index ${k}.`,
          stats: { comparisons, writes, depth },
        });
        i++;
      } else {
        arr[k] = right[j];
        writes++;
        frames.push({
          array: [...arr],
          subArrays: sub,
          highlights: [{ indices: [k], role: "merge" }],
          pointers: [
            { name: "L", index: lo + i },
            { name: "R", index: mid + 1 + j },
            { name: "k", index: k },
          ],
          note: `${right[j]} < ${left[i]} → write ${right[j]} at index ${k}.`,
          stats: { comparisons, writes, depth },
        });
        j++;
      }
      k++;
    }
    while (i < left.length) {
      arr[k] = left[i];
      writes++;
      i++;
      k++;
    }
    while (j < right.length) {
      arr[k] = right[j];
      writes++;
      j++;
      k++;
    }
    frames.push({
      array: [...arr],
      highlights: [{ indices: rangeI(lo, hi), role: "sorted" }],
      note: `Range [${lo}..${hi}] is now sorted: [${arr.slice(lo, hi + 1).join(", ")}].`,
      stats: { comparisons, writes, depth },
    });
  }

  sort(0, arr.length - 1, 0);

  frames.push({
    array: [...arr],
    highlights: [{ indices: rangeI(0, arr.length - 1), role: "sorted" }],
    note: `Done. ${comparisons} comparisons, ${writes} writes. Total work is O(n log n).`,
    stats: { comparisons, writes },
  });
  return frames;
}

function rangeI(a: number, b: number): number[] {
  const out: number[] = [];
  for (let i = a; i <= b; i++) out.push(i);
  return out;
}
