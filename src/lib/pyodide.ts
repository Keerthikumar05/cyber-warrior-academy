// Client-only Pyodide loader. Lazy-imports from CDN.
declare global {
  interface Window {
    loadPyodide?: (opts: { indexURL: string }) => Promise<PyodideInstance>;
    __cq_pyodide?: Promise<PyodideInstance>;
  }
}

export interface PyodideInstance {
  runPythonAsync: (code: string) => Promise<unknown>;
  globals: { get: (key: string) => unknown };
  setStdout: (opts: { batched: (msg: string) => void }) => void;
  setStderr: (opts: { batched: (msg: string) => void }) => void;
  toPy?: (obj: unknown) => unknown;
}

const PYODIDE_VERSION = "0.26.4";
const PYODIDE_BASE = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

function injectScript(src: string) {
  return new Promise<void>((resolve, reject) => {
    if (document.querySelector(`script[data-pyodide]`)) return resolve();
    const s = document.createElement("script");
    s.src = src;
    s.dataset.pyodide = "1";
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Failed to load Pyodide"));
    document.head.appendChild(s);
  });
}

export function loadPyodideOnce(): Promise<PyodideInstance> {
  if (typeof window === "undefined") return Promise.reject(new Error("server"));
  if (window.__cq_pyodide) return window.__cq_pyodide;
  window.__cq_pyodide = (async () => {
    await injectScript(`${PYODIDE_BASE}pyodide.js`);
    if (!window.loadPyodide) throw new Error("Pyodide loader missing");
    const py = await window.loadPyodide({ indexURL: PYODIDE_BASE });
    return py;
  })();
  return window.__cq_pyodide;
}

export interface RunResult {
  ok: boolean;
  stdout: string;
  stderr: string;
  error?: string;
}

export async function runPython(code: string): Promise<RunResult> {
  const py = await loadPyodideOnce();
  let stdout = "";
  let stderr = "";
  py.setStdout({ batched: (m) => { stdout += m + (m.endsWith("\n") ? "" : "\n"); } });
  py.setStderr({ batched: (m) => { stderr += m + (m.endsWith("\n") ? "" : "\n"); } });
  try {
    await py.runPythonAsync(code);
    return { ok: true, stdout: stdout.replace(/\n$/, ""), stderr };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, stdout: stdout.replace(/\n$/, ""), stderr, error: msg };
  }
}

export async function evalPythonExpr(expr: string): Promise<unknown> {
  const py = await loadPyodideOnce();
  const v = await py.runPythonAsync(expr);
  // Convert PyProxy to JS if possible
  if (v && typeof v === "object" && "toJs" in v) {
    try { return (v as { toJs: (o: unknown) => unknown }).toJs({ dict_converter: Object.fromEntries }); } catch { return v; }
  }
  return v;
}
