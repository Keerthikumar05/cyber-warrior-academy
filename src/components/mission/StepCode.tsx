import { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import type { CodeStep, CodeTest } from "@/lib/missions/types";
import { Play, RotateCcw, Loader2, Check, X, FileCode } from "lucide-react";
import { loadPyodideOnce, runPython, evalPythonExpr } from "@/lib/pyodide";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  step: { kind: "code" | "boss"; title: string; brief: string; language: "python"; starter: string; tests: CodeTest[]; hintTopic: string };
  onSolved: () => void;
  onContext?: (ctx: { userCode?: string; lastError?: string }) => void;
}

interface TestResult {
  label: string;
  passed: boolean;
  detail?: string;
}

export function CodeRunner({ step, onSolved, onContext }: Props) {
  const [code, setCode] = useState(step.starter);
  const [running, setRunning] = useState(false);
  const [output, setOutput] = useState<string>("");
  const [errors, setErrors] = useState<string>("");
  const [results, setResults] = useState<TestResult[] | null>(null);
  const [pyReady, setPyReady] = useState(false);
  const [pyError, setPyError] = useState<string | null>(null);
  const startedAt = useRef(Date.now());

  useEffect(() => {
    setCode(step.starter);
    setOutput("");
    setErrors("");
    setResults(null);
    onContext?.({ userCode: step.starter, lastError: undefined });
    startedAt.current = Date.now();
  }, [step]);

  useEffect(() => {
    loadPyodideOnce()
      .then(() => setPyReady(true))
      .catch((e) => setPyError(e instanceof Error ? e.message : String(e)));
  }, []);

  async function persistSubmission(passed: boolean, stdout: string) {
    const { data } = await supabase.auth.getSession();
    if (!data.session) return;
    await supabase.from("code_submissions").insert({
      user_id: data.session.user.id,
      mission_slug: step.title,
      language: "python",
      code,
      passed,
      output: stdout.slice(0, 4000),
    });
  }

  async function run() {
    if (!pyReady) return;
    setRunning(true);
    setResults(null);
    setOutput("");
    setErrors("");
    try {
      const tests: TestResult[] = [];
      for (const t of step.tests) {
        const res = await runPython(code);
        let passed = res.ok;
        let detail: string | undefined = undefined;
        if (!res.ok) {
          detail = res.error;
        } else {
          if (t.expectExact !== undefined) {
            if (res.stdout.trim() !== t.expectExact.trim()) {
              passed = false;
              detail = `Expected:\n${t.expectExact}\nGot:\n${res.stdout || "(no output)"}`;
            }
          }
          if (t.expectIncludes) {
            for (const needle of t.expectIncludes) {
              if (!res.stdout.toLowerCase().includes(needle.toLowerCase())) {
                passed = false;
                detail = `Output should contain "${needle}". Got:\n${res.stdout || "(no output)"}`;
                break;
              }
            }
          }
          if (passed && t.expectEval) {
            try {
              const v = await evalPythonExpr(t.expectEval.expr);
              const got = JSON.stringify(v);
              const want = JSON.stringify(t.expectEval.equals);
              if (got !== want) {
                passed = false;
                detail = `Expected ${t.expectEval.expr} to equal ${want}, got ${got}.`;
              }
            } catch (e) {
              passed = false;
              detail = e instanceof Error ? e.message : String(e);
            }
          }
        }
        tests.push({ label: t.label, passed, detail });
        setOutput(res.stdout);
        setErrors(res.error ? `${res.error}\n${res.stderr}` : res.stderr);
        if (!passed) break;
      }
      setResults(tests);
      const allPassed = tests.every((t) => t.passed);
      const lastErr = tests.find((t) => !t.passed)?.detail ?? errors;
      onContext?.({ userCode: code, lastError: allPassed ? undefined : lastErr });
      if (allPassed) {
        onSolved();
      }
      persistSubmission(allPassed, output).catch(() => {});
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="grid lg:grid-cols-2 gap-4">
      <div className="panel overflow-hidden flex flex-col">
        <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-surface-2">
          <FileCode className="size-4 text-primary" />
          <span className="font-display tracking-widest text-xs neon-cyan">solution.py</span>
          <div className="flex-1" />
          <button
            className="btn-ghost-neon !py-1 !px-2 text-xs"
            onClick={() => setCode(step.starter)}
            title="Reset starter"
          >
            <RotateCcw className="size-3" />
          </button>
          <button
            className="btn-hero !py-1.5 !px-3 text-xs"
            onClick={run}
            disabled={running || !pyReady}
          >
            {running ? <Loader2 className="size-3.5 animate-spin" /> : <Play className="size-3.5" />}
            Run
          </button>
        </div>
        <div className="h-[320px]">
          <Editor
            language="python"
            value={code}
            onChange={(v) => {
              const next = v ?? "";
              setCode(next);
              onContext?.({ userCode: next });
            }}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              fontFamily: "JetBrains Mono, ui-monospace, monospace",
              scrollBeyondLastLine: false,
              tabSize: 4,
              automaticLayout: true,
            }}
          />
        </div>
        {!pyReady && !pyError && (
          <div className="px-3 py-2 text-xs text-muted-foreground border-t border-border flex items-center gap-2">
            <Loader2 className="size-3 animate-spin" /> Loading Python runtime…
          </div>
        )}
        {pyError && (
          <div className="px-3 py-2 text-xs text-destructive border-t border-border">
            Python runtime failed: {pyError}
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div className="panel p-4">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Brief</div>
          <pre className="mt-1 text-sm whitespace-pre-wrap font-sans">{step.brief}</pre>
        </div>

        <div className="panel p-4">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Output</div>
          <pre className="mt-1 font-mono text-sm whitespace-pre-wrap min-h-[60px]">
            {output || (running ? "Running…" : "(no output yet)")}
          </pre>
          {errors && (
            <pre className="mt-2 font-mono text-xs text-destructive whitespace-pre-wrap border-t border-border pt-2">
              {errors}
            </pre>
          )}
        </div>

        {results && (
          <div className="panel p-4 space-y-2">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Tests</div>
            {results.map((r, i) => (
              <div
                key={i}
                className={`rounded-md border px-3 py-2 text-sm flex items-start gap-2 ${
                  r.passed ? "border-success/40 bg-success/5" : "border-destructive/40 bg-destructive/5"
                }`}
              >
                {r.passed ? (
                  <Check className="size-4 text-success mt-0.5" />
                ) : (
                  <X className="size-4 text-destructive mt-0.5" />
                )}
                <div className="flex-1">
                  <div className="font-medium">{r.label}</div>
                  {r.detail && (
                    <pre className="text-xs mt-1 whitespace-pre-wrap text-muted-foreground">{r.detail}</pre>
                  )}
                </div>
              </div>
            ))}
            {results.every((t) => t.passed) && (
              <div className="text-sm neon-cyan font-display tracking-widest">ALL TESTS PASSED</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function StepCode({ step, onSolved, onContext }: { step: import("@/lib/missions/types").CodeStep; onSolved: () => void; onContext?: (c: { userCode?: string; lastError?: string }) => void }) {
  return (
    <div>
      <h2 className="font-display text-2xl neon-cyan mb-3">{step.title}</h2>
      <CodeRunner step={step} onSolved={onSolved} onContext={onContext} />
    </div>
  );
}
