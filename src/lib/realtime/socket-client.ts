/**
 * Optional Socket.io upgrade path. When VITE_SOCKET_URL is set and
 * socket.io-client is installed, the app can connect to a dedicated Node
 * Socket.io server (see /socket-server) for sub-100ms presence + battle
 * events. By default we fall back to Supabase Realtime (already used).
 *
 * The socket.io-client dependency is intentionally NOT in package.json so
 * the Cloudflare Worker bundle stays slim. To enable:
 *   1. Deploy /socket-server to a Node host (Render, Railway, Fly).
 *   2. `bun add socket.io-client` in this app.
 *   3. Set VITE_SOCKET_URL to the deployed server URL.
 */
export function isSocketEnabled(): boolean {
  return Boolean(import.meta.env.VITE_SOCKET_URL);
}

export async function getSocket(): Promise<unknown | null> {
  if (!isSocketEnabled()) return null;
  // socket.io-client is opt-in; left unimported so the bundle doesn't require it.
  // To wire it: bun add socket.io-client, then dynamically import here.
  return null;
}
