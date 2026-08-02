import type { Frame, AlgoSpec } from "./types";

/**
 * Greedy coin change visualization.
 * Default = canonical coins [25,10,5,1] for amount 41 → greedy is optimal.
 * variant="counterexample" = coins [1,3,4] for amount 6 → greedy uses 3 coins,
 * optimal uses 2. Drives the "where greedy fails" lesson.
 */
export function greedyFrames(spec: AlgoSpec): Frame[] {
  const isCounter = spec.variant === "counterexample";
  const coins = (spec.coins ?? (isCounter ? [4, 3, 1] : [25, 10, 5, 1]))
    .slice()
    .sort((a, b) => b - a);
  const amount = spec.amount ?? (isCounter ? 6 : 41);
  const frames: Frame[] = [];
  const picks: number[] = [];
  let remaining = amount;
  let steps = 0;

  frames.push({
    array: coins,
    note: `Greedy coin change: pay ${amount} using coins ${coins.join(", ")}. Always pick the largest coin that fits.`,
    stats: { remaining, picks: 0 },
  });

  while (remaining > 0) {
    let idx = coins.findIndex((c) => c <= remaining);
    if (idx === -1) {
      frames.push({
        array: coins,
        note: `No coin ≤ ${remaining}. Greedy is stuck.`,
        highlights: [{ indices: coins.map((_, i) => i), role: "rejected" }],
        stats: { remaining, picks: picks.length },
      });
      break;
    }
    const chosen = coins[idx];
    picks.push(chosen);
    remaining -= chosen;
    steps++;
    frames.push({
      array: coins,
      highlights: [{ indices: [idx], role: "chosen" }],
      note: `Pick ${chosen}. Remaining = ${remaining}. (Pick #${steps}.)`,
      stats: { remaining, picks: picks.length },
    });
  }

  // Compute optimal for tiny amounts to surface the counterexample.
  const optimal = minCoins(coins, amount);
  const verdict =
    optimal !== null && optimal < picks.length
      ? `Greedy used ${picks.length} coins (${picks.join("+")}) — but optimal is ${optimal}. Greedy FAILS for ${coins.join(",")}/${amount}.`
      : `Greedy used ${picks.length} coins (${picks.join("+")}) = ${amount}. Matches the optimum for this coin set.`;

  frames.push({
    array: coins,
    highlights: [{ indices: coins.map((_, i) => i), role: "filled" }],
    note: verdict,
    stats: { remaining, picks: picks.length, optimal: optimal ?? -1 },
  });
  return frames;
}

function minCoins(coins: number[], amount: number): number | null {
  if (amount > 60) return null; // keep it cheap
  const dp = Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let a = 1; a <= amount; a++) {
    for (const c of coins) if (c <= a) dp[a] = Math.min(dp[a], dp[a - c] + 1);
  }
  return Number.isFinite(dp[amount]) ? dp[amount] : null;
}
