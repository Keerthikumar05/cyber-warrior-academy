/**
 * Optional Socket.io upgrade path. When VITE_SOCKET_URL is set the app connects
 * to a dedicated Node Socket.io server (see /socket-server) for sub-100ms
 * presence + battle events. Otherwise we fall back to Supabase Realtime.
 *
 * Lazy-loaded so socket.io-client is only fetched when actually used.
 */
let socketPromise: Promise<unknown> | null = null;

export function isSocketEnabled(): boolean {
  return Boolean(import.meta.env.VITE_SOCKET_URL);
}

export async function getSocket(): Promise<unknown | null> {
  if (!isSocketEnabled()) return null;
  if (!socketPromise) {
    socketPromise = (async () => {
      try {
        const mod = await import(/* @vite-ignore */ "socket.io-client");
        return mod.io(import.meta.env.VITE_SOCKET_URL as string, {
          transports: ["websocket"],
          autoConnect: true,
        });
      } catch {
        return null;
      }
    })();
  }
  return socketPromise;
}
