import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { Lock, Sparkles, Zap, Trophy, Bot, Compass, ArrowRight, CheckCircle2 } from "lucide-react";
import { PlayerHUD } from "@/components/hud/PlayerHUD";
import { worlds, getMissionsForWorld } from "@/lib/missions";
import { readGuest, type GuestProgress } from "@/lib/progress";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Code Quest — Learn to code by saving the universe" },
      { name: "description", content: "An AI-mentored coding game. Play guest missions, level up, and master Python from zero." },
      { property: "og:title", content: "Code Quest — World Map" },
      { property: "og:description", content: "Pick a world. Defeat bugs. Become a Code Warrior." },
    ],
  }),
  component: WorldMap,
});

const accentClass = {
  cyan: "from-primary/30 to-primary/5 border-primary/40 hover:glow-ring-cyan",
  purple: "from-secondary/30 to-secondary/5 border-secondary/40 hover:glow-ring-purple",
  gold: "from-accent/30 to-accent/5 border-accent/40 hover:glow-ring-gold",
  red: "from-destructive/30 to-destructive/5 border-destructive/40",
  green: "from-success/30 to-success/5 border-success/40",
} as const;

function WorldMap() {
  const [guest, setGuest] = useState<GuestProgress>(() => readGuest());
  const [cloudCompleted, setCloudCompleted] = useState<Set<string>>(new Set());
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    const onProg = () => setGuest(readGuest());
    window.addEventListener("codequest:progress", onProg);
    return () => window.removeEventListener("codequest:progress", onProg);
  }, []);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      setAuthed(!!data.session);
      if (data.session) {
        const { data: rows } = await supabase
          .from("user_progress")
          .select("world_slug,mission_slug,completed")
          .eq("user_id", data.session.user.id);
        setCloudCompleted(new Set((rows ?? []).filter((r) => r.completed).map((r) => `${r.world_slug}/${r.mission_slug}`)));
      }
    })();
  }, []);

  const completedSet = authed ? cloudCompleted : new Set(Object.keys(guest.completed));

  return (
    <div className="min-h-screen">
      <PlayerHUD />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-50" />
        <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:py-28 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="chip glow-ring-purple/40 neon-purple"><Sparkles className="size-3" /> The universe is under attack</span>
            <h1 className="mt-5 font-display text-4xl sm:text-6xl tracking-wide">
              <span className="neon-cyan">BECOME A</span>{" "}
              <span className="neon-purple">CODE WARRIOR</span>
            </h1>
            <p className="mt-5 max-w-2xl mx-auto text-foreground/80">
              Bugs have corrupted the system. Choose a world, solve missions, and learn real programming —
              guided by Cipher, your personal AI mentor.
            </p>
            <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
              <Link
                to="/play/$world/$mission"
                params={{ world: "logic-land", mission: "awakening-sequence" }}
                className="btn-hero"
              >
                Begin Mission 1 <ArrowRight className="size-4" />
              </Link>
              {!authed && (
                <Link to="/auth" className="btn-ghost-neon">
                  Sign in to save progress
                </Link>
              )}
            </div>
            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <CheckCircle2 className="size-3.5 text-primary" />
              No account needed for the first mission
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pillars */}
      <section className="mx-auto max-w-7xl px-4 -mt-8 pb-4">
        <div className="grid sm:grid-cols-3 gap-3">
          <Pillar Icon={Zap} title="Play, don't watch" body="Every concept is a puzzle, simulation, or boss fight." accent="cyan" />
          <Pillar Icon={Bot} title="Personal AI mentor" body="Cipher tracks your progress, hints, explains errors." accent="purple" />
          <Pillar Icon={Trophy} title="Earn XP & badges" body="Level up across 8 worlds — from logic to job-ready." accent="gold" />
        </div>
      </section>

      {/* Worlds */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="flex items-center gap-3 mb-6">
          <Compass className="size-5 text-primary" />
          <h2 className="font-display tracking-widest text-xl neon-cyan">WORLD MAP</h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {worlds.map((w, idx) => {
            const missions = getMissionsForWorld(w.slug);
            const cleared = missions.filter((m) => completedSet.has(`${w.slug}/${m.slug}`)).length;
            const total = missions.length;
            const isAvailable = w.status === "available";
            return (
              <motion.div
                key={w.slug}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`relative overflow-hidden rounded-xl border bg-gradient-to-br ${accentClass[w.accent]} p-5 transition ${
                  !isAvailable ? "opacity-60" : "hover-scale"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground">World {w.order}</div>
                    <h3 className="font-display text-xl mt-0.5">{w.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{w.tagline}</p>
                  </div>
                  {!isAvailable && <Lock className="size-4 text-muted-foreground" />}
                </div>
                <p className="mt-3 text-sm text-foreground/80">{w.description}</p>
                {isAvailable && total > 0 ? (
                  <>
                    <div className="mt-4 h-1.5 rounded-full bg-surface-2 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-secondary"
                        style={{ width: `${(cleared / total) * 100}%` }}
                      />
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{cleared}/{total} missions</span>
                      <Link
                        to="/play/$world/$mission"
                        params={{ world: w.slug, mission: missions[Math.min(cleared, total - 1)].slug }}
                        className="text-primary hover:text-primary-glow inline-flex items-center gap-1"
                      >
                        {cleared === 0 ? "Start" : cleared === total ? "Replay" : "Continue"} <ArrowRight className="size-3" />
                      </Link>
                    </div>
                    <div className="mt-3 space-y-1">
                      {missions.map((m, i) => {
                        const done = completedSet.has(`${w.slug}/${m.slug}`);
                        return (
                          <Link
                            key={m.slug}
                            to="/play/$world/$mission"
                            params={{ world: w.slug, mission: m.slug }}
                            className="flex items-center gap-2 text-xs rounded px-2 py-1 hover:bg-surface-2"
                          >
                            <span className={`size-1.5 rounded-full ${done ? "bg-accent" : "bg-muted-foreground/40"}`} />
                            <span className="font-mono text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                            <span className={done ? "neon-gold" : "text-foreground/80"}>{m.title}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <div className="mt-4 text-xs uppercase tracking-widest text-muted-foreground">Coming next</div>
                )}
              </motion.div>
            );
          })}
        </div>
      </section>

      <footer className="border-t border-border mt-8">
        <div className="mx-auto max-w-7xl px-4 py-6 text-xs text-muted-foreground flex items-center justify-between">
          <span>© Code Quest · Learn by playing</span>
          <span className="font-display tracking-widest neon-cyan">v1.0 · MVP</span>
        </div>
      </footer>
    </div>
  );
}

function Pillar({
  Icon,
  title,
  body,
  accent,
}: {
  Icon: typeof Zap;
  title: string;
  body: string;
  accent: "cyan" | "purple" | "gold";
}) {
  const colorClass = accent === "cyan" ? "text-primary" : accent === "purple" ? "text-secondary" : "text-accent";
  return (
    <div className="panel p-4 flex items-start gap-3">
      <div className="size-9 rounded-md bg-surface-2 grid place-items-center border border-border">
        <Icon className={`size-4 ${colorClass}`} />
      </div>
      <div>
        <div className={`font-display text-sm tracking-widest ${colorClass}`}>{title.toUpperCase()}</div>
        <p className="text-xs text-muted-foreground mt-0.5">{body}</p>
      </div>
    </div>
  );
}
