// Local + cloud progress. Guests use localStorage; signed-in users sync to Lovable Cloud.
import { supabase } from "@/integrations/supabase/client";

const KEY = "codequest.progress.v1";

export interface GuestProgress {
  xp: number;
  level: number;
  coins: number;
  completed: Record<string, true>; // `${world}/${mission}`
  badges: string[];
}

export function emptyProgress(): GuestProgress {
  return { xp: 0, level: 1, coins: 0, completed: {}, badges: [] };
}

export function readGuest(): GuestProgress {
  if (typeof window === "undefined") return emptyProgress();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return emptyProgress();
    return { ...emptyProgress(), ...JSON.parse(raw) };
  } catch {
    return emptyProgress();
  }
}

export function writeGuest(p: GuestProgress) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(p));
  window.dispatchEvent(new CustomEvent("codequest:progress"));
}

export function levelFromXp(xp: number) {
  return Math.max(1, Math.floor(xp / 100) + 1);
}

export function awardGuest(opts: {
  xp: number;
  worldSlug: string;
  missionSlug: string;
  badgeSlug?: string;
}) {
  const p = readGuest();
  p.xp += opts.xp;
  p.coins += Math.floor(opts.xp / 2);
  p.level = levelFromXp(p.xp);
  p.completed[`${opts.worldSlug}/${opts.missionSlug}`] = true;
  if (opts.badgeSlug && !p.badges.includes(opts.badgeSlug)) p.badges.push(opts.badgeSlug);
  writeGuest(p);
  return p;
}

export function isMissionCompletedLocal(worldSlug: string, missionSlug: string) {
  return !!readGuest().completed[`${worldSlug}/${missionSlug}`];
}

// Cloud sync
export interface QuestEvent {
  slug: string;
  title: string;
  quest_type: string;
  progress: number;
  target: number;
  newly_completed: boolean;
  xp_reward: number;
  coin_reward: number;
}

export interface MissionCompletionResult {
  firstTime: boolean;
  xpAwarded: number;
  quests: QuestEvent[];
  profile: { xp: number; level: number; coins: number } | null;
}

export async function awardCloud(opts: {
  xp: number;
  worldSlug: string;
  missionSlug: string;
  badgeSlug?: string;
  badgeName?: string;
  score?: number;
}): Promise<MissionCompletionResult | null> {
  const { data: userData } = await supabase.auth.getUser();
  const uid = userData.user?.id;
  if (!uid) return null;

  const { data, error } = await supabase.rpc("complete_mission", {
    _world: opts.worldSlug,
    _mission: opts.missionSlug,
    _xp: opts.xp,
    _badge: opts.badgeSlug ?? undefined,
    _badge_name: opts.badgeName ?? undefined,
    _score: opts.score ?? 100,
  });
  if (error) throw error;

  const result = (data ?? {}) as {
    first_time?: boolean;
    xp_awarded?: number;
    quests?: QuestEvent[];
  };

  const { data: profile } = await supabase
    .from("profiles")
    .select("xp,level,coins")
    .eq("id", uid)
    .maybeSingle();

  return {
    firstTime: !!result.first_time,
    xpAwarded: result.xp_awarded ?? 0,
    quests: result.quests ?? [],
    profile: profile ?? null,
  };
}


/** Migrate guest progress into a freshly signed-in account, then clear it locally. */
export async function syncGuestToCloud() {
  const guest = readGuest();
  if (!guest.xp && Object.keys(guest.completed).length === 0) return;
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return;

  const entries = Object.keys(guest.completed).map((k) => {
    const [worldSlug, missionSlug] = k.split("/");
    return { user_id: userData.user!.id, world_slug: worldSlug, mission_slug: missionSlug, completed: true, completed_at: new Date().toISOString(), best_score: 100, step_index: 999 };
  });
  if (entries.length) {
    await supabase.from("user_progress").upsert(entries, { onConflict: "user_id,world_slug,mission_slug" });
  }
  if (guest.xp > 0) {
    await supabase.rpc("award_xp", { _amount: guest.xp, _source: "guest_sync" });
  }
  for (const b of guest.badges) {
    await supabase.from("user_badges").insert({ user_id: userData.user.id, badge_slug: b });
  }
  // Clear local guest progress
  writeGuest(emptyProgress());
}
