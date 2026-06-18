import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PlayerHUD } from "@/components/hud/PlayerHUD";
import { allMissions } from "@/lib/missions";
import { Star, Trophy, Zap, Coins, Award, Loader2 } from "lucide-react";
import { motion } from "motion/react";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — Code Quest" },
      { name: "description", content: "Your Code Warrior profile, XP, badges, and missions." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ProfilePage,
});

interface ProfileData {
  username: string | null;
  level: number;
  xp: number;
  coins: number;
  current_streak: number;
}

function ProfilePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [badges, setBadges] = useState<{ badge_slug: string; earned_at: string }[]>([]);
  const [progress, setProgress] = useState<{ world_slug: string; mission_slug: string }[]>([]);

  useEffect(() => {
    (async () => {
      const { data: s } = await supabase.auth.getSession();
      if (!s.session) {
        navigate({ to: "/auth" });
        return;
      }
      const uid = s.session.user.id;
      const [{ data: p }, { data: b }, { data: pr }] = await Promise.all([
        supabase.from("profiles").select("username,level,xp,coins,current_streak").eq("id", uid).maybeSingle(),
        supabase.from("user_badges").select("badge_slug,earned_at").eq("user_id", uid),
        supabase.from("user_progress").select("world_slug,mission_slug").eq("user_id", uid).eq("completed", true),
      ]);
      setProfile(p as ProfileData | null);
      setBadges(b ?? []);
      setProgress(pr ?? []);
      setLoading(false);
    })();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center">
        <Loader2 className="size-6 animate-spin text-primary" />
      </div>
    );
  }

  const nextXp = (profile?.level ?? 1) * 100;
  const prevXp = ((profile?.level ?? 1) - 1) * 100;
  const pct = profile ? Math.min(100, ((profile.xp - prevXp) / (nextXp - prevXp)) * 100) : 0;

  return (
    <div className="min-h-screen">
      <PlayerHUD />
      <div className="mx-auto max-w-5xl px-4 py-8 space-y-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="panel p-6 grid sm:grid-cols-[auto_1fr_auto] gap-6 items-center">
          <div className="size-20 rounded-full grid place-items-center bg-gradient-to-br from-primary to-secondary glow-ring-cyan font-display text-3xl">
            {(profile?.username ?? "W")[0].toUpperCase()}
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Code Warrior</div>
            <h1 className="font-display text-3xl neon-cyan">{profile?.username ?? "Anonymous"}</h1>
            <div className="mt-3 h-2 w-full max-w-md bg-surface-2 rounded-full overflow-hidden border border-border">
              <div className="h-full bg-gradient-to-r from-primary to-secondary" style={{ width: `${pct}%` }} />
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              {profile?.xp ?? 0} / {nextXp} XP to level {(profile?.level ?? 1) + 1}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-center">
            <Stat Icon={Star} label="Level" value={profile?.level ?? 1} accent="cyan" />
            <Stat Icon={Zap} label="XP" value={profile?.xp ?? 0} accent="gold" />
            <Stat Icon={Coins} label="Coins" value={profile?.coins ?? 0} accent="gold" />
            <Stat Icon={Trophy} label="Badges" value={badges.length} accent="purple" />
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="panel p-5">
            <h2 className="font-display tracking-widest text-sm neon-purple flex items-center gap-2 mb-3">
              <Award className="size-4" /> BADGES
            </h2>
            {badges.length === 0 ? (
              <p className="text-sm text-muted-foreground">No badges yet — clear a boss to earn one.</p>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                {badges.map((b) => (
                  <div key={b.badge_slug} className="rounded-md border border-border bg-surface-2 p-3 text-center glow-ring-gold/30">
                    <Trophy className="size-6 text-accent mx-auto" />
                    <div className="mt-1 text-xs font-display tracking-widest neon-gold uppercase">{b.badge_slug.replace(/-/g, " ")}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="panel p-5">
            <h2 className="font-display tracking-widest text-sm neon-cyan flex items-center gap-2 mb-3">
              <Star className="size-4" /> MISSIONS CLEARED
            </h2>
            <div className="space-y-1">
              {allMissions.map((m) => {
                const done = progress.find((p) => p.world_slug === m.worldSlug && p.mission_slug === m.slug);
                return (
                  <Link
                    key={`${m.worldSlug}/${m.slug}`}
                    to="/play/$world/$mission"
                    params={{ world: m.worldSlug, mission: m.slug }}
                    className="flex items-center gap-2 text-sm py-1.5 px-2 rounded hover:bg-surface-2"
                  >
                    <span className={`size-1.5 rounded-full ${done ? "bg-accent" : "bg-muted-foreground/40"}`} />
                    <span className="text-muted-foreground text-xs">{m.worldSlug}</span>
                    <span className="flex-1">{m.title}</span>
                    {done && <span className="text-xs neon-gold">CLEARED</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ Icon, label, value, accent }: { Icon: typeof Star; label: string; value: number; accent: "cyan" | "gold" | "purple" }) {
  const colorClass = accent === "cyan" ? "text-primary" : accent === "purple" ? "text-secondary" : "text-accent";
  return (
    <div className="panel p-2 min-w-20">
      <Icon className={`size-3.5 mx-auto ${colorClass}`} />
      <div className="font-display text-lg mt-0.5">{value}</div>
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
    </div>
  );
}
