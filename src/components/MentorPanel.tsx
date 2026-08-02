import { useEffect, useRef, useState } from "react";
import { Send, Lightbulb, Bug, Compass, Sparkles, Lock } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { Link } from "@tanstack/react-router";
import { askMentor, loadMentorHistory } from "@/lib/mentor.functions";
import { supabase } from "@/integrations/supabase/client";

type Msg = { id: string; role: "user" | "assistant"; content: string };

export interface MentorContext {
  worldSlug?: string;
  missionSlug?: string;
  missionTitle?: string;
  missionBrief?: string;
  topics?: string[];
  userCode?: string;
  lastError?: string;
}

export function MentorPanel({ context }: { context?: MentorContext }) {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const ask = useServerFn(askMentor);
  const load = useServerFn(loadMentorHistory);
  const scroll = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      setAuthed(!!data.session);
    })();
  }, []);

  useEffect(() => {
    if (!authed) return;
    (async () => {
      try {
        const hist = await load();
        setMessages(hist.map((h) => ({ id: h.id, role: h.role as "user" | "assistant", content: h.content })));
      } catch {
        /* ignore */
      }
    })();
  }, [authed, load]);

  useEffect(() => {
    scroll.current?.scrollTo({ top: scroll.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  async function send(mode: "hint" | "explain_error" | "recommend" | "chat", customMessage?: string) {
    const msg = customMessage ?? input.trim();
    if (!msg || busy) return;
    setInput("");
    const userMsg: Msg = { id: crypto.randomUUID(), role: "user", content: msg };
    setMessages((m) => [...m, userMsg]);
    setBusy(true);
    try {
      const res = await ask({ data: { message: msg, mode, context } });
      setMessages((m) => [...m, { id: crypto.randomUUID(), role: "assistant", content: res.reply }]);
    } catch (err: unknown) {
      const m = err instanceof Error ? err.message : "Mentor unreachable.";
      setMessages((mm) => [...mm, { id: crypto.randomUUID(), role: "assistant", content: `⚠️ ${m}` }]);
    } finally {
      setBusy(false);
    }
  }

  if (authed === null) {
    return <div className="panel p-4 text-sm text-muted-foreground">Loading mentor…</div>;
  }

  if (!authed) {
    return (
      <div className="panel p-5 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Lock className="size-4 text-secondary" />
          <h3 className="font-display tracking-widest text-sm neon-purple">AI MENTOR LOCKED</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Sign in to unlock Cipher — your personal AI mentor that tracks your progress, hints, and explains your code.
        </p>
        <Link to="/auth" className="btn-hero text-xs self-start">
          Unlock Mentor
        </Link>
      </div>
    );
  }

  return (
    <div className="panel flex flex-col h-full max-h-[600px]">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
        <div className="size-7 rounded-md grid place-items-center bg-gradient-to-br from-secondary to-primary">
          <Sparkles className="size-4 text-primary-foreground" />
        </div>
        <div>
          <h3 className="font-display tracking-widest text-sm neon-purple">CIPHER</h3>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">AI Mentor · Online</p>
        </div>
      </div>

      <div ref={scroll} className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[200px]">
        {messages.length === 0 && (
          <div className="text-sm text-muted-foreground">
            Ask for a hint, paste an error, or request what to learn next.
          </div>
        )}
        {messages.map((m) => (
          <div
            key={m.id}
            className={`rounded-md px-3 py-2 text-sm whitespace-pre-wrap ${
              m.role === "user"
                ? "bg-surface-2 border border-border ml-8"
                : "bg-gradient-to-br from-secondary/10 to-primary/5 border border-secondary/30 mr-8"
            }`}
          >
            {m.content}
          </div>
        ))}
        {busy && (
          <div className="text-xs text-muted-foreground animate-pulse">Cipher is thinking…</div>
        )}
      </div>

      <div className="px-3 pb-2 flex flex-wrap gap-1.5">
        <button
          className="chip hover:glow-ring-cyan transition"
          disabled={busy}
          onClick={() => send("hint", "Give me a hint on the current step.")}
        >
          <Lightbulb className="size-3" /> Hint
        </button>
        <button
          className="chip hover:glow-ring-purple transition"
          disabled={busy || !context?.lastError}
          onClick={() => send("explain_error", "Explain my last error.")}
          title={context?.lastError ? "Explain the last error" : "Run code first"}
        >
          <Bug className="size-3" /> Explain error
        </button>
        <button
          className="chip hover:glow-ring-gold transition"
          disabled={busy}
          onClick={() => send("recommend", "What should I learn next?")}
        >
          <Compass className="size-3" /> Next step
        </button>
      </div>

      <form
        className="flex items-center gap-2 p-3 border-t border-border"
        onSubmit={(e) => {
          e.preventDefault();
          send("chat");
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Cipher anything…"
          className="flex-1 bg-input border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/60"
        />
        <button type="submit" disabled={busy || !input.trim()} className="btn-hero !py-2 !px-3">
          <Send className="size-4" />
        </button>
      </form>
    </div>
  );
}
