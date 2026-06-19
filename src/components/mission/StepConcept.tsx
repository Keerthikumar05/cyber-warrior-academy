import { useEffect, useState } from "react";
import { motion } from "motion/react";
import type { ConceptStep, DSOp } from "@/lib/missions/types";
import { Check, X, ArrowRight } from "lucide-react";

export function StepConcept({ step }: { step: ConceptStep }) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="panel p-6">
        <h2 className="font-display text-2xl neon-purple">{step.title}</h2>
        <p className="mt-3 text-foreground/85 leading-relaxed whitespace-pre-line">{step.body}</p>
      </div>
      <div className="panel p-6 min-h-[280px]">
        <Demo demo={step.demo} />
      </div>
    </div>
  );
}

function Demo({ demo }: { demo: ConceptStep["demo"] }) {
  if (demo.type === "sequence-demo") return <SequenceDemo items={demo.items} />;
  if (demo.type === "truth-table") return <TruthTable rows={demo.rows} />;
  if (demo.type === "loop-counter") return <LoopCounter from={demo.from} to={demo.to} />;
  if (demo.type === "code-trace") return <CodeTrace lines={demo.lines} explain={demo.explain} />;
  if (demo.type === "var-box") return <VarBox values={demo.values} />;
  if (demo.type === "ds-viz") return <DSViz structure={demo.structure} ops={demo.ops} />;
  if (demo.type === "bug-diff") return <BugDiff before={demo.before} after={demo.after} explain={demo.explain} />;
  return null;
}

function SequenceDemo({ items }: { items: string[] }) {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setActive((i) => (i + 1) % items.length), 1100);
    return () => clearInterval(t);
  }, [items.length]);
  return (
    <div className="space-y-2">
      <div className="text-xs uppercase tracking-widest text-muted-foreground">Running…</div>
      {items.map((it, i) => (
        <motion.div
          key={i}
          className={`flex items-center gap-3 rounded-md px-3 py-2 border ${
            i === active ? "border-primary glow-ring-cyan bg-primary/10" : "border-border"
          }`}
          animate={{ scale: i === active ? 1.02 : 1 }}
        >
          <span className="font-mono text-xs text-muted-foreground">{i + 1}</span>
          <span>{it}</span>
        </motion.div>
      ))}
    </div>
  );
}

function TruthTable({ rows }: { rows: Array<{ a: boolean; b?: boolean; out: boolean; label: string }> }) {
  return (
    <div className="space-y-2">
      <div className="text-xs uppercase tracking-widest text-muted-foreground">Truth tables</div>
      <table className="w-full text-sm font-mono">
        <thead className="text-xs text-muted-foreground">
          <tr>
            <th className="text-left py-1">Expr</th>
            <th className="text-right py-1">Result</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-border">
              <td className="py-2">{r.label}</td>
              <td className="py-2 text-right">
                {r.out ? (
                  <span className="chip glow-ring-cyan/30"><Check className="size-3" /> true</span>
                ) : (
                  <span className="chip"><X className="size-3" /> false</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function LoopCounter({ from, to }: { from: number; to: number }) {
  const [i, setI] = useState(from);
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n >= to ? from : n + 1)), 700);
    return () => clearInterval(t);
  }, [from, to]);
  return (
    <div className="flex flex-col items-center justify-center gap-4 h-full">
      <div className="text-xs uppercase tracking-widest text-muted-foreground">for i in range({from}, {to + 1})</div>
      <motion.div
        key={i}
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="size-32 rounded-full grid place-items-center bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary glow-ring-cyan font-display text-5xl neon-cyan"
      >
        {i}
      </motion.div>
      <div className="font-mono text-sm text-muted-foreground">step #{i - from + 1}</div>
    </div>
  );
}

function CodeTrace({ lines, explain }: { lines: string[]; explain: string[] }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Trace</div>
      <div className="space-y-1 font-mono text-sm">
        {lines.map((l, i) => (
          <div key={i} className="grid grid-cols-[1fr_auto] gap-3 items-start">
            <pre className="bg-surface-2 border border-border rounded px-2 py-1 whitespace-pre-wrap">
              {l || "\u00A0"}
            </pre>
            <span className="text-xs text-muted-foreground self-center max-w-[180px]">{explain[i]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function VarBox({ values }: { values: Array<{ name: string; value: string; type: string }> }) {
  return (
    <div className="space-y-3">
      <div className="text-xs uppercase tracking-widest text-muted-foreground">Memory</div>
      {values.map((v) => (
        <div key={v.name} className="rounded-md border border-border p-3 bg-surface-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-primary">{v.name}</span>
            <span className="text-[10px] uppercase tracking-widest chip">{v.type}</span>
          </div>
          <div className="mt-1 font-mono text-foreground/90">{v.value}</div>
        </div>
      ))}
    </div>
  );
}
