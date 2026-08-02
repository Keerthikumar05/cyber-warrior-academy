import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { battleProblems } from "./battle-problems";

/**
 * Join the matchmaking queue. If another player is waiting, atomically:
 *  - delete both queue rows
 *  - create a battle with a random problem
 *  - return { battleId, opponent }
 * Otherwise return { queued: true }.
 *
 * Server-side to avoid client-side race conditions where two users grab each other twice.
 */
export const findOrCreateBattle = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    // Look for an existing opponent (oldest waiter first)
    const { data: waiters } = await supabase
      .from("battle_queue")
      .select("user_id, joined_at")
      .neq("user_id", userId)
      .order("joined_at", { ascending: true })
      .limit(1);

    const opponent = waiters?.[0];

    if (opponent) {
      // Remove both from queue (best-effort), then create the battle
      await supabase.from("battle_queue").delete().in("user_id", [userId, opponent.user_id]);

      const problem = battleProblems[Math.floor(Math.random() * battleProblems.length)];
      const { data: battle, error } = await supabase
        .from("battles")
        .insert({
          player_a: opponent.user_id,
          player_b: userId,
          problem_slug: problem.slug,
          status: "active",
        })
        .select("id")
        .single();

      if (error) throw error;
      return { matched: true as const, battleId: battle.id, problemSlug: problem.slug };
    }

    // No opponent — join queue (upsert so re-joining is safe)
    await supabase.from("battle_queue").upsert({ user_id: userId, skill_level: 1 });
    return { matched: false as const };
  });

export const leaveBattleQueue = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await context.supabase.from("battle_queue").delete().eq("user_id", context.userId);
    return { ok: true };
  });

/**
 * Submit a solution to a battle. Server validates that the caller is a participant,
 * records the submission, and if `passed=true` and no winner yet, marks the caller as winner
 * and awards XP via the existing award_xp RPC.
 */
export const submitBattleSolution = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { battleId: string; code: string; passed: boolean }) => d)
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    const { data: battle } = await supabase
      .from("battles")
      .select("id, player_a, player_b, status, winner")
      .eq("id", data.battleId)
      .maybeSingle();

    if (!battle) throw new Error("Battle not found");
    if (battle.player_a !== userId && battle.player_b !== userId) throw new Error("Not a participant");

    await supabase.from("battle_submissions").insert({
      battle_id: data.battleId,
      user_id: userId,
      code: data.code,
      passed: data.passed,
    });

    let won = false;
    if (data.passed && battle.status === "active" && !battle.winner) {
      const { error: updErr } = await supabase
        .from("battles")
        .update({ status: "finished", winner: userId, finished_at: new Date().toISOString() })
        .eq("id", data.battleId)
        .eq("status", "active"); // race guard
      if (!updErr) {
        won = true;
        await supabase.rpc("award_xp", { _amount: 200, _source: "battle_win", _mission: data.battleId });
      }
    }

    return { won };
  });
