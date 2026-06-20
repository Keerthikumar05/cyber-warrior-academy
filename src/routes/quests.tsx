import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PlayerHUD } from "@/components/hud/PlayerHUD";
import { Target, Loader2, Check, Coins, Zap, Shield, Sparkles } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/quests")({
  head: () => ({
    meta: [
      { title: "Daily Quests — Code Quest" },
      { name: "description", content: "Complete daily quests to earn XP, coins, and streak shields." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: QuestsPage,
});

interface Quest {
  id: string;
  slug: string;
  title: string;
  description: string;
  quest_type: string;
  target: number;
  xp_reward: number;
  coin_reward: number;
}

interface Progress {
  quest_id: string;
  progress: number;
  completed: boolean;
  claimed: boolean;
}

function QuestsPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [progress, setProgress] = useState<Record<string, Progress>>({});
  const [uid, setUid] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data: s } = await supabase.auth.getSession();
    if (!s.session) {
      navigate({ to: "/auth" });
      return;
    }
    setUid(s.session.user.id);
    const today = new Date().toISOString().slice(0, 10);
    const [{ data: qs }, { data: pr }] = await Promise.all([
      supabase.from("daily_quests").select("*").eq("active", true),
      supabase.from("user_quest_progress").select("*").eq("user_id", s.session.user.id).eq("quest_date", today),
    ]);
    setQuests((qs as Quest[]) ?? []);
    const map: Record<string, Progress> = {};
    (pr ?? []).forEach((p) => (map[p.quest_id] = p as Progress));
    setProgress(map);
    setLoading(false);
  }, [navigate]);

  useEffect(() => {
    load();
  }, [load]);

  async function claim(q: Quest) {
    if (!uid) return;
    const p = progress[q.id];
    if (!p?.completed || p.claimed) return;
    const today = new Date().toISOString().slice(0, 10);
    await supabase
      .from("user_quest_progress")
      .update({ claimed: true })
      .eq("user_id", uid)
      .eq("quest_id", q.id)
      .eq("quest_date", today);
    await supabase.rpc("award_xp", { _amount: q.xp_reward, _source: "daily_quest", _mission: q.slug });
    toast.success(`+${q.xp_reward} XP, +${q.coin_reward} coins!`, { description: q.title });
    load();
  }

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center">
        <Loader2 className="size-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <PlayerHUD />
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="flex items-center gap-3 mb-6 animate-fade-in">
          <Target className="size-7 text-secondary" />
          <div>
            <h1 className="font-display text-3xl neon-purple tracking-widest">DAILY QUESTS</h1>
            <p className="text-sm text-muted-foreground">Reset in 24h · Streak shields protect missed days</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {quests.map((q) => {
            const p = progress[q.id];
            const cur = p?.progress ?? 0;
            const pct = Math.min(100, (cur / q.target) * 100);
            const done = p?.completed;
            const claimed = p?.claimed;
            return (
              <div key={q.id} className={`panel p-5 ${done && !claimed ? "glow-ring-gold border-accent" : ""}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-display text-lg neon-cyan">{q.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{q.description}</p>
                  </div>
                  {claimed && <Check className="size-5 text-accent shrink-0" />}
                </div>
                <div className="mt-4 h-2 rounded-full bg-surface-2 overflow-hidden border border-border">
                  <div className="h-full bg-gradient-to-r from-primary to-secondary transition-all" style={{ width: `${pct}%` }} />
                </div>
                <div className="mt-2 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{cur} / {q.target}</span>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 neon-gold"><Zap className="size-3.5" />{q.xp_reward}</span>
                    <span className="flex items-center gap-1 neon-gold"><Coins className="size-3.5" />{q.coin_reward}</span>
                  </div>
                </div>
                <button
                  onClick={() => claim(q)}
                  disabled={!done || claimed}
                  className="btn-hero w-full mt-4 disabled:opacity-40 disabled:cursor-not-allowed !py-2 text-sm"
                >
                  {claimed ? "CLAIMED" : done ? "CLAIM REWARD" : "IN PROGRESS"}
                </button>
              </div>
            );
          })}
        </div>

        <div className="panel p-5 mt-6 flex items-center gap-4 animate-fade-in">
          <Shield className="size-6 text-primary" />
          <div className="flex-1">
            <div className="font-display text-sm neon-cyan tracking-widest">STREAK SHIELDS</div>
            <p className="text-xs text-muted-foreground mt-0.5">Coming soon — spend coins to protect your streak.</p>
          </div>
          <Sparkles className="size-5 text-accent" />
        </div>
      </div>
    </div>
  );
}
