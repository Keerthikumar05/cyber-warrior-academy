import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Lock, Compass, ArrowRight, Loader2 } from "lucide-react";
import { PlayerHUD } from "@/components/hud/PlayerHUD";
import { worlds, getMissionsForWorld } from "@/lib/missions";
import { readGuest, type GuestProgress } from "@/lib/progress";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Code Quest — World Map" },
      { name: "description", content: "Pick a world, defeat bugs, and level up across 8 missions with Cipher, your AI mentor." },
      { property: "og:title", content: "Code Quest — World Map" },
      { property: "og:description", content: "Pick a world. Defeat bugs. Become a Code Warrior." },
    ],
  }),
  component: HomeGate,
});

// Home is the authenticated dashboard. Signed-out visitors are sent to /auth;
// signed-in Warriors land directly on the world map.
function HomeGate() {
  const navigate = useNavigate();
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!active) return;
      if (data.session) {
        setAuthed(true);
      } else {
        navigate({ to: "/auth", replace: true });
      }
    })();
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        setAuthed(false);
        navigate({ to: "/auth", replace: true });
      } else if (event === "SIGNED_IN") {
        setAuthed(true);
      }
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [navigate]);

  if (!authed) return <BootSplash />;
  return <WorldMap />;
}

function BootSplash() {
  return (
    <div className="min-h-screen grid place-items-center grid-bg">
      <div className="text-center">
        <div className="mx-auto size-12 rounded-md grid place-items-center bg-gradient-to-br from-primary to-secondary glow-ring-cyan">
          <Compass className="size-6 text-primary-foreground" />
        </div>
        <div className="mt-4 font-display text-lg tracking-widest neon-cyan">CODE QUEST</div>
        <Loader2 className="mx-auto mt-4 size-5 animate-spin text-primary" />
      </div>
    </div>
  );
}

const accentClass = {
  cyan: "from-primary/30 to-primary/5 border-primary/40 hover:glow-ring-cyan",
  purple: "from-secondary/30 to-secondary/5 border-secondary/40 hover:glow-ring-purple",
  gold: "from-accent/30 to-accent/5 border-accent/40 hover:glow-ring-gold",
  red: "from-destructive/30 to-destructive/5 border-destructive/40",
  green: "from-success/30 to-success/5 border-success/40",
} as const;

function WorldMap() {
  const [, setGuest] = useState<GuestProgress>(() => readGuest());
  const [cloudCompleted, setCloudCompleted] = useState<Set<string>>(new Set());
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const onProg = () => setGuest(readGuest());
    window.addEventListener("codequest:progress", onProg);
    return () => window.removeEventListener("codequest:progress", onProg);
  }, []);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setUserId(data.session.user.id);
        const { data: rows } = await supabase
          .from("user_progress")
          .select("world_slug,mission_slug,completed")
          .eq("user_id", data.session.user.id);
        setCloudCompleted(new Set((rows ?? []).filter((r) => r.completed).map((r) => `${r.world_slug}/${r.mission_slug}`)));
      }
    })();
  }, []);

  const completedSet = cloudCompleted;

  return (
    <div className="min-h-screen">
      <PlayerHUD />

      {/* Dashboard: World Map */}
      <section className="mx-auto max-w-7xl px-4 pt-10 pb-12">
        <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
          <div className="flex items-center gap-3">
            <Compass className="size-5 text-primary" />
            <h2 className="font-display tracking-widest text-xl neon-cyan">WORLD MAP</h2>
          </div>
          {userId && (
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Progress saved to your account
            </span>
          )}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {worlds.map((w) => {
            const missions = getMissionsForWorld(w.slug);
            const cleared = missions.filter((m) => completedSet.has(`${w.slug}/${m.slug}`)).length;
            const total = missions.length;
            const isAvailable = w.status === "available";
            return (
              <div
                key={w.slug}
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
                      <span
                        className="text-primary hover:text-primary-glow inline-flex items-center gap-1 cursor-pointer"
                        onClick={() => {
                          window.location.assign(
                            `/play/${w.slug}/${missions[Math.min(cleared, total - 1)].slug}`,
                          );
                        }}
                      >
                        {cleared === 0 ? "Start" : cleared === total ? "Replay" : "Continue"} <ArrowRight className="size-3" />
                      </span>
                    </div>
                    <div className="mt-3 space-y-1">
                      {missions.map((m, i) => {
                        const done = completedSet.has(`${w.slug}/${m.slug}`);
                        return (
                          <div
                            key={m.slug}
                            onClick={() => {
                              window.location.assign(`/play/${w.slug}/${m.slug}`);
                            }}
                            className="flex items-center gap-2 text-xs rounded px-2 py-1 hover:bg-surface-2 cursor-pointer"
                          >
                            <span className={`size-1.5 rounded-full ${done ? "bg-accent" : "bg-muted-foreground/40"}`} />
                            <span className="font-mono text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                            <span className={done ? "neon-gold" : "text-foreground/80"}>{m.title}</span>
                          </div>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <div className="mt-4 text-xs uppercase tracking-widest text-muted-foreground">Coming next</div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
