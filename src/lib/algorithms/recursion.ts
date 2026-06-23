import type { Frame, AlgoSpec, FrameTreeNode } from "./types";

/**
 * Recursion visualization — factorial(n) by default.
 * Builds a call-tree, marking each node active → base/returned, and shows
 * the live call stack alongside.
 */
export function recursionFrames(spec: AlgoSpec): Frame[] {
  const n = Math.max(0, Math.min(spec.n ?? 5, 7));
  const frames: Frame[] = [];
  const nodes: FrameTreeNode[] = [];
  const stack: string[] = [];
  let depth = 0;
  let calls = 0;
  const returnedValue = new Map<string, number>();

  function push(note: string) {
    frames.push({
      array: [],
      tree: nodes.map((n) => ({ ...n })),
      stack: [...stack],
      note,
      stats: { depth, calls },
    });
  }

  function fact(k: number, parentId?: string): number {
    calls++;
    depth++;
    const id = `f${calls}`;
    const label = `fact(${k})`;
    nodes.push({ id, parentId, label, status: "active" });
    stack.push(label);
    push(`Call ${label}. Stack depth = ${depth}.`);

    if (k <= 1) {
      const node = nodes.find((n) => n.id === id)!;
      node.status = "base";
      node.detail = "= 1";
      returnedValue.set(id, 1);
      push(`Base case: fact(${k}) = 1. Start unwinding.`);
      stack.pop();
      depth--;
      return 1;
    }

    const sub = fact(k - 1, id);
    const result = k * sub;
    const node = nodes.find((n) => n.id === id)!;
    node.status = "returned";
    node.detail = `= ${k} × ${sub} = ${result}`;
    returnedValue.set(id, result);
    push(`Return ${label} = ${k} × ${sub} = ${result}.`);
    stack.pop();
    depth--;
    return result;
  }

  push(`Compute factorial(${n}) recursively. fact(k) = k × fact(k-1), with fact(0)=fact(1)=1.`);
  const final = fact(n);
  push(`Done. factorial(${n}) = ${final}. ${calls} calls, max depth ${n}.`);
  return frames;
}
