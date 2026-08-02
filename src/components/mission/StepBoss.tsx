import type { BossStep } from "@/lib/missions/types";
import { Skull } from "lucide-react";
import { Challenge } from "./StepPractice";
import { CodeRunner } from "./StepCode";

export function StepBoss({
  step,
  onSolved,
  onContext,
}: {
  step: BossStep;
  onSolved: () => void;
  onContext?: (c: { userCode?: string; lastError?: string; missionBrief?: string }) => void;
}) {
  const isCode = step.challenge.type === "code";
  return (
    <div className="space-y-5">
      <div className="panel p-6 border-secondary/40 glow-ring-purple/40">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest neon-purple">
          <Skull className="size-4" /> Boss Encounter
        </div>
        <h2 className="font-display text-2xl mt-1 neon-purple">{step.title}</h2>
        <p className="mt-2 text-foreground/85 whitespace-pre-line">{step.story}</p>
      </div>
      {isCode ? (
        <CodeRunner
          step={{
            kind: "boss",
            title: step.title,
            brief: (step.challenge as { brief: string }).brief,
            language: "python",
            starter: (step.challenge as { starter: string }).starter,
            tests: (step.challenge as { tests: import("@/lib/missions/types").CodeTest[] }).tests,
            hintTopic: (step.challenge as { hintTopic: string }).hintTopic,
          }}
          onSolved={onSolved}
          onContext={(c) => onContext?.({ ...c, missionBrief: (step.challenge as { brief: string }).brief })}
        />
      ) : (
        <div className="panel p-6">
          <p className="text-foreground/85 mb-4 whitespace-pre-line">
            {(step.challenge as { prompt: string }).prompt}
          </p>
          <Challenge challenge={step.challenge as import("@/lib/missions/types").PracticeKind} onSolved={onSolved} />
        </div>
      )}
    </div>
  );
}
