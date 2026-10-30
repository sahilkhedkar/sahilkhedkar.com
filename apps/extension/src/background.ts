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

async function postToUrl(
  url: string,
  token: string,
  payload: Record<string, unknown>
): Promise<{ success: boolean; url: string; error?: string }> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      return { success: true, url };
    }

    const errorJson = await res.json().catch(() => null);
    const errorMsg = errorJson?.error || `HTTP ${res.status} ${res.statusText}`;
    return { success: false, url, error: errorMsg };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Network error";
    return { success: false, url, error: msg };
  }
}

async function sendToBackend(payload: Record<string, unknown>): Promise<{ success: boolean; error?: string }> {
  await loadConfig();

  if (!config.enabled) {
    return { success: false, error: "Extension sync is disabled." };
  }

  const token = config.token || DEFAULT_CONFIG.token;
  if (!token) {
    return { success: false, error: "Secret update token is not set." };
  }

  // Determine target URLs
  const targets: string[] = [];
  const prodUrl = config.prodUrl || DEFAULT_CONFIG.prodUrl || "https://sahilkhedkar.com/api/now-playing";
  const localUrl = config.localUrl || DEFAULT_CONFIG.localUrl || "http://localhost:1234/api/now-playing";
  const isDualSync = config.dualSync !== false;

  if (isDualSync) {
    targets.push(prodUrl);
    if (localUrl && !targets.includes(localUrl)) {
      targets.push(localUrl);
    }
  } else {
    const singleUrl = config.apiUrl || DEFAULT_CONFIG.apiUrl || prodUrl;
    targets.push(singleUrl);
  }

  console.log(
    `[NowPlaying BG] Syncing to [${targets.join(", ")}] -> "${payload.title || payload.action}" | isPlaying: ${payload.isPlaying}`
  );

  const outcomes = await Promise.all(targets.map((url) => postToUrl(url, token, payload)));

  const successful = outcomes.filter((o) => o.success);
  const failed = outcomes.filter((o) => !o.success);

  for (const outcome of outcomes) {
    if (outcome.success) {
      console.log(`[NowPlaying BG] Sync success -> ${outcome.url}`);
    } else {
      console.warn(`[NowPlaying BG] Sync failed for ${outcome.url}: ${outcome.error}`);
    }
  }

  // If at least one endpoint succeeded, consider sync a success
  if (successful.length > 0) {
    await saveConfig({
      lastSyncedAt: Date.now(),
      lastError: null,
      lastStatus: payload.isPlaying ? "playing" : "paused",
    });
    return { success: true };
  }

  // All endpoints failed
  const primaryError = failed[0]?.error || "All sync endpoints unreachable";
  await saveConfig({
    lastError: primaryError,
    lastStatus: "error",
  });
  return { success: false, error: primaryError };
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
