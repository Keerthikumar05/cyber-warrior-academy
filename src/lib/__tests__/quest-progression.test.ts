/**
 * Quest progression & reward integration tests.
 *
 * These tests exercise the `awardCloud` orchestrator against a mocked
 * Supabase client that simulates the server-side `complete_mission` and
 * `claim_quest_reward` RPCs. The mock mirrors the SQL semantics:
 *   - first call inserts user_progress -> first_time=true, rewards flow
 *   - duplicate call -> first_time=false, no XP, no quest bumps
 *   - quest_type 'complete_missions' -> +1 per first-time completion
 *   - quest_type 'earn_xp'           -> +xp per first-time completion
 *   - quest_type 'complete_world'    -> set to count of completed missions in that world
 *   - claim_quest_reward only pays out once when completed=true & claimed=false
 *
 * Run with:  bunx vitest run  OR  bun test src/lib/__tests__
 */
import { describe, it, expect, beforeEach, mock } from "bun:test";

interface QuestRow {
  id: string;
  slug: string;
  title: string;
  quest_type: "complete_missions" | "earn_xp" | "complete_world" | "win_battles" | "forum_help";
  target: number;
  xp_reward: number;
  coin_reward: number;
  active: boolean;
}

interface QProgress {
  quest_id: string;
  progress: number;
  completed: boolean;
  claimed: boolean;
}

// In-memory backend simulating the SQL functions atomically.
class FakeBackend {
  uid = "user-1";
  profile = { xp: 0, level: 1, coins: 0, current_streak: 0, last_active_date: null as string | null };
  missions = new Map<string, { score: number; attempts: number }>(); // key: world/mission
  questDefs: QuestRow[] = [
    { id: "q1", slug: "complete-3", title: "Triple Threat", quest_type: "complete_missions", target: 3, xp_reward: 150, coin_reward: 30, active: true },
    { id: "q2", slug: "earn-200xp", title: "XP Hunter", quest_type: "earn_xp", target: 200, xp_reward: 100, coin_reward: 20, active: true },
    { id: "q3", slug: "finish-world", title: "World Conqueror", quest_type: "complete_world", target: 4, xp_reward: 300, coin_reward: 80, active: true },
    { id: "q4", slug: "win-1-battle", title: "First Blood", quest_type: "win_battles", target: 1, xp_reward: 200, coin_reward: 50, active: true },
  ];
  quests = new Map<string, QProgress>();
  badges = new Set<string>();

  completeMission(world: string, mission: string, xp: number, badge: string | null, score: number) {
    const key = `${world}/${mission}`;
    const existed = this.missions.has(key);
    if (existed) {
      const m = this.missions.get(key)!;
      m.attempts++;
      m.score = Math.max(m.score, score);
      return { first_time: false, xp_awarded: 0, quests: [] };
    }
    this.missions.set(key, { score, attempts: 1 });
    this.profile.xp += xp;
    this.profile.coins += Math.floor(xp / 2);
    this.profile.level = Math.max(1, Math.floor(this.profile.xp / 100) + 1);
    if (badge) this.badges.add(badge);

    const events: Array<QuestRow & { progress: number; newly_completed: boolean }> = [];
    for (const q of this.questDefs.filter((x) => x.active)) {
      if (!["complete_missions", "earn_xp", "complete_world"].includes(q.quest_type)) continue;
      const cur = this.quests.get(q.id) ?? { quest_id: q.id, progress: 0, completed: false, claimed: false };
      if (cur.completed) continue;
      let next = cur.progress;
      if (q.quest_type === "complete_missions") next += 1;
      else if (q.quest_type === "earn_xp") next += xp;
      else if (q.quest_type === "complete_world") {
        next = [...this.missions.keys()].filter((k) => k.startsWith(world + "/")).length;
      }
      const completed = next >= q.target;
      const final: QProgress = { quest_id: q.id, progress: Math.min(next, q.target), completed, claimed: cur.claimed };
      this.quests.set(q.id, final);
      events.push({ ...q, progress: final.progress, newly_completed: completed });
    }
    return { first_time: true, xp_awarded: xp, quests: events };
  }

  claimQuest(quest_id: string) {
    const q = this.questDefs.find((x) => x.id === quest_id);
    const p = this.quests.get(quest_id);
    if (!q || !p || !p.completed || p.claimed) {
      return { claimed: false, reason: "not_completed_or_already_claimed" };
    }
    p.claimed = true;
    this.profile.xp += q.xp_reward;
    this.profile.coins += q.coin_reward;
    return { claimed: true, xp: q.xp_reward, coins: q.coin_reward };
  }
}

const backend = new FakeBackend();

// Mock the supabase client module before importing the SUT.
mock.module("@/integrations/supabase/client", () => ({
  supabase: {
    auth: {
      getUser: async () => ({ data: { user: { id: backend.uid } } }),
    },
    rpc: async (name: string, args: Record<string, unknown>) => {
      if (name === "complete_mission") {
        const data = backend.completeMission(
          args._world as string,
          args._mission as string,
          args._xp as number,
          (args._badge as string) ?? null,
          (args._score as number) ?? 100,
        );
        return { data, error: null };
      }
      if (name === "claim_quest_reward") {
        return { data: backend.claimQuest(args._quest_id as string), error: null };
      }
      return { data: null, error: new Error("unknown rpc " + name) };
    },
    from: (_table: string) => ({
      select: () => ({
        eq: () => ({
          maybeSingle: async () => ({ data: { xp: backend.profile.xp, level: backend.profile.level, coins: backend.profile.coins } }),
        }),
      }),
    }),
  },
}));

