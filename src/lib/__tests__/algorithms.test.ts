import { describe, it, expect } from "bun:test";
import { linearSearchFrames } from "../algorithms/linear-search";
import { binarySearchFrames } from "../algorithms/binary-search";
import { bubbleSortFrames } from "../algorithms/bubble-sort";
import { mergeSortFrames } from "../algorithms/merge-sort";
import { algorithmWarzoneMissions } from "../missions/algorithm-warzone";

describe("linearSearchFrames", () => {
  it("ends in a 'found' frame at the right index when target exists", () => {
    const frames = linearSearchFrames({
      algo: "linear-search",
      input: [4, 9, 2, 7, 1, 8, 3],
      target: 8,
    });
    const last = frames[frames.length - 1];
    expect(last.highlights?.[0].role).toBe("found");
    expect(last.highlights?.[0].indices).toEqual([5]);
  });

  it("scans the whole array when target is missing", () => {
    const frames = linearSearchFrames({
      algo: "linear-search",
      input: [1, 2, 3, 4],
      target: 9,
    });
    expect(frames[frames.length - 1].stats?.comparisons).toBe(4);
    expect(frames[frames.length - 1].note).toContain("not in the array");
  });

  it("returns first index on duplicates", () => {
    const frames = linearSearchFrames({
      algo: "linear-search",
      input: [7, 3, 3, 9],
      target: 3,
    });
    const last = frames[frames.length - 1];
    expect(last.highlights?.[0].indices).toEqual([1]);
  });
});

describe("binarySearchFrames", () => {
  it("finds the target in a sorted array", () => {
    const frames = binarySearchFrames({
      algo: "binary-search",
      input: [1, 3, 5, 7, 9, 11, 13, 17, 21, 25],
      target: 17,
    });
    const last = frames[frames.length - 1];
    expect(last.highlights?.[0].role).toBe("found");
    expect(last.highlights?.[0].indices).toEqual([7]);
  });

  it("uses O(log n) comparisons (≤ ⌈log2(n)⌉+1)", () => {
    const n = 1024;
    const arr = Array.from({ length: n }, (_, i) => i);
    const frames = binarySearchFrames({ algo: "binary-search", input: arr, target: 777 });
    const cmp = frames[frames.length - 1].stats!.comparisons;
    expect(cmp).toBeLessThanOrEqual(Math.ceil(Math.log2(n)) + 1);
  });

  it("reports missing when target absent", () => {
    const frames = binarySearchFrames({
      algo: "binary-search",
      input: [2, 4, 6, 8, 10],
      target: 5,
    });
    expect(frames[frames.length - 1].note).toContain("not in the array");
  });

  it("auto-sorts input before searching", () => {
    const frames = binarySearchFrames({
      algo: "binary-search",
      input: [9, 1, 5, 3, 7],
      target: 7,
    });
    expect(frames[0].array).toEqual([1, 3, 5, 7, 9]);
  });
});

describe("bubbleSortFrames", () => {
  it("produces a sorted final frame", () => {
    const input = [5, 1, 4, 2, 8];
    const frames = bubbleSortFrames({ algo: "bubble-sort", input });
    expect(frames[frames.length - 1].array).toEqual([1, 2, 4, 5, 8]);
  });

  it("early-exits on already-sorted input", () => {
    const frames = bubbleSortFrames({ algo: "bubble-sort", input: [1, 2, 3, 4] });
    expect(frames[frames.length - 1].stats?.swaps).toBe(0);
    expect(frames[frames.length - 1].note.toLowerCase()).toContain("early exit");
  });

  it("counts swaps correctly on a known case", () => {
    // [3,1,2] → swap (3,1) → [1,3,2] → swap (3,2) → [1,2,3]; second pass 0 swaps
    const frames = bubbleSortFrames({ algo: "bubble-sort", input: [3, 1, 2] });
    expect(frames[frames.length - 1].stats?.swaps).toBe(2);
  });

  it("handles random inputs against Array.prototype.sort", () => {
    for (let s = 0; s < 5; s++) {
      const input = Array.from({ length: 10 }, () => Math.floor(Math.random() * 100));
      const expected = [...input].sort((a, b) => a - b);
      const frames = bubbleSortFrames({ algo: "bubble-sort", input });
      expect(frames[frames.length - 1].array).toEqual(expected);
    }
  });
});

describe("mergeSortFrames", () => {
  it("produces a sorted final frame", () => {
    const input = [38, 27, 43, 3, 9, 82, 10];
    const frames = mergeSortFrames({ algo: "merge-sort", input });
    expect(frames[frames.length - 1].array).toEqual([3, 9, 10, 27, 38, 43, 82]);
  });

  it("handles edge cases (empty + single)", () => {
    expect(mergeSortFrames({ algo: "merge-sort", input: [] }).at(-1)!.array).toEqual([]);
    expect(mergeSortFrames({ algo: "merge-sort", input: [42] }).at(-1)!.array).toEqual([42]);
  });

  it("comparisons stay within n log n bounds", () => {
    const n = 64;
    const input = Array.from({ length: n }, () => Math.floor(Math.random() * 200));
    const frames = mergeSortFrames({ algo: "merge-sort", input });
    const cmp = frames[frames.length - 1].stats!.comparisons;
    expect(cmp).toBeLessThanOrEqual(Math.ceil(n * Math.log2(n)));
  });

  it("matches Array.prototype.sort across random inputs", () => {
    for (let s = 0; s < 5; s++) {
      const input = Array.from({ length: 16 }, () => Math.floor(Math.random() * 1000) - 500);
      const expected = [...input].sort((a, b) => a - b);
      const frames = mergeSortFrames({ algo: "merge-sort", input });
      expect(frames[frames.length - 1].array).toEqual(expected);
    }
  });
});

describe("algorithm-warzone missions", () => {
  it("has 4 missions wired into the world", () => {
    expect(algorithmWarzoneMissions.length).toBe(4);
    for (const m of algorithmWarzoneMissions) {
      expect(m.worldSlug).toBe("algorithm-warzone");
      expect(m.steps[0].kind).toBe("intro");
      expect(m.steps.at(-1)!.kind).toBe("mastery");
      // every mission must end with a mastery step that grants XP
      const last = m.steps.at(-1)!;
      if (last.kind === "mastery") expect(last.xpReward).toBeGreaterThan(0);
    }
  });

  it("each mission's concept step references an algo-viz", () => {
    for (const m of algorithmWarzoneMissions) {
      const concept = m.steps.find((s) => s.kind === "concept");
      expect(concept).toBeDefined();
      if (concept && concept.kind === "concept") {
        expect(concept.demo.type).toBe("algo-viz");
      }
    }
  });

  it("each mission has a code step and a boss code challenge with hidden tests", () => {
    for (const m of algorithmWarzoneMissions) {
      const code = m.steps.find((s) => s.kind === "code");
      const boss = m.steps.find((s) => s.kind === "boss");
      expect(code).toBeDefined();
      expect(boss).toBeDefined();
      if (code && code.kind === "code") {
        expect(code.tests.length).toBeGreaterThanOrEqual(2);
      }
      if (boss && boss.kind === "boss" && boss.challenge.type === "code") {
        expect(boss.challenge.tests.length).toBeGreaterThanOrEqual(2);
      }
    }
  });
});
