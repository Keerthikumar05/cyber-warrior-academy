import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AlgoVisualizer } from "@/components/viz/AlgoVisualizer";
import type { AlgoId, AlgoSpec } from "@/lib/algorithms/types";
import { algorithms } from "@/lib/algorithms";

export const Route = createFileRoute("/algo-demo")({
  component: AlgoDemo,
  head: () => ({
    meta: [
      { title: "Algorithm Warzone — Visualizer Demo" },
      {
        name: "description",
        content:
          "Interactive visualizer for search, sort, recursion, greedy, DP, and backtracking.",
      },
    ],
  }),
});

const PRESETS: Record<AlgoId, Omit<AlgoSpec, "algo">> = {
  "linear-search": { input: [4, 9, 2, 7, 1, 8, 3], target: 8 },
  "binary-search": { input: [1, 3, 5, 7, 9, 11, 13, 17, 21, 25], target: 17 },
  "bubble-sort": { input: [5, 1, 4, 2, 8] },
  "merge-sort": { input: [38, 27, 43, 3, 9, 82, 10] },
  recursion: { input: [], n: 5 },
  greedy: { input: [], coins: [25, 10, 5, 1], amount: 41 },
  dp: { input: [], n: 8 },
  backtracking: { input: [], n: 4 },
};

function AlgoDemo() {
  const [algo, setAlgo] = useState<AlgoId>("linear-search");
  const [seed, setSeed] = useState(0);
  const preset = PRESETS[algo];

  function randomize() {
    if (algo === "linear-search" || algo === "binary-search") {
      const n = 9;
      PRESETS[algo].input = Array.from({ length: n }, () => Math.floor(Math.random() * 50) + 1);
      PRESETS[algo].target = PRESETS[algo].input[Math.floor(Math.random() * n)];
    } else if (algo === "bubble-sort" || algo === "merge-sort") {
      PRESETS[algo].input = Array.from({ length: 8 }, () => Math.floor(Math.random() * 50) + 1);
    } else if (algo === "recursion") {
      PRESETS.recursion.n = 3 + Math.floor(Math.random() * 4);
    } else if (algo === "dp") {
      PRESETS.dp.n = 5 + Math.floor(Math.random() * 6);
    } else if (algo === "greedy") {
      PRESETS.greedy.amount = 10 + Math.floor(Math.random() * 60);
    } else if (algo === "backtracking") {
      PRESETS.backtracking.n = 4 + Math.floor(Math.random() * 3);
    }
    setSeed((s) => s + 1);
  }

  return (
    <div className="min-h-screen grid-bg">
      <div className="mx-auto max-w-5xl px-4 py-8 space-y-6">
        <header>
          <h1 className="font-display text-3xl neon-cyan">Algorithm Warzone — Visualizer</h1>
          <p className="text-muted-foreground mt-1">
            Frame-driven animations. Same primitive powers every mission's concept step.
          </p>
        </header>

        <div className="flex flex-wrap gap-2">
          {(Object.keys(algorithms) as AlgoId[]).map((a) => (
            <button
              key={a}
              onClick={() => setAlgo(a)}
              className={`chip ${a === algo ? "neon-cyan border-primary glow-ring-cyan" : ""}`}
            >
              {algorithms[a].title}
            </button>
          ))}
          <button onClick={randomize} className="chip ml-auto">
            Randomize input
          </button>
        </div>

        <div className="panel p-5">
          <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
            {algorithms[algo].oneLine}
          </div>
          <AlgoVisualizer key={`${algo}-${seed}`} spec={{ algo, ...preset }} />
        </div>

        {algo === "greedy" && (
          <div className="panel p-5">
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
              Counterexample: coins [4, 3, 1], amount 6 — greedy fails.
            </div>
            <AlgoVisualizer
              key={`greedy-counter-${seed}`}
              spec={{ algo: "greedy", input: [], coins: [4, 3, 1], amount: 6, variant: "counterexample" }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
