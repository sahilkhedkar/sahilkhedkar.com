import {
  DEFAULT_CONFIG,
  type ExtensionConfig,
  type ExtensionMessage,
  type TrackInfo,
} from "./types";

let config: ExtensionConfig = { ...DEFAULT_CONFIG };

async function loadConfig(): Promise<ExtensionConfig> {
  return new Promise((resolve) => {
    chrome.storage.sync.get(DEFAULT_CONFIG, (items) => {
      config = items as ExtensionConfig;
      resolve(config);
    });
  });
}

async function saveConfig(updates: Partial<ExtensionConfig>): Promise<void> {
  config = { ...config, ...updates };
  return new Promise((resolve) => {
    chrome.storage.sync.set(config, () => {
      resolve();
    });
  });
}

function updateBadge(track: TrackInfo | null, isPlaying: boolean) {
  try {
    if (!config.enabled) {
      chrome.action.setBadgeText({ text: "OFF" });
      chrome.action.setBadgeBackgroundColor({ color: "#71717a" });
      return;
    }

    if (!track || !track.title) {
      chrome.action.setBadgeText({ text: "" });
      return;
    }

    if (isPlaying) {
      chrome.action.setBadgeText({ text: "▶" });
      chrome.action.setBadgeBackgroundColor({ color: "#22c55e" });
    } else {
      chrome.action.setBadgeText({ text: "⏸" });
      chrome.action.setBadgeBackgroundColor({ color: "#71717a" });
    }
  } catch {
    // ignore badge errors in headless / incognito
  }
}

async function sendToBackend(payload: Record<string, unknown>): Promise<{ success: boolean; error?: string }> {
  await loadConfig();

  if (!config.enabled) {
    return { success: false, error: "Extension sync is disabled." };
  }

  const apiUrl = config.apiUrl || DEFAULT_CONFIG.apiUrl;
  const token = config.token || DEFAULT_CONFIG.token;

  if (!apiUrl) {
    return { success: false, error: "API URL is not configured." };
  }

  if (!token) {
    return { success: false, error: "Secret update token is not set." };
  }

  try {
    console.log(
      `[NowPlaying BG] Syncing -> "${payload.title || payload.action}" | isPlaying: ${payload.isPlaying}`
    );

    const res = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorJson = await res.json().catch(() => null);
      const errorMsg = errorJson?.error || `HTTP ${res.status} ${res.statusText}`;
      console.warn(`[NowPlaying BG] Error response: ${res.status} - ${errorMsg}`);
      await saveConfig({
        lastError: errorMsg,
        lastStatus: "error",
      });
      return { success: false, error: errorMsg };
    }

    console.log(`[NowPlaying BG] Sync successful: HTTP ${res.status}`);

    await saveConfig({
      lastSyncedAt: Date.now(),
      lastError: null,
      lastStatus: payload.isPlaying ? "playing" : "paused",
    });

    return { success: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Network error";
    console.warn(`[NowPlaying BG] Network fetch exception: ${msg}`);
    await saveConfig({
      lastError: msg,
      lastStatus: "offline",
    });
    return { success: false, error: msg };
  }
}

// Handle runtime messages from content script and popup
chrome.runtime.onMessage.addListener(
  (message: ExtensionMessage, _sender, sendResponse: (res: unknown) => void) => {
    (async () => {
      switch (message.type) {
        case "TRACK_CHANGED": {
          const track = message.payload;
          updateBadge(track, track.isPlaying);
          await saveConfig({ lastTrack: track });
          const res = await sendToBackend({
            title: track.title,
            artist: track.artist,
            album: track.album,
            artwork: track.artwork,
            videoId: track.videoId,
            isPlaying: track.isPlaying,
            progress: track.progress,
            duration: track.duration,
            updatedAt: track.updatedAt,
          });
          sendResponse(res);
          break;
        }

        case "HEARTBEAT": {
          const { isPlaying, progress, duration } = message.payload;
          updateBadge(config.lastTrack ?? null, isPlaying);
          const res = await sendToBackend({
            action: "heartbeat",
            isPlaying,
            progress,
            duration,
          });
          sendResponse(res);
          break;
        }

        case "TRACK_STOPPED": {
          updateBadge(null, false);
          if (config.lastTrack) {
            await saveConfig({
              lastTrack: { ...config.lastTrack, isPlaying: false },
            });
          }
          const res = await sendToBackend({
            action: "stopped",
            title: config.lastTrack?.title,
            artist: config.lastTrack?.artist,
            album: config.lastTrack?.album,
            artwork: config.lastTrack?.artwork,
            videoId: config.lastTrack?.videoId,
            isPlaying: false,
          });
          sendResponse(res);
          break;
        }

        case "CONFIG_UPDATED": {
          config = message.payload;
          updateBadge(config.lastTrack ?? null, config.lastTrack?.isPlaying ?? false);
          sendResponse({ success: true });
          break;
        }

        case "TEST_CONNECTION": {
          const res = await sendToBackend({
            action: "heartbeat",
            isPlaying: false,
          });
          sendResponse(res);
          break;
        }

        default:
          sendResponse({ error: "Unknown message type" });
      }
    })();

    return true; // Keep message channel open for async response
  }
);

// Listen for tab closure
chrome.tabs.onRemoved.addListener(async (_tabId, removeInfo) => {
  if (removeInfo.isWindowClosing) {
    // If entire window closed, notify backend
    await sendToBackend({
      action: "stopped",
      title: config.lastTrack?.title,
      artist: config.lastTrack?.artist,
      album: config.lastTrack?.album,
      artwork: config.lastTrack?.artwork,
      videoId: config.lastTrack?.videoId,
      isPlaying: false,
    });
  }
});

// Initial config load
loadConfig().then((cfg) => {
  updateBadge(cfg.lastTrack ?? null, cfg.lastTrack?.isPlaying ?? false);
});
