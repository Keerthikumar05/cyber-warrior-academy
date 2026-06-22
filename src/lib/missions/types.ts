// Mission content schema — extensible across all future worlds.

export type StepKind =
  | "intro"
  | "concept"
  | "practice"
  | "code"
  | "boss"
  | "mastery";

export interface IntroStep {
  kind: "intro";
  title: string;
  story: string;
  visual: "robot" | "gate" | "loop" | "cipher" | "ai" | "terminal" | "vault" | "decision" | "spell" | "forge";
}

export interface ConceptStep {
  kind: "concept";
  title: string;
  body: string;
  /** Interactive demo type rendered on the right. */
  demo:
    | { type: "sequence-demo"; items: string[] }
    | { type: "truth-table"; rows: Array<{ a: boolean; b?: boolean; out: boolean; label: string }> }
    | { type: "loop-counter"; from: number; to: number }
    | { type: "code-trace"; lines: string[]; explain: string[] }
    | { type: "var-box"; values: Array<{ name: string; value: string; type: string }> }
    | { type: "ds-viz"; structure: "array" | "stack" | "queue" | "linked-list" | "tree"; ops: DSOp[] }
    | { type: "bug-diff"; before: string; after: string; explain: string }
    | { type: "algo-viz"; algo: "linear-search" | "binary-search" | "bubble-sort" | "merge-sort"; input: number[]; target?: number };
}

/** One animation frame for a data-structure visualization. */
export interface DSOp {
  label: string;
  /** For array/stack/queue/linked-list: ordered list of cell values. */
  cells?: (number | string)[];
  /** For tree: flat list of nodes; children referenced by index. */
  tree?: Array<{ value: number | string; left?: number; right?: number }>;
  /** Indexes (or tree node indexes) to highlight in this frame. */
  highlight?: number[];
}

export type PracticeKind =
  | { type: "sequence"; prompt: string; shuffled: string[]; correct: string[] }
  | { type: "mcq"; prompt: string; options: string[]; correctIndex: number; explain: string }
  | { type: "predict"; prompt: string; code: string; options: string[]; correctIndex: number; explain: string }
  | { type: "pattern"; prompt: string; sequence: (number | string)[]; options: (number | string)[]; correctIndex: number; explain: string };

export interface PracticeStep {
  kind: "practice";
  title: string;
  challenge: PracticeKind;
}

export interface CodeTest {
  /** Optional stdin to feed the program (joined by newline). */
  stdin?: string;
  /** Expected substring(s) the printed stdout must contain (case-insensitive). */
  expectIncludes?: string[];
  /** Expected exact stdout (trimmed) — alternative to expectIncludes. */
  expectExact?: string;
  /** Python expression evaluated after running the code; must equal expected. */
  expectEval?: { expr: string; equals: unknown };
  label: string;
}

export interface CodeStep {
  kind: "code";
  title: string;
  brief: string;
  language: "python";
  starter: string;
  tests: CodeTest[];
  /** Optional hint shown by the AI mentor if asked. */
  hintTopic: string;
}

export interface BossStep {
  kind: "boss";
  title: string;
  story: string;
  /** A boss is either a code challenge or a harder practice puzzle. */
  challenge: PracticeKind | { type: "code"; brief: string; language: "python"; starter: string; tests: CodeTest[]; hintTopic: string };
}

export interface MasteryStep {
  kind: "mastery";
  title: string;
  summary: string;
  takeaways: string[];
  xpReward: number;
  badgeSlug?: string;
  badgeName?: string;
}

export type MissionStep = IntroStep | ConceptStep | PracticeStep | CodeStep | BossStep | MasteryStep;

export interface Mission {
  slug: string;
  worldSlug: string;
  title: string;
  subtitle: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  estMinutes: number;
  xpBase: number;
  /** Concept tag for AI mentor to track mastery. */
  topics: string[];
  steps: MissionStep[];
}

export interface World {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  status: "available" | "locked" | "soon";
  accent: "cyan" | "purple" | "gold" | "red" | "green";
  order: number;
  missions: Mission["slug"][];
}
