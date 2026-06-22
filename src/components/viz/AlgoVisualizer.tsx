import { useEffect, useMemo, useRef, useState } from "react";
import { Play, Pause, SkipBack, SkipForward, RotateCcw, Gauge } from "lucide-react";
import { generateFrames } from "@/lib/algorithms";
import type { AlgoSpec, Frame, FrameRole } from "@/lib/algorithms/types";

interface Props {
  spec: AlgoSpec;
  /** Called whenever the active frame changes — used to feed AI mentor context. */
  onFrameChange?: (info: { algo: string; index: number; total: number; note: string }) => void;
  /** Auto-start playback on mount. */
  autoPlay?: boolean;
  /** Initial playback speed in ms per frame. */
  initialDelayMs?: number;
}

const ROLE_CLASS: Record<FrameRole, string> = {
  compare: "border-primary glow-ring-cyan bg-primary/15 text-primary",
  swap: "border-secondary glow-ring-purple bg-secondary/20 text-secondary",
  pointer: "border-accent bg-accent/10 text-accent",
  sorted: "border-success/60 bg-success/15 text-success",
  pivot: "border-accent glow-ring-gold bg-accent/15 text-accent",
  found: "border-success glow-ring-cyan bg-success/25 text-success",
  window: "border-primary/60 bg-primary/5",
  merge: "border-secondary/60 bg-secondary/10 text-secondary",
  split: "border-muted-foreground/60 bg-surface-2",
  discard: "border-destructive/40 bg-destructive/10 text-destructive/70 opacity-50",
};

export function AlgoVisualizer({
  spec,
  onFrameChange,
  autoPlay = true,
  initialDelayMs = 700,
}: Props) {
  const frames = useMemo<Frame[]>(() => generateFrames(spec), [spec]);
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(autoPlay);
  const [delay, setDelay] = useState(initialDelayMs);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setI(0);
    setPlaying(autoPlay);
  }, [spec, autoPlay]);

  useEffect(() => {
    if (!playing) return;
    if (i >= frames.length - 1) {
      setPlaying(false);
      return;
    }
    timer.current = setTimeout(() => setI((n) => Math.min(n + 1, frames.length - 1)), delay);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [i, playing, delay, frames.length]);

  const frame = frames[i];

  useEffect(() => {
    onFrameChange?.({ algo: spec.algo, index: i, total: frames.length, note: frame.note });
  }, [i, frame, frames.length, spec.algo, onFrameChange]);

  // Highlight lookup: index → role
  const roleByIdx = new Map<number, FrameRole>();
  (frame.highlights ?? []).forEach((h) => h.indices.forEach((idx) => roleByIdx.set(idx, h.role)));
  const ptrByIdx = new Map<number, string[]>();
  (frame.pointers ?? []).forEach((p) => {
    const arr = ptrByIdx.get(p.index) ?? [];
    arr.push(p.name);
    ptrByIdx.set(p.index, arr);
  });

  const max = Math.max(1, ...frame.array.map((v) => (typeof v === "number" ? v : 0)));
  const isSort = spec.algo === "bubble-sort" || spec.algo === "merge-sort";

  return (
    <div className="space-y-3">
      {/* Stats */}
      <div className="flex flex-wrap gap-2 text-[10px] uppercase tracking-widest">
        <span className="chip">Frame {i + 1} / {frames.length}</span>
        {frame.stats &&
          Object.entries(frame.stats).map(([k, v]) => (
            <span key={k} className="chip">
              {k}: {v}
            </span>
          ))}
      </div>

      {/* Stage */}
      <div className="rounded-md border border-border bg-surface-2/40 p-4 min-h-[220px]">
        {isSort ? (
          <div className="flex items-end justify-center gap-1.5 h-[180px]">
            {frame.array.map((v, idx) => {
              const role = roleByIdx.get(idx);
              const height = (Number(v) / max) * 100;
              return (
                <div key={idx} className="flex flex-col items-center gap-1 w-9">
                  <div
                    className={`w-full rounded-t border font-mono text-xs grid place-items-end pb-1 transition-all duration-300 ${
                      role ? ROLE_CLASS[role] : "border-border bg-background text-foreground/80"
                    }`}
                    style={{ height: `${Math.max(12, height)}%` }}
                  >
                    {v}
                  </div>
                  <div className="text-[10px] text-muted-foreground">{idx}</div>
                  {ptrByIdx.has(idx) && (
                    <div className="text-[10px] font-mono text-accent">
                      {ptrByIdx.get(idx)!.join(",")}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-wrap items-end justify-center gap-1.5">
            {frame.array.map((v, idx) => {
              const role = roleByIdx.get(idx);
              return (
                <div key={idx} className="flex flex-col items-center gap-1 w-12">
                  <div
                    className={`w-full h-12 grid place-items-center rounded border font-mono text-sm transition-all duration-300 ${
                      role ? ROLE_CLASS[role] : "border-border bg-background"
                    }`}
                  >
                    {v}
                  </div>
                  <div className="text-[10px] text-muted-foreground">{idx}</div>
                  {ptrByIdx.has(idx) && (
                    <div className="text-[10px] font-mono text-accent">
                      ↑ {ptrByIdx.get(idx)!.join(",")}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {frame.subArrays && frame.subArrays.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2 justify-center text-[10px] font-mono text-muted-foreground">
            {frame.subArrays.map((s, k) => (
              <span key={k} className="chip">
                {s.label ?? "sub"} [{s.start}..{s.end}]
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Note */}
      <div className="text-sm text-foreground/90 font-mono bg-surface-2/60 border border-border rounded px-3 py-2 min-h-[44px]">
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground mr-2">
          step
        </span>
        {frame.note}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          className="btn-ghost-neon !py-1 !px-2 text-xs"
          onClick={() => setI(0)}
          aria-label="Reset"
        >
          <RotateCcw className="size-3" /> Reset
        </button>
        <button
          className="btn-ghost-neon !py-1 !px-2 text-xs"
          onClick={() => setI((n) => Math.max(0, n - 1))}
          disabled={i === 0}
        >
          <SkipBack className="size-3" />
        </button>
        <button
          className="btn-hero !py-1.5 !px-3 text-xs"
          onClick={() => {
            if (i >= frames.length - 1) setI(0);
            setPlaying((p) => !p);
          }}
        >
          {playing ? <Pause className="size-3" /> : <Play className="size-3" />}
          {playing ? "Pause" : "Play"}
        </button>
        <button
          className="btn-ghost-neon !py-1 !px-2 text-xs"
          onClick={() => setI((n) => Math.min(frames.length - 1, n + 1))}
          disabled={i >= frames.length - 1}
        >
          <SkipForward className="size-3" />
        </button>
        <div className="flex items-center gap-1 ml-2 text-xs text-muted-foreground">
          <Gauge className="size-3" />
          <input
            type="range"
            min={120}
            max={1400}
            step={40}
            value={1520 - delay}
            onChange={(e) => setDelay(1520 - Number(e.target.value))}
            aria-label="Speed"
            className="w-24"
          />
        </div>
        <input
          type="range"
          min={0}
          max={frames.length - 1}
          value={i}
          onChange={(e) => {
            setPlaying(false);
            setI(Number(e.target.value));
          }}
          className="flex-1 min-w-[140px]"
          aria-label="Scrub frames"
        />
      </div>
    </div>
  );
}
