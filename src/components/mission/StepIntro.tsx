import type { IntroStep } from "@/lib/missions/types";
import { Bot, DoorOpen, Repeat, KeySquare, Cpu, Terminal, Vault, GitBranch, Sparkles, Hammer } from "lucide-react";

const visuals: Record<IntroStep["visual"], { Icon: typeof Bot; accent: string }> = {
  robot: { Icon: Bot, accent: "from-primary to-secondary" },
  gate: { Icon: DoorOpen, accent: "from-secondary to-primary" },
  loop: { Icon: Repeat, accent: "from-primary to-accent" },
  cipher: { Icon: KeySquare, accent: "from-accent to-secondary" },
  ai: { Icon: Cpu, accent: "from-secondary to-destructive" },
  terminal: { Icon: Terminal, accent: "from-primary to-secondary" },
  vault: { Icon: Vault, accent: "from-accent to-primary" },
  decision: { Icon: GitBranch, accent: "from-primary to-accent" },
  spell: { Icon: Sparkles, accent: "from-secondary to-primary" },
  forge: { Icon: Hammer, accent: "from-accent to-destructive" },
};

export function StepIntro({ step }: { step: IntroStep }) {
  const v = visuals[step.visual];
  return (
    <div className="panel p-8 grid md:grid-cols-[1fr_auto] gap-8 items-center scanline overflow-hidden">
      <div>
        <h1 className="font-display text-3xl sm:text-4xl tracking-wide neon-cyan">{step.title}</h1>
        <p className="mt-4 text-foreground/85 leading-relaxed whitespace-pre-line">{step.story}</p>
      </div>
      <div className="relative animate-fade-in">
        <div className={`absolute inset-0 rounded-full blur-3xl opacity-50 bg-gradient-to-br ${v.accent}`} />
        <div className="relative size-44 rounded-full grid place-items-center bg-surface-2 border border-border animate-float-y glow-ring-cyan">
          <v.Icon className="size-20 text-primary" strokeWidth={1.2} />
        </div>
      </div>
    </div>
  );
}
