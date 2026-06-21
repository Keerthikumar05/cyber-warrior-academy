import { useEffect, useState } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import { Zap, Coins, Star, LogOut, Sparkles, User as UserIcon, Trophy, Swords, Target, MessageSquare, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { readGuest, levelFromXp, type GuestProgress } from "@/lib/progress";

interface ProfileSnap {
  xp: number;
  level: number;
  coins: number;
  username: string | null;
}

export function PlayerHUD() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<ProfileSnap | null>(null);
  const [guest, setGuest] = useState<GuestProgress>(() => readGuest());
  const [questsDoneToday, setQuestsDoneToday] = useState(0);

  useEffect(() => {
    let unsub = () => {};
    (async () => {
      const { data } = await supabase.auth.getSession();
      setUserId(data.session?.user.id ?? null);
      const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
        setUserId(s?.user.id ?? null);
      });
      unsub = () => sub.subscription.unsubscribe();
    })();
    const onProg = () => setGuest(readGuest());
    window.addEventListener("codequest:progress", onProg);
    return () => {
      unsub();
      window.removeEventListener("codequest:progress", onProg);
    };
  }, []);

  useEffect(() => {
    if (!userId) {
      setProfile(null);
      setQuestsDoneToday(0);
      return;
    }
    const today = new Date().toISOString().slice(0, 10);
    (async () => {
      const [{ data: p }, { data: qp }] = await Promise.all([
        supabase.from("profiles").select("xp,level,coins,username").eq("id", userId).maybeSingle(),
        supabase.from("user_quest_progress").select("completed").eq("user_id", userId).eq("quest_date", today),
      ]);
      if (p) setProfile({ xp: p.xp, level: p.level, coins: p.coins, username: p.username });
      setQuestsDoneToday((qp ?? []).filter((r) => r.completed).length);
    })();
    const channel = supabase
      .channel(`hud:${userId}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "profiles", filter: `id=eq.${userId}` },
        (payload) => {
          const row = payload.new as { xp: number; level: number; coins: number; username: string | null };
          setProfile({ xp: row.xp, level: row.level, coins: row.coins, username: row.username });
        },
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "user_quest_progress", filter: `user_id=eq.${userId}` },
        async () => {
          const today2 = new Date().toISOString().slice(0, 10);
          const { data: qp } = await supabase
            .from("user_quest_progress")
            .select("completed")
            .eq("user_id", userId)
            .eq("quest_date", today2);
          setQuestsDoneToday((qp ?? []).filter((r) => r.completed).length);
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);


  const xp = profile?.xp ?? guest.xp;
  const level = profile?.level ?? levelFromXp(guest.xp);
  const coins = profile?.coins ?? guest.coins;
  const nextLevelXp = level * 100;
  const prevLevelXp = (level - 1) * 100;
  const pct = Math.min(100, Math.max(0, ((xp - prevLevelXp) / (nextLevelXp - prevLevelXp)) * 100));

  async function signOut() {
    await supabase.auth.signOut();
    router.invalidate();
  }

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-background/70 border-b border-border">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="size-8 rounded-md grid place-items-center bg-gradient-to-br from-primary to-secondary glow-ring-cyan">
            <Sparkles className="size-4 text-primary-foreground" />
          </div>
          <span className="font-display text-lg tracking-widest neon-cyan group-hover:text-primary-glow">
            CODE QUEST
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 text-xs">
          <Link to="/quests" className="px-2 py-1 rounded hover:bg-surface-2 text-muted-foreground hover:text-primary flex items-center gap-1" title="Daily Quests">
            <Target className="size-3.5" /> QUESTS
          </Link>
          <Link to="/battle" className="px-2 py-1 rounded hover:bg-surface-2 text-muted-foreground hover:text-secondary flex items-center gap-1" title="1v1 Battle">
            <Swords className="size-3.5" /> BATTLE
          </Link>
          <Link to="/leaderboard" className="px-2 py-1 rounded hover:bg-surface-2 text-muted-foreground hover:text-accent flex items-center gap-1" title="Leaderboard">
            <Trophy className="size-3.5" /> RANKS
          </Link>
          <Link to="/guilds" className="px-2 py-1 rounded hover:bg-surface-2 text-muted-foreground hover:text-secondary flex items-center gap-1" title="Guilds">
            <Users className="size-3.5" /> GUILDS
          </Link>
          <Link to="/forum" className="px-2 py-1 rounded hover:bg-surface-2 text-muted-foreground hover:text-primary flex items-center gap-1" title="Forum">
            <MessageSquare className="size-3.5" /> FORUM
          </Link>
        </nav>

        <div className="flex-1" />


        <div className="hidden sm:flex items-center gap-3">
          <div className="chip glow-ring-cyan/30" title={`Level ${level}`}>
            <Star className="size-3.5 text-primary" />
            <span className="neon-cyan">LV {level}</span>
          </div>
          <div className="w-28 h-2 rounded-full bg-surface-2 overflow-hidden border border-border">
            <div
              className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="chip" title={`${xp} XP`}>
            <Zap className="size-3.5 text-accent" />
            <span className="neon-gold">{xp} XP</span>
          </div>
          <div className="chip" title={`${coins} coins`}>
            <Coins className="size-3.5 text-accent" />
            <span className="neon-gold">{coins}</span>
          </div>
        </div>

        {userId ? (
          <>
            <Link to="/profile" className="btn-ghost-neon !py-2 !px-3">
              <UserIcon className="size-4" />
              <span className="hidden sm:inline">{profile?.username ?? "Profile"}</span>
            </Link>
            <button onClick={signOut} className="btn-ghost-neon !py-2 !px-3" title="Sign out">
              <LogOut className="size-4" />
            </button>
          </>
        ) : (
          <Link to="/auth" className="btn-hero !py-2 !px-4 text-xs">
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
}
