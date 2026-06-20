import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PlayerHUD } from "@/components/hud/PlayerHUD";
import { findOrCreateBattle, leaveBattleQueue, submitBattleSolution } from "@/lib/matchmaking.functions";
import { getBattleProblem } from "@/lib/battle-problems";
import { runPython } from "@/lib/pyodide";
import { Swords, Loader2, Trophy, X, Clock, Send } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/battle")({
  head: () => ({
    meta: [
      { title: "1v1 Code Battle — Code Quest" },
      { name: "description", content: "Real-time 1v1 coding battles. First to solve wins." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: BattlePage,
});

type Phase = "idle" | "queuing" | "active" | "finished";

interface ActiveBattle {
  id: string;
  player_a: string;
  player_b: string;
  problem_slug: string;
  winner: string | null;
  status: string;
}

function BattlePage() {
  const navigate = useNavigate();
  const findOrCreate = useServerFn(findOrCreateBattle);
  const leaveQueue = useServerFn(leaveBattleQueue);
  const submit = useServerFn(submitBattleSolution);

  const [uid, setUid] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [battle, setBattle] = useState<ActiveBattle | null>(null);
  const [code, setCode] = useState("");
  const [running, setRunning] = useState(false);
  const [output, setOutput] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [opponentSubmissions, setOpponentSubmissions] = useState(0);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  // Session
  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) navigate({ to: "/auth" });
      else setUid(data.session.user.id);
    })();
  }, [navigate]);

  // Subscribe to battle changes when active
  useEffect(() => {
    if (!battle) return;
    const ch = supabase
      .channel(`battle:${battle.id}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "battles", filter: `id=eq.${battle.id}` },
        (payload) => {
          const row = payload.new as ActiveBattle;
          setBattle(row);
          if (row.status === "finished") setPhase("finished");
        },
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "battle_submissions", filter: `battle_id=eq.${battle.id}` },
        (payload) => {
          const row = payload.new as { user_id: string };
          if (row.user_id !== uid) setOpponentSubmissions((n) => n + 1);
        },
      )
      .subscribe();
    channelRef.current = ch;
    return () => {
      supabase.removeChannel(ch);
    };
  }, [battle?.id, uid]);

  const problem = battle ? getBattleProblem(battle.problem_slug) : null;

  // Init starter code + timer
  useEffect(() => {
    if (phase === "active" && problem) {
      setCode(problem.starter);
      setTimeLeft(problem.timeLimitSec);
    }
  }, [phase, problem?.slug]);

  useEffect(() => {
    if (phase !== "active") return;
    const id = setInterval(() => setTimeLeft((t) => Math.max(0, t - 1)), 1000);
    return () => clearInterval(id);
  }, [phase]);

  const findMatch = useCallback(async () => {
    setPhase("queuing");
    try {
      const res = await findOrCreate();
      if (res.matched) {
        const { data } = await supabase.from("battles").select("*").eq("id", res.battleId).single();
        setBattle(data as ActiveBattle);
        setPhase("active");
        toast.success("Opponent found! Code fast!");
      } else {
        // Wait for someone to match us — poll battles where we're a participant
        pollForMatch();
      }
    } catch (e) {
      toast.error("Failed to enter queue");
      setPhase("idle");
    }
  }, [findOrCreate]);

  const pollForMatch = useCallback(() => {
    const ch = supabase
      .channel(`queue:${uid}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "battles" },
        async (payload) => {
          const row = payload.new as ActiveBattle;
          if (row.player_a === uid || row.player_b === uid) {
            setBattle(row);
            setPhase("active");
            toast.success("Opponent found! Code fast!");
            supabase.removeChannel(ch);
          }
        },
      )
      .subscribe();
    // Auto-cancel after 60s
    setTimeout(() => {
      if (phase === "queuing") {
        supabase.removeChannel(ch);
        leaveQueue().catch(() => {});
        setPhase("idle");
        toast("No opponents found — try again");
      }
    }, 60000);
  }, [uid, phase, leaveQueue]);

  async function cancelQueue() {
    await leaveQueue();
    setPhase("idle");
  }

  async function runAndSubmit() {
    if (!problem || !battle) return;
    setRunning(true);
    setOutput("Running...");
    try {
      const fullCode = `${code}\n\nimport json\nprint(json.dumps(bool(${problem.test})))`;
      const result = await runPython(fullCode);
      const passed = result.stdout.trim().endsWith("true");
      setOutput(passed ? "✓ All tests passed!" : `✗ Test failed\n${result.stdout}${result.stderr}`);
      const res = await submit({ data: { battleId: battle.id, code, passed } });
      if (res.won) {
        toast.success("VICTORY! +200 XP", { description: "First to solve!" });
      }
    } catch (e) {
      setOutput(String(e));
      await submit({ data: { battleId: battle.id, code, passed: false } });
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="min-h-screen">
      <PlayerHUD />
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="flex items-center gap-3 mb-6 animate-fade-in">
          <Swords className="size-7 text-secondary" />
          <div>
            <h1 className="font-display text-3xl neon-purple tracking-widest">1v1 CODE BATTLE</h1>
            <p className="text-sm text-muted-foreground">First to solve wins +200 XP. Code is your weapon.</p>
          </div>
        </div>

        {phase === "idle" && (
          <div className="panel p-10 text-center space-y-6">
            <Swords className="size-16 mx-auto text-primary animate-pulse-glow" />
            <div>
              <h2 className="font-display text-2xl neon-cyan">READY TO DUEL?</h2>
              <p className="text-sm text-muted-foreground mt-2">
                You'll be matched with another warrior. A shared problem. One winner.
              </p>
            </div>
            <button onClick={findMatch} className="btn-hero">ENTER ARENA</button>
          </div>
        )}

        {phase === "queuing" && (
          <div className="panel p-10 text-center space-y-6">
            <Loader2 className="size-12 mx-auto text-primary animate-spin" />
            <div>
              <h2 className="font-display text-xl neon-cyan">SEARCHING FOR OPPONENT...</h2>
              <p className="text-sm text-muted-foreground mt-2">Matching against warriors of similar level.</p>
            </div>
            <button onClick={cancelQueue} className="btn-ghost-neon">
              <X className="size-4" /> CANCEL
            </button>
          </div>
        )}

        {(phase === "active" || phase === "finished") && problem && battle && (
          <div className="grid md:grid-cols-[1fr_320px] gap-4">
            <div className="space-y-4">
              <div className="panel p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs uppercase tracking-widest text-muted-foreground">{problem.difficulty}</div>
                    <h2 className="font-display text-2xl neon-cyan">{problem.title}</h2>
                  </div>
                  <div className={`chip ${timeLeft < 30 ? "border-destructive text-destructive" : "glow-ring-gold"}`}>
                    <Clock className="size-3.5" />
                    <span>{Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-3">{problem.description}</p>
              </div>

              <div className="panel overflow-hidden">
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  disabled={phase === "finished"}
                  spellCheck={false}
                  className="w-full bg-surface-2 text-foreground font-mono text-sm p-4 min-h-[280px] outline-none border-0 disabled:opacity-60"
                />
                <div className="border-t border-border p-3 flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">Python · Runs in browser via Pyodide</div>
                  <button
                    onClick={runAndSubmit}
                    disabled={running || phase === "finished"}
                    className="btn-hero !py-2 !px-4 text-xs disabled:opacity-40"
                  >
                    {running ? <Loader2 className="size-4 animate-spin" /> : <><Send className="size-4" /> RUN & SUBMIT</>}
                  </button>
                </div>
              </div>

              {output && (
                <pre className="panel p-4 text-xs font-mono whitespace-pre-wrap text-muted-foreground">{output}</pre>
              )}
            </div>

            <div className="space-y-4">
              {phase === "finished" ? (
                <div className="panel p-5 text-center space-y-3 glow-ring-gold border-accent">
                  <Trophy className={`size-12 mx-auto ${battle.winner === uid ? "text-accent" : "text-muted-foreground"}`} />
                  <h3 className="font-display text-2xl neon-gold">
                    {battle.winner === uid ? "VICTORY!" : "DEFEATED"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {battle.winner === uid ? "+200 XP earned" : "Train harder, warrior."}
                  </p>
                  <button onClick={() => { setBattle(null); setPhase("idle"); setOutput(""); setOpponentSubmissions(0); }} className="btn-hero w-full !py-2 text-xs">
                    NEW BATTLE
                  </button>
                </div>
              ) : (
                <div className="panel p-5">
                  <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">OPPONENT STATUS</div>
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full bg-gradient-to-br from-destructive/60 to-secondary/60 grid place-items-center font-display">
                      ?
                    </div>
                    <div className="flex-1">
                      <div className="font-display text-sm">Warrior</div>
                      <div className="text-xs text-muted-foreground">{opponentSubmissions} submission{opponentSubmissions === 1 ? "" : "s"}</div>
                    </div>
                  </div>
                  {opponentSubmissions > 0 && (
                    <div className="mt-3 text-xs text-destructive flex items-center gap-2 animate-pulse">
                      <Swords className="size-3.5" /> Opponent is trying!
                    </div>
                  )}
                </div>
              )}

              <div className="panel p-5">
                <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">RULES</div>
                <ul className="text-xs space-y-1 text-muted-foreground">
                  <li>· First passing submission wins</li>
                  <li>· Code runs in your browser</li>
                  <li>· Timer cosmetic — no auto-forfeit</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
