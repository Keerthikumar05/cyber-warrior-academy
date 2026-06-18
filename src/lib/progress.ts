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
export async function awardCloud(opts: {
  xp: number;
  worldSlug: string;
  missionSlug: string;
  badgeSlug?: string;
  badgeName?: string;
  score?: number;
}) {
  const { data: userData } = await supabase.auth.getUser();
  const uid = userData.user?.id;
  if (!uid) return null;

  await supabase.rpc("award_xp", {
    _amount: opts.xp,
    _source: "mission_complete",
    _mission: `${opts.worldSlug}/${opts.missionSlug}`,
  });

  await supabase
    .from("user_progress")
    .upsert(
      {
        user_id: uid,
        world_slug: opts.worldSlug,
        mission_slug: opts.missionSlug,
        completed: true,
        completed_at: new Date().toISOString(),
        best_score: opts.score ?? 100,
        step_index: 999,
      },
      { onConflict: "user_id,world_slug,mission_slug" },
    );

  if (opts.badgeSlug) {
    await supabase
      .from("user_badges")
      .insert({ user_id: uid, badge_slug: opts.badgeSlug })
      .then((r) => r); // ignore unique-violation if already earned
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("xp,level,coins")
    .eq("id", uid)
    .maybeSingle();
  return profile;
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
    await supabase.rpc("award_xp", { _amount: guest.xp, _source: "guest_sync", _mission: null });
  }
  for (const b of guest.badges) {
    await supabase.from("user_badges").insert({ user_id: userData.user.id, badge_slug: b });
  }
  // Clear local guest progress
  writeGuest(emptyProgress());
}
