import type { NowPlayingState } from "./types";
import { getNowPlayingState } from "./storage";

type ClientController = ReadableStreamDefaultController<Uint8Array>;

interface GlobalBroadcaster {
  clients: Set<ClientController>;
  heartbeatTimer: ReturnType<typeof setInterval> | null;
  lastKnownState: NowPlayingState | null;
}

const globalBroadcaster = (globalThis as unknown as { __nowPlayingBroadcaster?: GlobalBroadcaster });
if (!globalBroadcaster.__nowPlayingBroadcaster) {
  globalBroadcaster.__nowPlayingBroadcaster = {
    clients: new Set<ClientController>(),
    heartbeatTimer: null,
    lastKnownState: null,
  };
}

const textEncoder = new TextEncoder();

function formatSSE(eventName: string, data: unknown): Uint8Array {
  const payload = `event: ${eventName}\ndata: ${JSON.stringify(data)}\n\n`;
  return textEncoder.encode(payload);
}

function formatPing(): Uint8Array {
  return textEncoder.encode(": ping\n\n");
}

function ensureHeartbeat() {
  const store = globalBroadcaster.__nowPlayingBroadcaster;
  if (!store || store.heartbeatTimer) return;

  // Send SSE comment ping every 15 seconds to prevent timeouts
  store.heartbeatTimer = setInterval(async () => {
    if (!store.clients || store.clients.size === 0) {
      if (store.heartbeatTimer) {
        clearInterval(store.heartbeatTimer);
        store.heartbeatTimer = null;
      }
      return;
    }

    const ping = formatPing();
    for (const client of store.clients) {
      try {
        client.enqueue(ping);
      } catch {
        store.clients.delete(client);
      }
    }

    // Also check if current song has gone stale since last broadcast
    try {
      const currentState = await getNowPlayingState();
      const last = store.lastKnownState;
      // If playback status changed due to staleness, broadcast the updated state
      if (last && (last.isPlaying !== currentState.isPlaying || last.isActive !== currentState.isActive)) {
        broadcastNowPlaying(currentState);
      }
    } catch {
      // ignore
    }
  }, 15000);
}

export function registerClient(controller: ClientController): () => void {
  const store = globalBroadcaster.__nowPlayingBroadcaster!;
  store.clients.add(controller);
  ensureHeartbeat();

  return () => {
    store.clients.delete(controller);
  };
}

export function broadcastNowPlaying(state: NowPlayingState): void {
  const store = globalBroadcaster.__nowPlayingBroadcaster!;
  store.lastKnownState = state;
  const data = formatSSE("now-playing", state);

  for (const client of store.clients) {
    try {
      client.enqueue(data);
    } catch {
      store.clients.delete(client);
    }
  }
}
