import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PlayerHUD } from "@/components/hud/PlayerHUD";
import { ArrowUp, Loader2, ArrowLeft, Send, Pin, Shield } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/forum/$threadId")({
  head: () => ({
    meta: [
      { title: "Thread — Code Quest Forum" },
      { name: "description", content: "Discussion thread on Code Quest." },
    ],
  }),
  component: ThreadPage,
});

interface Thread {
  id: string;
  title: string;
  body: string;
  upvotes: number;
  pinned: boolean;
  author_id: string;
  created_at: string;
  world_slug: string | null;
}
interface Reply {
  id: string;
  body: string;
  upvotes: number;
  author_id: string;
  is_mentor_answer: boolean;
  created_at: string;
}

function ThreadPage() {
  const { threadId } = Route.useParams();
  const navigate = useNavigate();
  const [thread, setThread] = useState<Thread | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [loading, setLoading] = useState(true);
  const [uid, setUid] = useState<string | null>(null);
  const [body, setBody] = useState("");
  const [votedThread, setVotedThread] = useState(false);
  const [votedReplies, setVotedReplies] = useState<Set<string>>(new Set());

  const load = useCallback(async () => {
    const { data: s } = await supabase.auth.getSession();
    setUid(s.session?.user.id ?? null);
    const [{ data: t }, { data: r }, { data: votes }] = await Promise.all([
      supabase.from("forum_threads").select("*").eq("id", threadId).maybeSingle(),
      supabase.from("forum_replies").select("*").eq("thread_id", threadId).order("is_mentor_answer", { ascending: false }).order("upvotes", { ascending: false }),
      s.session
        ? supabase.from("forum_votes").select("thread_id,reply_id").eq("user_id", s.session.user.id)
        : Promise.resolve({ data: [] as { thread_id: string | null; reply_id: string | null }[] }),
    ]);
    setThread(t as Thread | null);
    setReplies((r as Reply[]) ?? []);
    const v = votes ?? [];
    setVotedThread(v.some((x) => x.thread_id === threadId));
    setVotedReplies(new Set(v.filter((x) => x.reply_id).map((x) => x.reply_id as string)));
    setLoading(false);
  }, [threadId]);

  useEffect(() => {
    load();
  }, [load]);

  // Realtime new replies
  useEffect(() => {
    const ch = supabase
      .channel(`thread:${threadId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "forum_replies", filter: `thread_id=eq.${threadId}` },
        (payload) => setReplies((r) => [...r, payload.new as Reply]),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [threadId]);

  async function voteThread() {
    if (!uid) return navigate({ to: "/auth" });
    if (votedThread) {
      await supabase.from("forum_votes").delete().eq("user_id", uid).eq("thread_id", threadId);
      setVotedThread(false);
      setThread((t) => t ? { ...t, upvotes: Math.max(0, t.upvotes - 1) } : t);
    } else {
      await supabase.from("forum_votes").insert({ user_id: uid, thread_id: threadId });
      setVotedThread(true);
      setThread((t) => t ? { ...t, upvotes: t.upvotes + 1 } : t);
    }
  }

  async function voteReply(replyId: string) {
    if (!uid) return navigate({ to: "/auth" });
    const has = votedReplies.has(replyId);
    if (has) {
      await supabase.from("forum_votes").delete().eq("user_id", uid).eq("reply_id", replyId);
      const next = new Set(votedReplies); next.delete(replyId); setVotedReplies(next);
      setReplies((rs) => rs.map((r) => r.id === replyId ? { ...r, upvotes: Math.max(0, r.upvotes - 1) } : r));
    } else {
      await supabase.from("forum_votes").insert({ user_id: uid, reply_id: replyId });
      const next = new Set(votedReplies); next.add(replyId); setVotedReplies(next);
      setReplies((rs) => rs.map((r) => r.id === replyId ? { ...r, upvotes: r.upvotes + 1 } : r));
    }
  }

  async function postReply() {
    if (!uid) return navigate({ to: "/auth" });
    if (body.trim().length < 3) return;
    const { error } = await supabase.from("forum_replies").insert({ thread_id: threadId, author_id: uid, body: body.trim() });
    if (error) toast.error(error.message);
    else {
      setBody("");
      toast.success("Reply posted");
    }
  }

  if (loading) {
    return <div className="min-h-screen grid place-items-center"><Loader2 className="size-6 animate-spin text-primary" /></div>;
  }
  if (!thread) {
    return <div className="min-h-screen grid place-items-center text-muted-foreground">Thread not found.</div>;
  }

  return (
    <div className="min-h-screen">
      <PlayerHUD />
      <div className="mx-auto max-w-3xl px-4 py-8 space-y-4">
        <Link to="/forum" className="btn-ghost-neon !py-1 !px-2 text-xs w-fit"><ArrowLeft className="size-3.5" /> Back</Link>

        <article className="panel p-5">
          <div className="flex items-start gap-4">
            <button
              onClick={voteThread}
              className={`flex flex-col items-center w-12 py-2 rounded ${votedThread ? "bg-primary/20 text-primary" : "text-muted-foreground hover:bg-surface-2"}`}
            >
              <ArrowUp className="size-5" />
              <span className="font-display text-sm">{thread.upvotes}</span>
            </button>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                {thread.pinned && <Pin className="size-3.5 text-accent" />}
                <h1 className="font-display text-2xl neon-cyan">{thread.title}</h1>
              </div>
              <div className="text-xs text-muted-foreground mb-3">{new Date(thread.created_at).toLocaleString()}</div>
              <p className="text-sm whitespace-pre-wrap">{thread.body}</p>
            </div>
          </div>
        </article>

        <div className="space-y-3">
          <h2 className="font-display text-sm tracking-widest neon-purple px-1">{replies.length} REPLIES</h2>
          {replies.map((r) => (
            <div key={r.id} className={`panel p-4 ${r.is_mentor_answer ? "glow-ring-gold border-accent" : ""}`}>
              <div className="flex items-start gap-4">
                <button
                  onClick={() => voteReply(r.id)}
                  className={`flex flex-col items-center w-10 py-1 rounded ${votedReplies.has(r.id) ? "bg-primary/20 text-primary" : "text-muted-foreground hover:bg-surface-2"}`}
                >
                  <ArrowUp className="size-4" />
                  <span className="font-display text-xs">{r.upvotes}</span>
                </button>
                <div className="flex-1">
                  {r.is_mentor_answer && (
                    <div className="text-xs neon-gold flex items-center gap-1 mb-1"><Shield className="size-3" /> MENTOR ANSWER</div>
                  )}
                  <p className="text-sm whitespace-pre-wrap">{r.body}</p>
                  <div className="text-[10px] text-muted-foreground mt-2">{new Date(r.created_at).toLocaleString()}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="panel p-4 space-y-3 sticky bottom-4">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={3}
            placeholder={uid ? "Write a reply..." : "Sign in to reply"}
            disabled={!uid}
            className="w-full bg-surface-2 border border-border rounded-md px-3 py-2 outline-none focus:border-primary text-sm disabled:opacity-50"
          />
          <button onClick={postReply} disabled={!uid || body.trim().length < 3} className="btn-hero !py-2 text-xs disabled:opacity-40">
            <Send className="size-4" /> POST REPLY
          </button>
        </div>
      </div>
    </div>
  );
}
