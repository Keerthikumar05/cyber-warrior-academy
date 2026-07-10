import type { Mission, World } from "./types";
import { logicLandMissions } from "./logic-land";
import { pythonKingdomMissions } from "./python-kingdom";
import { bugHunterCityMissions } from "./bug-hunter-city";
import { dataStructureArenaMissions } from "./data-structure-arena";
import { algorithmWarzoneMissions } from "./algorithm-warzone";
import { webDeveloperRealmMissions } from "./web-developer-realm";
import { aiDimensionMissions } from "./ai-dimension";
import { placementUniverseMissions } from "./placement-universe";

export const worlds: World[] = [
  {
    slug: "logic-land",
    name: "Logic Land",
    tagline: "Where every door is a puzzle.",
    description:
      "Master sequence, condition, and loop — the three pillars every programmer rebuilds in every language.",
    status: "available",
    accent: "cyan",
    order: 1,
    missions: logicLandMissions.map((m) => m.slug),
  },
  {
    slug: "python-kingdom",
    name: "Python Kingdom",
    tagline: "Cast real spells in real code.",
    description:
      "Variables, types, conditionals, loops, lists, functions — Python from zero, taught through quests.",
    status: "available",
    accent: "purple",
    order: 2,
    missions: pythonKingdomMissions.map((m) => m.slug),
  },
  {
    slug: "bug-hunter-city",
    name: "Bug Hunter City",
    tagline: "Hunt broken code through neon alleys.",
    description: "Debugging, off-by-ones, reference traps, exceptions, performance — the real-world skill nobody teaches.",
    status: "available",
    accent: "green",
    order: 3,
    missions: bugHunterCityMissions.map((m) => m.slug),
  },
  {
    slug: "data-structure-arena",
    name: "Data Structure Arena",
    tagline: "Arrays, stacks, queues, trees — fight as a team.",
    description: "Visualize and command the core data structures every algorithm is built from.",
    status: "available",
    accent: "cyan",
    order: 4,
    missions: dataStructureArenaMissions.map((m) => m.slug),
  },
  {
    slug: "algorithm-warzone",
    name: "Algorithm Warzone",
    tagline: "Sort. Search. Conquer.",
    description: "Learn search, sort, recursion, DP, greedy, and backtracking through visual missions.",
    status: "available",
    accent: "red",
    order: 5,
    missions: algorithmWarzoneMissions.map((m) => m.slug),
  },
  {
    slug: "web-developer-realm",
    name: "Web Developer Realm",
    tagline: "Build the web, one component at a time.",
    description: "HTML, CSS, JS, React, Node, PostgreSQL — build and deploy real apps end to end.",
    status: "available",
    accent: "purple",
    order: 6,
    missions: webDeveloperRealmMissions.map((m) => m.slug),
  },
  {
    slug: "ai-dimension",
    name: "AI Dimension",
    tagline: "Tame intelligence.",
    description: "ML, AI, generative AI, prompt engineering, LLMs.",
    status: "available",
    accent: "gold",
    order: 7,
    missions: aiDimensionMissions.map((m) => m.slug),
  },
  {
    slug: "placement-universe",
    name: "Placement Universe",
    tagline: "Get hired.",
    description: "DSA, SQL, OS, DBMS, networks, system design, HR, mock interviews.",
    status: "soon",
    accent: "gold",
    order: 8,
    missions: [],
  },
];

export const allMissions: Mission[] = [
  ...logicLandMissions,
  ...pythonKingdomMissions,
  ...bugHunterCityMissions,
  ...dataStructureArenaMissions,
  ...algorithmWarzoneMissions,
  ...webDeveloperRealmMissions,
  ...aiDimensionMissions,
];

export function getWorld(slug: string): World | undefined {
  return worlds.find((w) => w.slug === slug);
}

export function getMission(worldSlug: string, missionSlug: string): Mission | undefined {
  return allMissions.find((m) => m.worldSlug === worldSlug && m.slug === missionSlug);
}

export function getMissionsForWorld(worldSlug: string): Mission[] {
  return allMissions.filter((m) => m.worldSlug === worldSlug);
}

export function nextMission(worldSlug: string, missionSlug: string): Mission | undefined {
  const list = getMissionsForWorld(worldSlug);
  const idx = list.findIndex((m) => m.slug === missionSlug);
  if (idx === -1) return;
  if (idx + 1 < list.length) return list[idx + 1];
  // Cross-world: jump to next world's first mission
  const w = worlds.find((x) => x.slug === worldSlug);
  if (!w) return;
  const nw = worlds.find((x) => x.order === w.order + 1 && x.status === "available");
  if (!nw) return;
  return getMissionsForWorld(nw.slug)[0];
}
