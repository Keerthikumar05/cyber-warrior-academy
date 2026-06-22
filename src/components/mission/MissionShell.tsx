import { useEffect, useMemo, useState } from "react";
// (motion removed from this file; CSS animations used instead)
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, CheckCircle2, Star, Trophy, X } from "lucide-react";
import type { Mission, MissionStep } from "@/lib/missions/types";
import { nextMission } from "@/lib/missions";
import { awardGuest, awardCloud, isMissionCompletedLocal } from "@/lib/progress";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { StepIntro } from "./StepIntro";
import { StepConcept } from "./StepConcept";
import { StepPractice } from "./StepPractice";
import { StepCode } from "./StepCode";
import { StepBoss } from "./StepBoss";
import { StepMastery } from "./StepMastery";
import { MentorPanel, type MentorContext } from "@/components/MentorPanel";

interface Props {
  mission: Mission;
}

export function MissionShell({ mission }: Props) {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [canAdvance, setCanAdvance] = useState(false);
  const [mentorCtx, setMentorCtx] = useState<MentorContext>({
    worldSlug: mission.worldSlug,
    missionSlug: mission.slug,
    missionTitle: mission.title,
    topics: mission.topics,
  });
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    setCompleted(isMissionCompletedLocal(mission.worldSlug, mission.slug));
  }, [mission]);

  const step: MissionStep = mission.steps[index];
  const isLast = index === mission.steps.length - 1;
  const progressPct = ((index + (canAdvance ? 1 : 0.4)) / mission.steps.length) * 100;

  // Reset advance gate per step
  useEffect(() => {
    if (step.kind === "intro" || step.kind === "concept" || step.kind === "mastery") {
      setCanAdvance(true);
    } else {
      setCanAdvance(false);
    }
  }, [step]);

  async function handleFinish() {
    if (step.kind !== "mastery") return;
    const reward = step.xpReward;
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      try {
        const res = await awardCloud({
          xp: reward,
          worldSlug: mission.worldSlug,
          missionSlug: mission.slug,
          badgeSlug: step.badgeSlug,
          badgeName: step.badgeName,
        });
        if (res?.firstTime) {
          toast.success(`+${reward} XP earned!`, {
            description: step.badgeName ? `Badge unlocked: ${step.badgeName}` : "Mission complete.",
          });
          // Achievement notifications for quest progress
          for (const q of res.quests) {
            if (q.newly_completed) {
              toast.success(`🏆 Quest complete: ${q.title}`, {
                description: `Claim +${q.xp_reward} XP, +${q.coin_reward} coins on the Quests page.`,
                duration: 6000,
              });
            } else if (q.progress > 0) {
              toast.message(`Quest progress: ${q.title}`, {
                description: `${q.progress} / ${q.target}`,
              });
            }
          }
        } else {
          toast.message("Mission replayed", {
            description: "Already cleared — no duplicate rewards.",
          });
        }
      } catch (e) {
        console.error(e);
        toast.error("Could not save progress", { description: (e as Error).message });
      }
    } else {
      awardGuest({
        xp: reward,
        worldSlug: mission.worldSlug,
        missionSlug: mission.slug,
        badgeSlug: step.badgeSlug,
      });
      toast.success(`+${reward} XP earned!`, {
        description: step.badgeName ? `Badge unlocked: ${step.badgeName}` : "Mission complete.",
      });
    }
    setCompleted(true);

    if (!data.session) {
      // Guest CTA: prompt account creation after first mission
      setTimeout(() => {
        toast.message("Save your progress", {
          description: "Sign up to keep your XP, unlock the AI mentor, and continue across worlds.",
          action: {
            label: "Sign Up",
            onClick: () => navigate({ to: "/auth" }),
          },
          duration: 8000,
        });
      }, 800);
    }

    const next = nextMission(mission.worldSlug, mission.slug);
    setTimeout(() => {
      if (next) navigate({ to: "/play/$world/$mission", params: { world: next.worldSlug, mission: next.slug } });
      else navigate({ to: "/" });
    }, 1800);
  }

  const stepEl = useMemo(() => {
    switch (step.kind) {
      case "intro":
        return <StepIntro step={step} />;
      case "concept":
        return (
          <StepConcept
            step={step}
            onContext={(c) => setMentorCtx((prev) => ({ ...prev, ...c }))}
          />
        );
      case "practice":
        return <StepPractice step={step} onSolved={() => setCanAdvance(true)} />;
      case "code":
        return (
          <StepCode
            step={step}
            onSolved={() => setCanAdvance(true)}
            onContext={(c) => setMentorCtx((prev) => ({ ...prev, ...c, missionBrief: step.brief }))}
          />
        );
      case "boss":
        return (
          <StepBoss
            step={step}
            onSolved={() => setCanAdvance(true)}
            onContext={(c) => setMentorCtx((prev) => ({ ...prev, ...c }))}
          />
        );
      case "mastery":
        return <StepMastery step={step} onFinish={handleFinish} alreadyDone={completed} />;
    }
  }, [step, completed]);

  return (
    <div className="min-h-screen grid-bg">
      {/* Top bar */}
      <div className="border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center gap-3">
          <Link
            to="/"
            className="btn-ghost-neon !py-1.5 !px-3 text-xs"
            aria-label="Back to world map"
          >
            <ArrowLeft className="size-4" />
            Map
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
              <span>{mission.worldSlug.replace("-", " ")}</span>
              <span>·</span>
              <span className="neon-cyan">{mission.title}</span>
              {completed && (
                <span className="chip glow-ring-gold/40 !text-accent">
                  <CheckCircle2 className="size-3" /> Cleared
                </span>
              )}
            </div>
            <div className="mt-1 h-1.5 rounded-full bg-surface-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary via-secondary to-accent transition-all"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
          <div className="chip">
            <Star className="size-3 text-accent" /> {mission.xpBase} XP
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 grid lg:grid-cols-[1fr_360px] gap-6">
        <div className="min-h-[60vh]">
          <div key={index} className="animate-fade-in">
            <div className="flex items-center gap-2 mb-4">
              <StepBadge kind={step.kind} index={index} total={mission.steps.length} />
            </div>
            {stepEl}
          </div>

          {step.kind !== "mastery" && (
            <div className="mt-8 flex items-center justify-between">
              <button
                className="btn-ghost-neon"
                onClick={() => setIndex((i) => Math.max(0, i - 1))}
                disabled={index === 0}
              >
                <ArrowLeft className="size-4" /> Back
              </button>
              <button
                className="btn-hero disabled:!shadow-none"
                onClick={() => setIndex((i) => Math.min(mission.steps.length - 1, i + 1))}
                disabled={!canAdvance}
              >
                {isLast ? (
                  <>
                    Complete <Trophy className="size-4" />
                  </>
                ) : (
                  <>
                    Continue <ArrowRight className="size-4" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        <aside className="lg:sticky lg:top-20 self-start">
          <MentorPanel context={mentorCtx} />
        </aside>
      </div>
    </div>
  );
}

function StepBadge({ kind, index, total }: { kind: MissionStep["kind"]; index: number; total: number }) {
  const labels: Record<MissionStep["kind"], string> = {
    intro: "1 · Story",
    concept: "2 · Concept",
    practice: "3 · Practice",
    code: "4 · Code",
    boss: "5 · Boss",
    mastery: "6 · Mastery",
  };
  return (
    <div className="flex items-center gap-2">
      <span className="chip neon-cyan border-primary/40">{labels[kind]}</span>
      <span className="text-xs text-muted-foreground">
        Step {index + 1} of {total}
      </span>
    </div>
  );
}

export { X as _Unused };
