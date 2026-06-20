import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PlayerHUD } from "@/components/hud/PlayerHUD";
import { Users, Loader2, Plus, Crown, LogOut } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/guilds")({
  head: () => ({
    meta: [
      { title: "Guilds — Code Quest" },
      { name: "description", content: "Form a guild. Climb together. Conquer the leaderboard as a team." },
    ],
  }),
  component: GuildsPage,
});

interface Guild {
  id: string;
  name: string;
  tag: string;
  description: string | null;
  member_count: number;
  total_xp: number;
  owner_id: string;
}

function GuildsPage() {
  const navigate = useNavigate();
  const [uid, setUid] = useState<string | null>(null);
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [myGuildId, setMyGuildId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [tag, setTag] = useState("");
  const [desc, setDesc] = useState("");

  const load = useCallback(async () => {
    const { data: s } = await supabase.auth.getSession();
    const id = s.session?.user.id ?? null;
    setUid(id);
    const [{ data: gs }, mine] = await Promise.all([
      supabase.from("guilds").select("*").order("total_xp", { ascending: false }).limit(50),
      id ? supabase.from("guild_members").select("guild_id").eq("user_id", id).maybeSingle() : Promise.resolve({ data: null }),
    ]);
    setGuilds((gs as Guild[]) ?? []);
    setMyGuildId((mine.data as { guild_id: string } | null)?.guild_id ?? null);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function createGuild() {
    if (!uid) return navigate({ to: "/auth" });
    if (name.length < 3 || tag.length < 2) {
      toast.error("Name 3+ chars, tag 2+ chars");
      return;
    }
    const { data, error } = await supabase
      .from("guilds")
      .insert({ name: name.trim(), tag: tag.trim().toUpperCase(), description: desc.trim() || null, owner_id: uid })
      .select("id")
      .single();
    if (error) {
      toast.error(error.message);
      return;
    }
    await supabase.from("guild_members").insert({ guild_id: data.id, user_id: uid, role: "owner" });
    toast.success("Guild created!");
    setCreating(false);
    setName(""); setTag(""); setDesc("");
    load();
  }

  async function joinGuild(guildId: string) {
    if (!uid) return navigate({ to: "/auth" });
    const { error } = await supabase.from("guild_members").insert({ guild_id: guildId, user_id: uid });
    if (error) toast.error(error.message);
    else {
      toast.success("Joined!");
      load();
    }
  }

  async function leaveGuild() {
    if (!uid || !myGuildId) return;
    await supabase.from("guild_members").delete().eq("user_id", uid);
    toast("Left the guild");
    load();
  }

  if (loading) {
    return <div className="min-h-screen grid place-items-center"><Loader2 className="size-6 animate-spin text-primary" /></div>;
  }

  return (
    <div className="min-h-screen">
      <PlayerHUD />
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="flex items-center justify-between gap-3 mb-6 animate-fade-in">
          <div className="flex items-center gap-3">
            <Users className="size-7 text-secondary" />
            <div>
              <h1 className="font-display text-3xl neon-purple tracking-widest">GUILDS</h1>
              <p className="text-sm text-muted-foreground">Team up. Pool XP. Dominate the board.</p>
            </div>
          </div>
          {!myGuildId && (
            <button onClick={() => setCreating(true)} className="btn-hero !py-2 !px-4 text-xs">
              <Plus className="size-4" /> CREATE
            </button>
          )}
          {myGuildId && (
            <button onClick={leaveGuild} className="btn-ghost-neon !py-2 !px-4 text-xs">
              <LogOut className="size-4" /> LEAVE
            </button>
          )}
        </div>

        {creating && (
          <div className="panel p-5 mb-4 space-y-3 animate-fade-in">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Guild name" className="w-full bg-surface-2 border border-border rounded-md px-3 py-2 outline-none focus:border-primary" />
            <input value={tag} onChange={(e) => setTag(e.target.value.toUpperCase().slice(0, 5))} placeholder="TAG (2-5 chars)" className="w-full bg-surface-2 border border-border rounded-md px-3 py-2 outline-none focus:border-primary uppercase font-display tracking-widest" />
            <textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Description" rows={3} className="w-full bg-surface-2 border border-border rounded-md px-3 py-2 outline-none focus:border-primary text-sm" />
            <div className="flex gap-2">
              <button onClick={createGuild} className="btn-hero !py-2 text-xs">CREATE GUILD</button>
              <button onClick={() => setCreating(false)} className="btn-ghost-neon !py-2 text-xs">CANCEL</button>
            </div>
          </div>
        )}

        <div className="panel divide-y divide-border">
          {guilds.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">No guilds yet — found the first.</div>
          ) : (
            guilds.map((g, i) => (
              <div key={g.id} className={`flex items-center gap-4 p-4 ${g.id === myGuildId ? "bg-primary/5" : ""}`}>
                <div className="font-display text-lg w-8 text-center text-muted-foreground">#{i + 1}</div>
                <div className="size-12 rounded-md grid place-items-center bg-gradient-to-br from-primary/40 to-secondary/40 font-display tracking-widest text-sm">
                  {g.tag}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-display truncate">{g.name}</span>
                    {g.owner_id === uid && <Crown className="size-3.5 text-accent" />}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">{g.description ?? "—"}</div>
                </div>
                <div className="text-right">
                  <div className="font-display neon-gold text-sm">{g.total_xp.toLocaleString()}</div>
                  <div className="text-[10px] text-muted-foreground">{g.member_count} members</div>
                </div>
                {!myGuildId && (
                  <button onClick={() => joinGuild(g.id)} className="btn-ghost-neon !py-1.5 !px-3 text-xs">JOIN</button>
                )}
                {g.id === myGuildId && <span className="chip glow-ring-cyan text-xs">YOUR GUILD</span>}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
