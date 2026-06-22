import type { Frame, AlgoSpec } from "./types";

export function binarySearchFrames(spec: AlgoSpec): Frame[] {
  const arr = [...spec.input].sort((a, b) => a - b);
  const target = spec.target ?? arr[Math.floor(arr.length / 2)];
  const frames: Frame[] = [];
  let lo = 0;
  let hi = arr.length - 1;
  let comparisons = 0;

  frames.push({
    array: arr,
    note: `Sorted input. Search for ${target} by halving the window. lo=${lo}, hi=${hi}.`,
    pointers: [{ name: "lo", index: lo }, { name: "hi", index: hi }],
    highlights: [{ indices: range(lo, hi), role: "window" }],
    stats: { comparisons },
  });

  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    comparisons++;
    frames.push({
      array: arr,
      pointers: [
        { name: "lo", index: lo },
        { name: "mid", index: mid },
        { name: "hi", index: hi },
      ],
      highlights: [
        { indices: range(lo, hi), role: "window" },
        { indices: [mid], role: "pivot" },
      ],
      note: `mid = (${lo}+${hi})/2 = ${mid}. arr[mid] = ${arr[mid]}.`,
      stats: { comparisons },
    });

    if (arr[mid] === target) {
      frames.push({
        array: arr,
        pointers: [{ name: "mid", index: mid }],
        highlights: [{ indices: [mid], role: "found" }],
        note: `arr[${mid}] = ${arr[mid]} matches. Found in ${comparisons} comparisons — O(log n).`,
        stats: { comparisons },
      });
      return frames;
    }

    if (arr[mid] < target) {
      const discarded = range(lo, mid);
      lo = mid + 1;
      frames.push({
        array: arr,
        pointers: [{ name: "lo", index: lo }, { name: "hi", index: hi }],
        highlights: [
          { indices: discarded, role: "discard" },
          { indices: range(lo, hi), role: "window" },
        ],
        note: `${arr[mid]} < ${target}. Discard left half. lo = mid+1 = ${lo}.`,
        stats: { comparisons },
      });
    } else {
      const discarded = range(mid, hi);
      hi = mid - 1;
      frames.push({
        array: arr,
        pointers: [{ name: "lo", index: lo }, { name: "hi", index: hi }],
        highlights: [
          { indices: discarded, role: "discard" },
          { indices: lo <= hi ? range(lo, hi) : [], role: "window" },
        ],
        note: `${arr[mid]} > ${target}. Discard right half. hi = mid-1 = ${hi}.`,
        stats: { comparisons },
      });
    }
  }

  frames.push({
    array: arr,
    note: `Window is empty (lo > hi). ${target} is not in the array. ${comparisons} comparisons total.`,
    stats: { comparisons },
  });
  return frames;
}

function range(a: number, b: number): number[] {
  const out: number[] = [];
  for (let i = a; i <= b; i++) out.push(i);
  return out;
}
