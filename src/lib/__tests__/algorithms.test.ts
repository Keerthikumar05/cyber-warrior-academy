import { describe, it, expect } from "bun:test";
import { linearSearchFrames } from "../algorithms/linear-search";
import { binarySearchFrames } from "../algorithms/binary-search";
import { bubbleSortFrames } from "../algorithms/bubble-sort";
import { mergeSortFrames } from "../algorithms/merge-sort";
import { recursionFrames } from "../algorithms/recursion";
import { greedyFrames } from "../algorithms/greedy";
import { dpFrames } from "../algorithms/dp";
import { backtrackingFrames } from "../algorithms/backtracking";
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
  });
});

describe("binarySearchFrames", () => {
  it("finds the target in a sorted array", () => {
    const frames = binarySearchFrames({
      algo: "binary-search",
      input: [1, 3, 5, 7, 9, 11, 13, 17, 21, 25],
      target: 17,
    });
    expect(frames[frames.length - 1].highlights?.[0].role).toBe("found");
  });
  it("uses O(log n) comparisons", () => {
    const n = 1024;
    const arr = Array.from({ length: n }, (_, i) => i);
    const frames = binarySearchFrames({ algo: "binary-search", input: arr, target: 777 });
    const cmp = frames[frames.length - 1].stats!.comparisons;
    expect(cmp).toBeLessThanOrEqual(Math.ceil(Math.log2(n)) + 1);
  });
});

describe("bubbleSortFrames", () => {
  it("produces a sorted final frame", () => {
    const frames = bubbleSortFrames({ algo: "bubble-sort", input: [5, 1, 4, 2, 8] });
    expect(frames[frames.length - 1].array).toEqual([1, 2, 4, 5, 8]);
  });
  it("matches Array.prototype.sort on random inputs", () => {
    for (let s = 0; s < 3; s++) {
      const input = Array.from({ length: 10 }, () => Math.floor(Math.random() * 100));
      const expected = [...input].sort((a, b) => a - b);
      const frames = bubbleSortFrames({ algo: "bubble-sort", input });
      expect(frames[frames.length - 1].array).toEqual(expected);
    }
  });
});

describe("mergeSortFrames", () => {
  it("produces a sorted final frame", () => {
    const frames = mergeSortFrames({ algo: "merge-sort", input: [38, 27, 43, 3, 9, 82, 10] });
    expect(frames[frames.length - 1].array).toEqual([3, 9, 10, 27, 38, 43, 82]);
  });
  it("comparisons stay within n log n bounds", () => {
    const n = 64;
    const input = Array.from({ length: n }, () => Math.floor(Math.random() * 200));
    const frames = mergeSortFrames({ algo: "merge-sort", input });
    expect(frames[frames.length - 1].stats!.comparisons).toBeLessThanOrEqual(
      Math.ceil(n * Math.log2(n)),
    );
  });
});

describe("recursionFrames", () => {
  it("builds a tree with 1 active+returned root and n nodes overall for factorial(n)", () => {
    const frames = recursionFrames({ algo: "recursion", input: [], n: 5 });
    const last = frames[frames.length - 1];
    expect(last.tree?.length).toBe(5);
    expect(last.tree?.[0].label).toBe("fact(5)");
    expect(last.tree?.[0].status).toBe("returned");
    // Last node should be the base case
    const base = last.tree!.find((t) => t.label === "fact(1)");
    expect(base?.status).toBe("base");
    expect(last.note).toContain("factorial(5) = 120");
  });
  it("handles n=0 base case", () => {
    const frames = recursionFrames({ algo: "recursion", input: [], n: 0 });
    expect(frames[frames.length - 1].note).toContain("= 1");
  });
  it("populates and empties the call stack", () => {
    const frames = recursionFrames({ algo: "recursion", input: [], n: 4 });
    const maxStack = Math.max(...frames.map((f) => f.stack?.length ?? 0));
    expect(maxStack).toBe(4);
    expect(frames[frames.length - 1].stack?.length).toBe(0);
  });
});

describe("greedyFrames", () => {
  it("solves canonical US coins optimally for 41¢ (4 coins)", () => {
    const frames = greedyFrames({ algo: "greedy", input: [], coins: [25, 10, 5, 1], amount: 41 });
    const last = frames[frames.length - 1];
    expect(last.stats?.picks).toBe(4);
    expect(last.note).toContain("Matches the optimum");
  });
  it("surfaces the [1,3,4] counterexample for amount 6", () => {
    const frames = greedyFrames({
      algo: "greedy",
      input: [],
      coins: [1, 3, 4],
      amount: 6,
      variant: "counterexample",
    });
    const last = frames[frames.length - 1];
    expect(last.stats?.picks).toBe(3);
    expect(last.stats?.optimal).toBe(2);
    expect(last.note).toContain("FAILS");
  });
});

describe("dpFrames", () => {
  it("computes climb_stairs(8) = fib(9) = 34 via the final grid", () => {
    const frames = dpFrames({ algo: "dp", input: [], n: 8 });
    const last = frames[frames.length - 1];
    expect(last.grid).toBeDefined();
    expect(last.stats?.answer).toBe(34);
  });
  it("renders a 1×(n+1) grid", () => {
    const frames = dpFrames({ algo: "dp", input: [], n: 6 });
    const last = frames[frames.length - 1];
    expect(last.grid?.rows).toBe(1);
    expect(last.grid?.cols).toBe(7);
  });
});

describe("backtrackingFrames", () => {
  it("finds a 4-queens solution and produces a board grid", () => {
    const frames = backtrackingFrames({ algo: "backtracking", input: [], n: 4 });
    const last = frames[frames.length - 1];
    expect(last.grid?.rows).toBe(4);
    expect(last.grid?.cols).toBe(4);
    expect(last.stats?.solutions).toBe(1);
    expect(last.stats?.prunes).toBeGreaterThan(0);
  });
});

describe("algorithm-warzone missions (full world)", () => {
  it("has 8 missions wired into the world", () => {
    expect(algorithmWarzoneMissions.length).toBe(8);
    for (const m of algorithmWarzoneMissions) {
      expect(m.worldSlug).toBe("algorithm-warzone");
      expect(m.steps[0].kind).toBe("intro");
      expect(m.steps.at(-1)!.kind).toBe("mastery");
    }
  });
  it("the 8th mission grants the algorithm-warzone-veteran completion badge", () => {
    const m8 = algorithmWarzoneMissions[7];
    const mastery = m8.steps.at(-1)!;
    if (mastery.kind === "mastery") {
      expect(mastery.badgeSlug).toBe("algorithm-warzone-veteran");
    }
  });
  it("every mission has a concept algo-viz, a code step, and a code boss with hidden tests", () => {
    for (const m of algorithmWarzoneMissions) {
      const concept = m.steps.find((s) => s.kind === "concept");
      const code = m.steps.find((s) => s.kind === "code");
      const boss = m.steps.find((s) => s.kind === "boss");
      expect(concept && concept.kind === "concept" && concept.demo.type).toBe("algo-viz");
      expect(code).toBeDefined();
      expect(boss).toBeDefined();
      if (code && code.kind === "code") expect(code.tests.length).toBeGreaterThanOrEqual(3);
      if (boss && boss.kind === "boss" && boss.challenge.type === "code") {
        expect(boss.challenge.tests.length).toBeGreaterThanOrEqual(3);
      }
    }
  });
});
