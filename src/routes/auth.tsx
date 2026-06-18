import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { syncGuestToCloud } from "@/lib/progress";
import { toast } from "sonner";
import { Sparkles, Mail, Lock, ArrowLeft, Loader2 } from "lucide-react";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign In — Code Quest" },
      { name: "description", content: "Create your Code Warrior account to save progress and unlock the AI mentor." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) navigate({ to: "/" });
    })();
  }, [navigate]);

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: { username: username || email.split("@")[0] },
          },
        });
        if (error) throw error;
        toast.success("Account created!");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back, Warrior");
      }
      try { await syncGuestToCloud(); } catch (e) { console.error(e); }
      navigate({ to: "/" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Auth failed");
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogle() {
    setBusy(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
      if (result.error) {
        toast.error(result.error.message ?? "Google sign-in failed");
      } else if (!result.redirected) {
        try { await syncGuestToCloud(); } catch (e) { console.error(e); }
        navigate({ to: "/" });
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center px-4 grid-bg">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="panel p-7 w-full max-w-md"
      >
        <Link to="/" className="text-xs text-muted-foreground inline-flex items-center gap-1 hover:text-primary mb-4">
          <ArrowLeft className="size-3" /> Back to map
        </Link>
        <div className="flex items-center gap-2">
          <div className="size-9 rounded-md grid place-items-center bg-gradient-to-br from-primary to-secondary">
            <Sparkles className="size-4 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display text-xl neon-cyan tracking-widest">
              {mode === "signup" ? "JOIN THE QUEST" : "WELCOME BACK"}
            </h1>
            <p className="text-xs text-muted-foreground">Save your progress · Unlock the AI mentor</p>
          </div>
        </div>

        <button
          onClick={handleGoogle}
          disabled={busy}
          className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-md bg-surface-2 border border-border px-4 py-2.5 text-sm hover:border-primary/60 hover:glow-ring-cyan transition"
        >
          <svg className="size-4" viewBox="0 0 24 24"><path fill="#fff" d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.05 1.05-2.69 2.2-5.42 2.2-4.16 0-7.42-3.37-7.42-7.51s3.26-7.51 7.42-7.51c2.27 0 3.91.91 5.13 2.05l2.32-2.32C18.42 1.85 15.92.6 12.48.6 6.06.6.86 5.84.86 12.27s5.2 11.67 11.62 11.67c3.43 0 6.02-1.13 8.02-3.21 2.06-2.06 2.7-4.95 2.7-7.28 0-.72-.05-1.39-.16-1.93H12.48z"/></svg>
          Continue with Google
        </button>

        <div className="my-4 flex items-center gap-3 text-xs text-muted-foreground">
          <div className="flex-1 h-px bg-border" /> OR <div className="flex-1 h-px bg-border" />
        </div>

        <form className="space-y-3" onSubmit={handleEmail}>
          {mode === "signup" && (
            <label className="block">
              <span className="text-xs uppercase tracking-widest text-muted-foreground">Warrior name</span>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Aria"
                className="mt-1 w-full bg-input border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/60"
              />
            </label>
          )}
          <label className="block">
            <span className="text-xs uppercase tracking-widest text-muted-foreground">Email</span>
            <div className="relative">
              <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full bg-input border border-border rounded-md pl-8 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/60"
              />
            </div>
          </label>
          <label className="block">
            <span className="text-xs uppercase tracking-widest text-muted-foreground">Password</span>
            <div className="relative">
              <Lock className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full bg-input border border-border rounded-md pl-8 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/60"
              />
            </div>
          </label>

          <button type="submit" disabled={busy} className="btn-hero w-full justify-center">
            {busy ? <Loader2 className="size-4 animate-spin" /> : mode === "signup" ? "Create account" : "Sign in"}
          </button>
        </form>

        <p className="mt-5 text-xs text-center text-muted-foreground">
          {mode === "signup" ? "Already a Warrior?" : "New to the Quest?"}{" "}
          <button
            type="button"
            onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
            className="text-primary hover:text-primary-glow"
          >
            {mode === "signup" ? "Sign in" : "Create one"}
          </button>
        </p>
      </motion.div>
    </div>
  );
}
