# Code Quest — Realtime Battle Server (Optional)

This is an **optional** Node.js Socket.io server for **sub-100ms 1v1 battle latency**.

The main Code Quest app works out of the box using **Supabase Realtime** (no infra). Spin this up only when you want faster matchmaking + typing indicators.

## Deploy

Works on any Node 18+ host: **Render**, **Railway**, **Fly.io**, **Heroku**, your own VPS.

### Render (free tier)
1. Push the repo to GitHub.
2. New → Web Service → point at `socket-server/`.
3. Build: `npm install`. Start: `npm start`.
4. Env vars:
   - `SUPABASE_URL` — from Lovable Cloud
   - `SUPABASE_SERVICE_ROLE_KEY` — from Lovable Cloud
   - `CORS_ORIGIN` — your app URL (e.g. `https://code-quest.lovable.app`)
5. After deploy, set `VITE_SOCKET_URL=https://your-service.onrender.com` in the main app and `bun add socket.io-client`.

### Local
```bash
cd socket-server
npm install
SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... CORS_ORIGIN=http://localhost:8080 npm start
```

## Health
`GET /healthz` → `{ ok: true, queue, battles }`

## Protocol
Client emits `queue:join`, `queue:leave`, `battle:submit`, `battle:typing`.
Server emits `queue:waiting`, `battle:start`, `opponent:submitted`, `opponent:typing`, `battle:end`.

Auth handshake requires `socket.handshake.auth.token` = Supabase access token.