// Import after mocks are registered.
const { awardCloud } = await import("../progress");

describe("quest auto-progression on mission completion", () => {
  beforeEach(() => {
    backend.profile = { xp: 0, level: 1, coins: 0, current_streak: 0, last_active_date: null };
    backend.missions.clear();
    backend.quests.clear();
    backend.badges.clear();
  });

  it("mission completion bumps complete_missions and earn_xp quests", async () => {
    const res = await awardCloud({ xp: 80, worldSlug: "logic-land", missionSlug: "m1" });
    expect(res?.firstTime).toBe(true);
    expect(res?.xpAwarded).toBe(80);
    const complete3 = res!.quests.find((q) => q.slug === "complete-3")!;
    const earnXp = res!.quests.find((q) => q.slug === "earn-200xp")!;
    expect(complete3.progress).toBe(1);
    expect(complete3.newly_completed).toBe(false);
    expect(earnXp.progress).toBe(80);
    expect(earnXp.newly_completed).toBe(false);
    expect(res!.quests.find((q) => q.slug === "win-1-battle")).toBeUndefined(); // unrelated quest untouched
  });

  it("third mission completes the 'Triple Threat' quest with newly_completed=true", async () => {
    await awardCloud({ xp: 50, worldSlug: "logic-land", missionSlug: "m1" });
    await awardCloud({ xp: 50, worldSlug: "logic-land", missionSlug: "m2" });
    const res = await awardCloud({ xp: 120, worldSlug: "logic-land", missionSlug: "m3" });
    const complete3 = res!.quests.find((q) => q.slug === "complete-3")!;
    expect(complete3.progress).toBe(3);
    expect(complete3.newly_completed).toBe(true);

    const earnXp = res!.quests.find((q) => q.slug === "earn-200xp")!;
    expect(earnXp.progress).toBe(200); // capped at target
    expect(earnXp.newly_completed).toBe(true);
  });

  it("completing all 4 missions in a world finishes the world-completion quest", async () => {
    for (let i = 1; i <= 4; i++) {
      await awardCloud({ xp: 25, worldSlug: "python-kingdom", missionSlug: `m${i}` });
    }
    const finishWorld = backend.quests.get("q3")!;
    expect(finishWorld.progress).toBe(4);
    expect(finishWorld.completed).toBe(true);
  });

  it("duplicate mission completion grants no XP and does not bump quests", async () => {
    const first = await awardCloud({ xp: 100, worldSlug: "logic-land", missionSlug: "m1" });
    expect(first?.firstTime).toBe(true);

    const dup = await awardCloud({ xp: 100, worldSlug: "logic-land", missionSlug: "m1" });
    expect(dup?.firstTime).toBe(false);
    expect(dup?.xpAwarded).toBe(0);
    expect(dup?.quests).toEqual([]);

    // Profile XP must reflect only the first award.
    expect(backend.profile.xp).toBe(100);
    // Quest progress did not move past 1 mission.
    expect(backend.quests.get("q1")!.progress).toBe(1);
  });

  it("badge is awarded once and not duplicated", async () => {
    await awardCloud({ xp: 50, worldSlug: "logic-land", missionSlug: "m1", badgeSlug: "first-blood" });
    await awardCloud({ xp: 50, worldSlug: "logic-land", missionSlug: "m1", badgeSlug: "first-blood" }); // dup
    expect([...backend.badges]).toEqual(["first-blood"]);
  });
});

describe("quest reward claiming", () => {
  beforeEach(() => {
    backend.profile = { xp: 0, level: 1, coins: 0, current_streak: 0, last_active_date: null };
    backend.missions.clear();
    backend.quests.clear();
  });

  it("claim awards XP+coins exactly once", async () => {
    // Complete the 3-mission quest first
    await awardCloud({ xp: 25, worldSlug: "logic-land", missionSlug: "m1" });
    await awardCloud({ xp: 25, worldSlug: "logic-land", missionSlug: "m2" });
    await awardCloud({ xp: 25, worldSlug: "logic-land", missionSlug: "m3" });
    const xpBefore = backend.profile.xp;

    const first = backend.claimQuest("q1");
    expect(first.claimed).toBe(true);
    expect(first.xp).toBe(150);
    expect(backend.profile.xp).toBe(xpBefore + 150);

    const second = backend.claimQuest("q1");
    expect(second.claimed).toBe(false);
    expect(backend.profile.xp).toBe(xpBefore + 150); // unchanged
  });

  it("cannot claim an in-progress quest", async () => {
    await awardCloud({ xp: 25, worldSlug: "logic-land", missionSlug: "m1" });
    const r = backend.claimQuest("q1");
    expect(r.claimed).toBe(false);
  });
});
