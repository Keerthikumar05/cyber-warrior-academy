import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PlayerHUD } from "@/components/hud/PlayerHUD";
import { Trophy, Flame, Loader2, Crown, Medal } from "lucide-react";

export const Route = createFileRoute("/leaderboard")({
  head: () => ({
    meta: [
      { title: "Leaderboard — Code Quest" },
      { name: "description", content: "Top Code Warriors ranked by weekly and all-time XP." },
    ],
  }),
  component: LeaderboardPage,
});

type Row = { user_id: string; username: string | null; avatar_url: string | null; level: number; rank: number; xp?: number; weekly_xp?: number };

function LeaderboardPage() {
  const [tab, setTab] = useState<"weekly" | "alltime">("weekly");
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    (async () => {
      const view = tab === "weekly" ? "leaderboard_weekly" : "leaderboard_alltime";
      const { data } = await supabase.from(view).select("*").limit(100);
      setRows((data as Row[]) ?? []);
      setLoading(false);
    })();
  }, [tab]);

  return (
    <div className="min-h-screen">
      <PlayerHUD />
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="flex items-center gap-3 mb-6 animate-fade-in">
          <Trophy className="size-7 text-accent" />
          <div>
            <h1 className="font-display text-3xl neon-gold tracking-widest">LEADERBOARD</h1>
            <p className="text-sm text-muted-foreground">Climb the ranks. Become legend.</p>
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setTab("weekly")}
            className={`chip ${tab === "weekly" ? "glow-ring-cyan border-primary" : ""}`}
          >
            <Flame className="size-3.5" /> THIS WEEK
          </button>
          <button
            onClick={() => setTab("alltime")}
            className={`chip ${tab === "alltime" ? "glow-ring-gold border-accent" : ""}`}
          >
            <Crown className="size-3.5" /> ALL-TIME
          </button>
        </div>

        <div className="panel divide-y divide-border">
          {loading ? (
            <div className="p-12 grid place-items-center"><Loader2 className="size-6 animate-spin text-primary" /></div>
          ) : rows.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">No warriors on the board yet. Be the first.</div>
          ) : (
            rows.map((r) => {
              const score = tab === "weekly" ? r.weekly_xp ?? 0 : r.xp ?? 0;
              const top3 = r.rank <= 3;
              const accent = r.rank === 1 ? "text-accent" : r.rank === 2 ? "text-primary" : r.rank === 3 ? "text-secondary" : "text-muted-foreground";
              return (
                <div key={r.user_id} className={`flex items-center gap-3 px-4 py-3 ${top3 ? "bg-surface-2/40" : ""}`}>
                  <div className={`w-10 text-center font-display ${accent}`}>
                    {r.rank <= 3 ? <Medal className={`size-5 mx-auto ${accent}`} /> : `#${r.rank}`}
                  </div>
                  <div className="size-9 rounded-full bg-gradient-to-br from-primary/40 to-secondary/40 grid place-items-center font-display text-sm">
                    {(r.username ?? "?")[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-display truncate">{r.username ?? "Anonymous"}</div>
                    <div className="text-xs text-muted-foreground">Level {r.level}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-display neon-gold">{score.toLocaleString()}</div>
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground">XP</div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
