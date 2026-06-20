/**
 * Code Quest — Optional Realtime Battle Server
 *
 * Deploy this to a Node host (Render, Railway, Fly.io, your own VPS) when you
 * want sub-100ms 1v1 battles. The main app falls back to Supabase Realtime
 * when VITE_SOCKET_URL is not set, so this server is OPTIONAL.
 *
 * Env vars required:
 *   PORT                          (default 3001)
 *   SUPABASE_URL                  (your project URL)
 *   SUPABASE_SERVICE_ROLE_KEY     (server-only)
 *   CORS_ORIGIN                   (your app URL, e.g. https://your-app.lovable.app)
 */
import { createServer } from "http";
import { Server } from "socket.io";
import { createClient } from "@supabase/supabase-js";

const PORT = process.env.PORT || 3001;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "*";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

const httpServer = createServer((req, res) => {
  if (req.url === "/healthz") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: true, queue: queue.length, battles: battles.size }));
    return;
  }
  res.writeHead(404);
  res.end();
});

const io = new Server(httpServer, {
  cors: { origin: CORS_ORIGIN, methods: ["GET", "POST"] },
  transports: ["websocket"],
});

// In-memory matchmaking queue + active battles
const queue = []; // [{ socketId, userId, joinedAt }]
const battles = new Map(); // battleId -> { players: [a, b], problemSlug, winner }

const PROBLEMS = [
  { slug: "sum-pair", test: "solve(2,3)==5" },
  { slug: "reverse-string", test: "solve('hi')=='ih'" },
  { slug: "max-of-list", test: "solve([1,2,3])==3" },
];

io.use(async (socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error("auth required"));
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) return next(new Error("invalid token"));
  socket.data.userId = data.user.id;
  next();
});

io.on("connection", (socket) => {
  const userId = socket.data.userId;
  console.log(`[connect] ${userId}`);

  socket.on("queue:join", () => {
    // Find an opponent
    const idx = queue.findIndex((q) => q.userId !== userId);
    if (idx >= 0) {
      const opp = queue.splice(idx, 1)[0];
      const problem = PROBLEMS[Math.floor(Math.random() * PROBLEMS.length)];
      const battleId = `b_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      battles.set(battleId, { players: [opp.userId, userId], problemSlug: problem.slug, winner: null });
      socket.join(battleId);
      io.sockets.sockets.get(opp.socketId)?.join(battleId);
      io.to(battleId).emit("battle:start", { battleId, problemSlug: problem.slug, players: [opp.userId, userId] });
    } else {
      queue.push({ socketId: socket.id, userId, joinedAt: Date.now() });
      socket.emit("queue:waiting");
    }
  });

  socket.on("queue:leave", () => {
    const i = queue.findIndex((q) => q.socketId === socket.id);
    if (i >= 0) queue.splice(i, 1);
  });

  socket.on("battle:typing", ({ battleId }) => {
    socket.to(battleId).emit("opponent:typing");
  });

  socket.on("battle:submit", ({ battleId, passed }) => {
    const b = battles.get(battleId);
    if (!b || b.winner) return;
    socket.to(battleId).emit("opponent:submitted", { passed });
    if (passed) {
      b.winner = userId;
      io.to(battleId).emit("battle:end", { winner: userId });
    }
  });

  socket.on("disconnect", () => {
    const i = queue.findIndex((q) => q.socketId === socket.id);
    if (i >= 0) queue.splice(i, 1);
    console.log(`[disconnect] ${userId}`);
  });
});

httpServer.listen(PORT, () => {
  console.log(`[code-quest-socket] listening on :${PORT}`);
});
