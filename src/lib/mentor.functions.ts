import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { generateText } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const MENTOR_MODEL = "google/gemini-3-flash-preview";

const SYSTEM = `You are "Cipher", the AI mentor of CODE QUEST — a gamified coding-learning platform.
Your style: warm, encouraging, sharp, never preachy. Treat the learner as a Code Warrior on a quest.

RULES:
- Default to HINTS, not full answers. Lead the student to discover the solution.
- Only give a complete solution if the student explicitly asks ("just show me", "give me the answer") or has failed 3+ times in a row.
- When you do show code, explain WHY each line exists, not just what it does.
- Keep responses tight: 2-5 short sentences, then optional small code block. No filler.
- Use the current mission context (title, topics, brief, last error) to tailor every reply.
- When asked to explain an error, restate it in plain English, identify the root cause, then suggest the smallest fix.
- Always end with one short next-step prompt or question.
- Never use phrases like "as an AI", "I'm here to help", "happy to assist".
`;

const ChatInput = z.object({
  message: z.string().min(1).max(2000),
  mode: z.enum(["hint", "explain_error", "recommend", "chat"]).default("chat"),
  context: z
    .object({
      worldSlug: z.string().optional(),
      missionSlug: z.string().optional(),
      missionTitle: z.string().optional(),
      missionBrief: z.string().optional(),
      topics: z.array(z.string()).optional(),
      userCode: z.string().optional(),
      lastError: z.string().optional(),
    })
    .optional(),
});

export const askMentor = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => ChatInput.parse(d))
  .handler(async ({ data, context }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const { supabase, userId } = context;

    // Save user message
    await supabase.from("mentor_messages").insert({
      user_id: userId,
      role: "user",
      content: data.message,
      context: data.context ?? null,
    });

    // Pull last ~10 messages for short memory
    const { data: history } = await supabase
      .from("mentor_messages")
      .select("role,content,created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(10);

    const recent = (history ?? []).reverse();

    // Pull recent progress to inform recommendations
    const { data: progress } = await supabase
      .from("user_progress")
      .select("world_slug,mission_slug,completed,attempts,best_score,updated_at")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false })
      .limit(20);

    const completedSet = (progress ?? []).filter((r) => r.completed).map((r) => `${r.world_slug}/${r.mission_slug}`);

    const ctxLines: string[] = [];
    if (data.context?.missionTitle) ctxLines.push(`Current mission: ${data.context.missionTitle}`);
    if (data.context?.topics?.length) ctxLines.push(`Topics: ${data.context.topics.join(", ")}`);
    if (data.context?.missionBrief) ctxLines.push(`Mission brief:\n${data.context.missionBrief}`);
    if (data.context?.userCode) ctxLines.push(`Student's current code:\n\`\`\`python\n${data.context.userCode}\n\`\`\``);
    if (data.context?.lastError) ctxLines.push(`Last error from code run:\n${data.context.lastError}`);
    if (completedSet.length) ctxLines.push(`Missions completed so far: ${completedSet.join(", ")}`);

    const modeNote =
      data.mode === "hint"
        ? "Mode: HINT. Do NOT reveal the full solution. Nudge with the next small step."
        : data.mode === "explain_error"
        ? "Mode: EXPLAIN ERROR. Restate the error simply, identify cause, suggest smallest fix."
        : data.mode === "recommend"
        ? "Mode: RECOMMEND. Suggest the next mission and why."
        : "Mode: CHAT.";

    const provider = createLovableAiGatewayProvider(key);
    const model = provider(MENTOR_MODEL);

    try {
      const { text } = await generateText({
        model,
        system: SYSTEM,
        messages: [
          { role: "system", content: `${modeNote}\n\nContext:\n${ctxLines.join("\n") || "(none)"}` },
          ...recent.map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
        ],
      });

      await supabase.from("mentor_messages").insert({
        user_id: userId,
        role: "assistant",
        content: text,
        context: data.context ?? null,
      });

      return { reply: text };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      // Surface known gateway errors clearly
      if (msg.includes("402")) {
        throw new Error("AI credits exhausted. Add credits in workspace settings.");
      }
      if (msg.includes("429")) {
        throw new Error("Mentor is busy — try again in a few seconds.");
      }
      throw new Error(`Mentor error: ${msg}`);
    }
  });

export const loadMentorHistory = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data } = await supabase
      .from("mentor_messages")
      .select("id,role,content,created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: true })
      .limit(100);
    return data ?? [];
  });
