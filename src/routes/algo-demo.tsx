import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AlgoVisualizer } from "@/components/viz/AlgoVisualizer";
import type { AlgoId } from "@/lib/algorithms/types";
import { algorithms } from "@/lib/algorithms";

export const Route = createFileRoute("/algo-demo")({
  component: AlgoDemo,
  head: () => ({
    meta: [
      { title: "Algorithm Warzone — Visualizer Demo" },
      {
        name: "description",
        content:
          "Interactive visualizer for linear search, binary search, bubble sort, and merge sort.",
      },
    ],
  }),
});

const PRESETS: Record<AlgoId, { input: number[]; target?: number }> = {
  "linear-search": { input: [4, 9, 2, 7, 1, 8, 3], target: 8 },
  "binary-search": { input: [1, 3, 5, 7, 9, 11, 13, 17, 21, 25], target: 17 },
  "bubble-sort": { input: [5, 1, 4, 2, 8] },
  "merge-sort": { input: [38, 27, 43, 3, 9, 82, 10] },
};

function AlgoDemo() {
  const [algo, setAlgo] = useState<AlgoId>("linear-search");
  const [seed, setSeed] = useState(0);
  const preset = PRESETS[algo];

  function randomize() {
    const n = algo === "linear-search" || algo === "binary-search" ? 9 : 8;
    PRESETS[algo].input = Array.from({ length: n }, () => Math.floor(Math.random() * 50) + 1);
    if (algo === "linear-search" || algo === "binary-search") {
      PRESETS[algo].target = PRESETS[algo].input[Math.floor(Math.random() * n)];
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
          <AlgoVisualizer
            key={`${algo}-${seed}`}
            spec={{ algo, input: preset.input, target: preset.target }}
          />
        </div>
      </div>
    </div>
  );
}
