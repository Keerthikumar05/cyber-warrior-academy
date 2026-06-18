import { motion } from "motion/react";
import type { MasteryStep } from "@/lib/missions/types";
import { Trophy, Star, Sparkles } from "lucide-react";

export function StepMastery({
  step,
  onFinish,
  alreadyDone,
}: {
  step: MasteryStep;
  onFinish: () => void;
  alreadyDone: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="panel p-8 text-center scanline overflow-hidden"
    >
      <motion.div
        initial={{ rotate: -10, scale: 0.6 }}
        animate={{ rotate: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 14 }}
        className="mx-auto size-24 rounded-full grid place-items-center bg-gradient-to-br from-accent to-secondary glow-ring-gold"
      >
        <Trophy className="size-12 text-accent-foreground" />
      </motion.div>
      <h2 className="font-display text-3xl mt-5 neon-gold">{step.title}</h2>
      <p className="mt-2 text-foreground/85 max-w-xl mx-auto">{step.summary}</p>

      <div className="mt-6 grid sm:grid-cols-3 gap-3 max-w-2xl mx-auto text-left">
        {step.takeaways.map((t, i) => (
          <div key={i} className="panel p-3 text-sm">
            <Sparkles className="size-3 text-primary mb-1" />
            {t}
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-center gap-3 flex-wrap">
        <span className="chip glow-ring-gold/40">
          <Star className="size-3 text-accent" /> +{step.xpReward} XP
        </span>
        {step.badgeName && (
          <span className="chip glow-ring-purple/40 neon-purple">
            <Trophy className="size-3" /> {step.badgeName}
          </span>
        )}
      </div>

      <button onClick={onFinish} className="btn-hero mt-6">
        {alreadyDone ? "Continue" : "Claim rewards"}
      </button>
    </motion.div>
  );
}
