import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PlayerHUD } from "@/components/hud/PlayerHUD";
import { MessageSquare, Loader2, Plus, ArrowUp, Pin, Send } from "lucide-react";
import { worlds } from "@/lib/missions";
import { toast } from "sonner";

export const Route = createFileRoute("/forum")({
  head: () => ({
    meta: [
      { title: "Forum — Code Quest" },
      { name: "description", content: "Discuss missions, share solutions, ask mentors." },
    ],
  }),
  component: ForumPage,
});

interface Thread {
  id: string;
  title: string;
  body: string;
  upvotes: number;
  reply_count: number;
  pinned: boolean;
  world_slug: string | null;
  created_at: string;
  author_id: string;
}

function ForumPage() {
  const navigate = useNavigate();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const [worldFilter, setWorldFilter] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");
  const [newWorld, setNewWorld] = useState<string>("");
  const [uid, setUid] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: s } = await supabase.auth.getSession();
      setUid(s.session?.user.id ?? null);
    })();
  }, []);

  useEffect(() => {
    setLoading(true);
    (async () => {
      let q = supabase.from("forum_threads").select("*").order("pinned", { ascending: false }).order("upvotes", { ascending: false }).limit(50);
      if (worldFilter) q = q.eq("world_slug", worldFilter);
      const { data } = await q;
      setThreads((data as Thread[]) ?? []);
      setLoading(false);
    })();
  }, [worldFilter]);

  async function createThread() {
    if (!uid) {
      navigate({ to: "/auth" });
      return;
    }
    if (newTitle.trim().length < 5) {
      toast.error("Title too short");
      return;
    }
    const { data, error } = await supabase
      .from("forum_threads")
      .insert({ author_id: uid, title: newTitle.trim(), body: newBody.trim(), world_slug: newWorld || null })
      .select("id")
      .single();
    if (error) {
      toast.error(error.message);
      return;
    }
    setCreating(false);
    setNewTitle("");
    setNewBody("");
    navigate({ to: "/forum/$threadId", params: { threadId: data.id } });
  }

  return (
    <div className="min-h-screen">
      <PlayerHUD />
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="flex items-center justify-between gap-3 mb-6 animate-fade-in">
          <div className="flex items-center gap-3">
            <MessageSquare className="size-7 text-primary" />
            <div>
              <h1 className="font-display text-3xl neon-cyan tracking-widest">FORUM</h1>
              <p className="text-sm text-muted-foreground">Ask. Share. Help others level up.</p>
            </div>
          </div>
          <button onClick={() => setCreating(true)} className="btn-hero !py-2 !px-4 text-xs">
            <Plus className="size-4" /> NEW THREAD
          </button>
        </div>

        <div className="flex gap-2 mb-4 overflow-x-auto">
          <button onClick={() => setWorldFilter(null)} className={`chip ${!worldFilter ? "border-primary glow-ring-cyan" : ""}`}>ALL</button>
          {worlds.filter((w) => w.status === "available").map((w) => (
            <button key={w.slug} onClick={() => setWorldFilter(w.slug)} className={`chip ${worldFilter === w.slug ? "border-primary glow-ring-cyan" : ""}`}>
              {w.name}
            </button>
          ))}
        </div>

        {creating && (
          <div className="panel p-5 mb-4 space-y-3 animate-fade-in">
            <input
              autoFocus
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="What's your question?"
              className="w-full bg-surface-2 border border-border rounded-md px-3 py-2 outline-none focus:border-primary"
            />
            <textarea
              value={newBody}
              onChange={(e) => setNewBody(e.target.value)}
              placeholder="Describe in detail. Paste code, error messages..."
              rows={5}
              className="w-full bg-surface-2 border border-border rounded-md px-3 py-2 outline-none focus:border-primary text-sm"
            />
            <select
              value={newWorld}
              onChange={(e) => setNewWorld(e.target.value)}
              className="bg-surface-2 border border-border rounded-md px-3 py-2 text-sm"
            >
              <option value="">— No world tag —</option>
              {worlds.filter((w) => w.status === "available").map((w) => (
                <option key={w.slug} value={w.slug}>{w.name}</option>
              ))}
            </select>
            <div className="flex gap-2">
              <button onClick={createThread} className="btn-hero !py-2 text-xs"><Send className="size-4" /> POST</button>
              <button onClick={() => setCreating(false)} className="btn-ghost-neon !py-2 text-xs">CANCEL</button>
            </div>
          </div>
        )}

        <div className="panel divide-y divide-border">
          {loading ? (
            <div className="p-10 grid place-items-center"><Loader2 className="size-6 animate-spin text-primary" /></div>
          ) : threads.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">No threads yet. Start the first one.</div>
          ) : (
            threads.map((t) => (
              <Link
                key={t.id}
                to="/forum/$threadId"
                params={{ threadId: t.id }}
                className="flex items-start gap-4 px-4 py-3 hover:bg-surface-2 transition-colors"
              >
                <div className="flex flex-col items-center text-center w-12 shrink-0">
                  <ArrowUp className="size-4 text-muted-foreground" />
                  <span className="font-display text-sm">{t.upvotes}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {t.pinned && <Pin className="size-3.5 text-accent" />}
                    <span className="font-display truncate">{t.title}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    {t.world_slug && <span className="chip !py-0.5 !px-2 text-[10px]">{worlds.find((w) => w.slug === t.world_slug)?.name ?? t.world_slug}</span>}
                    <span>{t.reply_count} replies</span>
                    <span>{new Date(t.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
