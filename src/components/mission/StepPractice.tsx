import { useState } from "react";
import { motion, Reorder } from "motion/react";
import type { PracticeStep, PracticeKind } from "@/lib/missions/types";
import { Check, X, Sparkles } from "lucide-react";

export function StepPractice({ step, onSolved }: { step: PracticeStep; onSolved: () => void }) {
  return (
    <div className="panel p-6">
      <h2 className="font-display text-2xl neon-cyan">{step.title}</h2>
      <p className="mt-2 text-foreground/85 whitespace-pre-line">{step.challenge.prompt}</p>
      <div className="mt-5">
        <Challenge challenge={step.challenge} onSolved={onSolved} />
      </div>
    </div>
  );
}

export function Challenge({ challenge, onSolved }: { challenge: PracticeKind; onSolved: () => void }) {
  if (challenge.type === "sequence") return <SequenceChallenge data={challenge} onSolved={onSolved} />;
  if (challenge.type === "mcq" || challenge.type === "predict" || challenge.type === "pattern")
    return <ChoiceChallenge data={challenge} onSolved={onSolved} />;
  return null;
}

function SequenceChallenge({
  data,
  onSolved,
}: {
  data: Extract<PracticeKind, { type: "sequence" }>;
  onSolved: () => void;
}) {
  const [items, setItems] = useState(data.shuffled);
  const [status, setStatus] = useState<"idle" | "wrong" | "right">("idle");

  function check() {
    const ok = items.length === data.correct.length && items.every((v, i) => v === data.correct[i]);
    if (ok) {
      setStatus("right");
      onSolved();
    } else setStatus("wrong");
  }

  return (
    <div>
      <Reorder.Group axis="y" values={items} onReorder={setItems} className="space-y-2">
        {items.map((it) => (
          <Reorder.Item
            key={it}
            value={it}
            className="cursor-grab active:cursor-grabbing rounded-md border border-border bg-surface-2 px-3 py-2 flex items-center gap-3 hover:border-primary/60"
            whileDrag={{ scale: 1.03, boxShadow: "0 0 22px oklch(0.82 0.18 195 / 0.6)" }}
          >
            <span className="font-mono text-xs text-muted-foreground">⋮⋮</span>
            <span>{it}</span>
          </Reorder.Item>
        ))}
      </Reorder.Group>
      <div className="mt-4 flex items-center gap-3">
        <button onClick={check} className="btn-hero text-xs">
          Check sequence
        </button>
        {status === "right" && (
          <motion.span initial={{ scale: 0.6 }} animate={{ scale: 1 }} className="chip glow-ring-cyan/40">
            <Check className="size-3 text-primary" /> Correct
          </motion.span>
        )}
        {status === "wrong" && (
          <motion.span initial={{ x: -4 }} animate={{ x: [4, -4, 4, 0] }} className="chip text-destructive">
            <X className="size-3" /> Not quite — try reordering.
          </motion.span>
        )}
      </div>
    </div>
  );
}

function ChoiceChallenge({
  data,
  onSolved,
}: {
  data:
    | Extract<PracticeKind, { type: "mcq" }>
    | Extract<PracticeKind, { type: "predict" }>
    | Extract<PracticeKind, { type: "pattern" }>;
  onSolved: () => void;
}) {
  const [picked, setPicked] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  function choose(i: number) {
    if (revealed) return;
    setPicked(i);
    setRevealed(true);
    if (i === data.correctIndex) onSolved();
  }

  return (
    <div className="space-y-4">
      {"code" in data && data.code && (
        <pre className="font-mono text-sm bg-surface-2 border border-border rounded-md p-3 overflow-x-auto whitespace-pre-wrap">
          {data.code}
        </pre>
      )}
      {"sequence" in data && data.sequence && (
        <div className="flex items-center gap-2 flex-wrap">
          {data.sequence.map((n, i) => (
            <span key={i} className="font-mono px-3 py-1.5 rounded-md bg-surface-2 border border-border">
              {n}
            </span>
          ))}
          <span className="font-mono px-3 py-1.5 rounded-md bg-surface-2 border border-dashed border-primary/60 neon-cyan">
            ?
          </span>
        </div>
      )}
      <div className="grid sm:grid-cols-2 gap-2">
        {data.options.map((opt, i) => {
          const correct = revealed && i === data.correctIndex;
          const wrong = revealed && picked === i && i !== data.correctIndex;
          return (
            <button
              key={i}
              onClick={() => choose(i)}
              className={[
                "text-left px-4 py-3 rounded-md border transition font-mono text-sm",
                correct
                  ? "border-success bg-success/15 text-success"
                  : wrong
                    ? "border-destructive bg-destructive/15 text-destructive"
                    : "border-border bg-surface-2 hover:border-primary/60 hover:glow-ring-cyan",
              ].join(" ")}
            >
              {String(opt)}
            </button>
          );
        })}
      </div>
      {revealed && (
        <div
          className={`text-sm rounded-md p-3 border ${
            picked === data.correctIndex
              ? "border-success/40 bg-success/5 text-foreground"
              : "border-secondary/40 bg-secondary/5 text-foreground"
          }`}
        >
          <div className="flex items-center gap-2 font-display tracking-widest text-xs neon-purple mb-1">
            <Sparkles className="size-3" /> EXPLANATION
          </div>
          {data.explain}
          {picked !== data.correctIndex && (
            <div className="mt-2">
              <button
                className="btn-ghost-neon !py-1 !px-3 text-xs"
                onClick={() => {
                  setPicked(null);
                  setRevealed(false);
                }}
              >
                Try again
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
