import {
  DEFAULT_CONFIG,
  type ExtensionConfig,
  type ExtensionMessage,
  type TrackInfo,
} from "./types";

let currentConfig: ExtensionConfig = { ...DEFAULT_CONFIG };
let lastSentTrack: TrackInfo | null = null;
let lastSentTimestamp = 0;
let latestBridgeTrack: TrackInfo | null = null;

function isGenericOrArtistTitle(str: string | null | undefined, artistName?: string | null): boolean {
  if (!str) return true;
  const lower = str.toLowerCase().trim();
  const genericWords = [
    "home",
    "explore",
    "library",
    "upgrade",
    "youtube music",
    "search",
    "podcasts",
    "liked music",
    "episodes for later",
    "music",
    "trending",
    "charts",
    "new releases",
    "radio",
    "listen again",
    "quick picks",
    "mixed for you",
    "forgotten favorites",
    "playlist",
    "album",
    "artist",
    "song",
    "track",
    "videos",
    "subscribe",
    "subscribers",
  ];
  if (genericWords.includes(lower) || lower.length === 0) {
    return true;
  }
  if (artistName && artistName.trim()) {
    const lowerArtist = artistName.toLowerCase().trim();
    if (lower === lowerArtist) return true;
    const subArtists = lowerArtist.split(/&|,|ft\.?|feat\.?/i).map((s) => s.trim()).filter(Boolean);
    for (const sub of subArtists) {
      if (sub.length > 2 && lower === sub) return true;
    }
  }
  return false;
}

// Load config from storage or use defaults
function loadConfig(): Promise<ExtensionConfig> {
  return new Promise((resolve) => {
    try {
      chrome.storage.sync.get(DEFAULT_CONFIG, (items) => {
        if (items) {
          currentConfig = {
            ...DEFAULT_CONFIG,
            ...(items as ExtensionConfig),
          };
          if (!currentConfig.token) {
            currentConfig.token = DEFAULT_CONFIG.token;
          }
          if (!currentConfig.apiUrl) {
            currentConfig.apiUrl = DEFAULT_CONFIG.apiUrl;
          }
        }
        resolve(currentConfig);
      });
    } catch {
      resolve(currentConfig);
    }
  });
}

// Listen for config updates from popup
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "sync") {
    loadConfig().then(() => {
      checkAndUpdate(true);
    });
  }
});

// Receive real-time MediaSession data from bridge.ts (MAIN world)
window.addEventListener("message", (event) => {
  if (event.data?.source === "YTM_NOW_PLAYING_BRIDGE" && event.data?.payload) {
    const payload = event.data.payload as TrackInfo;
    if (
      payload.title &&
      !isGenericOrArtistTitle(payload.title, payload.artist)
    ) {
      latestBridgeTrack = payload;
      checkAndUpdate();
    }
  }
});

function getVideoElement(): HTMLVideoElement | null {
  return document.querySelector("video");
}

function getTitleFromDocTitle(artistName?: string | null): { title: string; artist?: string } | null {
  if (!window.location.href.includes("/watch") && !window.location.pathname.includes("/watch")) {
    return null;
  }
  const docTitle = document.title || "";
  if (!docTitle || docTitle.trim() === "YouTube Music") return null;

  const clean = docTitle.replace(/ - YouTube Music$/i, "").trim();
  if (!clean || isGenericOrArtistTitle(clean, artistName)) return null;

  // Only accept docTitle if it contains an explicit track-to-artist separator
  if (clean.includes(" • ")) {
    const parts = clean.split(" • ");
    const t = parts[0]?.trim() || "";
    const a = parts[1]?.trim() || "";
    if (t && a && !isGenericOrArtistTitle(t, a) && t.toLowerCase() !== a.toLowerCase()) {
      return { title: t, artist: a };
    }
  }
  if (clean.includes(" - ")) {
    const parts = clean.split(" - ");
    const t = parts[0]?.trim() || "";
    const a = parts[1]?.trim() || "";
    if (t && a && !isGenericOrArtistTitle(t, a) && t.toLowerCase() !== a.toLowerCase()) {
      return { title: t, artist: a };
    }
  }
  return null;
}

function extractFromPlayerBar(playerBar: Element | null) {
  if (!playerBar) return { title: null, artist: null, videoId: null, artwork: null };

  let title: string | null = null;
  let artist: string | null = null;
  let videoId: string | null = null;
  let artwork: string | null = null;

  // 1. Content Info Wrapper
  const contentInfo = playerBar.querySelector(".content-info-wrapper, .middle-controls");
  if (contentInfo) {
    // Artist first
    const bylineEl = contentInfo.querySelector("yt-formatted-string.byline, .byline, .subtitle yt-formatted-string");
    if (bylineEl) {
      let a = (bylineEl.getAttribute("title") || bylineEl.textContent || "").trim();
      if (a && a.includes("•")) {
        a = a.split("•")[0]?.trim() || a;
      }
      if (a) {
        artist = a;
      }
    }

    // Title
    const titleEl = contentInfo.querySelector("yt-formatted-string.title, .title a, .title");
    if (titleEl) {
      const t = (titleEl.querySelector("a")?.textContent || titleEl.getAttribute("title") || titleEl.textContent || "").trim();
      if (t && !isGenericOrArtistTitle(t, artist)) {
        title = t;
      }
    }
  }

  // Fallback title selectors
  if (!title) {
    const fallbackTitleEls = [
      playerBar.querySelector(".content-info-wrapper yt-formatted-string.title a"),
      playerBar.querySelector(".middle-controls yt-formatted-string.title a"),
      playerBar.querySelector(".content-info-wrapper yt-formatted-string.title"),
      playerBar.querySelector(".middle-controls yt-formatted-string.title"),
      playerBar.querySelector("yt-formatted-string.title.ytmusic-player-bar"),
      playerBar.querySelector(".content-info-wrapper .title a"),
      playerBar.querySelector(".content-info-wrapper .title"),
    ];
    for (const el of fallbackTitleEls) {
      if (!el) continue;
      const t = (el.getAttribute("title") || el.textContent || "").trim();
      if (t && !isGenericOrArtistTitle(t, artist)) {
        title = t;
        break;
      }
    }
  }

  // 2. Video ID from playerBar links
  const links = playerBar.querySelectorAll<HTMLAnchorElement>("a[href*='watch?v='], a[href*='v=']");
  for (const link of links) {
    const href = link.getAttribute("href") || link.href || "";
    const match = href.match(/[?&]v=([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      videoId = match[1];
      break;
    }
  }

  // Fallback videoId from URL
  if (!videoId) {
    try {
      const locMatch = (window.location.href || "").match(/[?&]v=([a-zA-Z0-9_-]+)/);
      if (locMatch && locMatch[1]) {
        videoId = locMatch[1];
      }
    } catch {}
  }

  // 3. Artwork
  const img = playerBar.querySelector<HTMLImageElement>(
    ".thumbnail-image-wrapper img, .image.ytmusic-player-bar, #song-image img, ytmusic-player-bar .image, .thumbnail img"
  );
  if (img?.src && !img.src.startsWith("data:") && !img.src.includes("clear.cache.gif")) {
    artwork = img.src;
  }

  return { title, artist, videoId, artwork };
}

function extractTrackFromDOM(): TrackInfo | null {
  const video = getVideoElement();
  const playerBar = document.querySelector("ytmusic-player-bar");
  const domData = extractFromPlayerBar(playerBar);

  // If bridge provided a valid, non-generic track, prioritize it
  if (
    latestBridgeTrack &&
    latestBridgeTrack.title &&
    !isGenericOrArtistTitle(latestBridgeTrack.title, latestBridgeTrack.artist)
  ) {
    return {
      ...latestBridgeTrack,
      videoId: latestBridgeTrack.videoId || domData.videoId,
      artwork: latestBridgeTrack.artwork || domData.artwork,
      progress: video ? Math.floor(video.currentTime || 0) : latestBridgeTrack.progress,
      duration: video && !isNaN(video.duration) ? Math.floor(video.duration || 0) : latestBridgeTrack.duration,
      isPlaying: latestBridgeTrack.isPlaying,
    };
  }

  // 1. Song Title
  let title: string | null = domData.title;
  let artist: string | null = domData.artist;

  const docTitleData = getTitleFromDocTitle(artist);
  if (!title && docTitleData) {
    if (!artist || !isGenericOrArtistTitle(docTitleData.title, artist)) {
      title = docTitleData.title;
      if (!artist && docTitleData.artist) {
        artist = docTitleData.artist;
      }
    }
  }

  if (!title || isGenericOrArtistTitle(title, artist)) {
    return null;
  }

  // 2. Playback state
  const playPauseBtn = document.querySelector(
    "#play-pause-button, ytmusic-player-bar #play-pause-button, .play-pause-button"
  );
  let isPlaying = false;
  if (video && !video.paused && !video.ended && video.currentTime > 0) {
    isPlaying = true;
  } else if (navigator.mediaSession?.playbackState === "playing") {
    isPlaying = true;
  } else if (video && video.paused) {
    isPlaying = false;
  } else if (navigator.mediaSession?.playbackState === "paused") {
    isPlaying = false;
  } else if (playPauseBtn) {
    const btnTitle = (playPauseBtn.getAttribute("title") || "").toLowerCase();
    const btnAria = (
      playPauseBtn.getAttribute("aria-label") ||
      playPauseBtn.querySelector("button")?.getAttribute("aria-label") ||
      ""
    ).toLowerCase();
    if (btnTitle.includes("pause") || btnAria.includes("pause")) {
      isPlaying = true;
    } else if (btnTitle.includes("play") || btnAria.includes("play")) {
      isPlaying = false;
    }
  }

  return {
    title,
    artist: artist || "Unknown Artist",
    album: null,
    artwork: domData.artwork,
    videoId: domData.videoId,
    isPlaying,
    progress: video ? Math.floor(video.currentTime || 0) : 0,
    duration: video && !isNaN(video.duration) ? Math.floor(video.duration || 0) : 0,
    updatedAt: Date.now(),
  };
}

// Send all requests through background service worker (exempt from page CSP)
function sendToBackground(msg: ExtensionMessage): Promise<unknown> {
  return new Promise((resolve) => {
    try {
      chrome.runtime.sendMessage(msg, (response) => {
        if (chrome.runtime.lastError) {
          console.warn("[NowPlaying Ext] Background message error:", chrome.runtime.lastError.message);
          resolve(null);
        } else {
          resolve(response);
        }
      });
    } catch (err) {
      console.warn("[NowPlaying Ext] Runtime send error:", err);
      resolve(null);
    }
  });
}

let isSyncing = false;

async function checkAndUpdate(force: boolean = false) {
  if (isSyncing) return;
  await loadConfig();
  const current = extractTrackFromDOM();

  if (!current) {
    if (lastSentTrack !== null) {
      console.log("[NowPlaying Ext] Track cleared -> sending stopped");
      lastSentTrack = null;
      await sendToBackground({ type: "TRACK_STOPPED" });
    }
    return;
  }

  if (isGenericOrArtistTitle(current.title, current.artist)) {
    console.warn("[NowPlaying Ext] Suppressed invalid track update (home/artist name):", current.title);
    return;
  }

  const now = Date.now();
  // Keep the server fresh: send heartbeat every 4 seconds while playing
  const isHeartbeatTime = current.isPlaying && (now - lastSentTimestamp > 4000);

  const hasChanged =
    force ||
    !lastSentTrack ||
    lastSentTrack.title !== current.title ||
    lastSentTrack.artist !== current.artist ||
    lastSentTrack.isPlaying !== current.isPlaying ||
    (lastSentTrack.artwork !== current.artwork && Boolean(current.artwork)) ||
    lastSentTrack.videoId !== current.videoId ||
    isHeartbeatTime;

  if (hasChanged) {
    isSyncing = true;
    try {
      console.log(
        `[NowPlaying Ext] Sending -> "${current.title}" by "${current.artist}" | videoId: ${current.videoId} | isPlaying: ${current.isPlaying}`
      );

      const res = (await sendToBackground({
        type: "TRACK_CHANGED",
        payload: current,
      })) as { success?: boolean } | null;

      if (res?.success) {
        lastSentTrack = current;
        lastSentTimestamp = now;
      }
    } finally {
      isSyncing = false;
    }
  }
}

let lastAttachedVideo: HTMLVideoElement | null = null;

function ensureVideoListeners() {
  const video = getVideoElement();
  if (video && video !== lastAttachedVideo) {
    lastAttachedVideo = video;
    video.addEventListener("play", () => setTimeout(() => checkAndUpdate(true), 30));
    video.addEventListener("pause", () => setTimeout(() => checkAndUpdate(true), 30));
    video.addEventListener("playing", () => setTimeout(() => checkAndUpdate(true), 30));
    video.addEventListener("ended", () => setTimeout(() => checkAndUpdate(true), 30));
  }
}

function attachListeners() {
  ensureVideoListeners();

  // Observe player bar DOM mutations
  const target = document.querySelector("ytmusic-player-bar") || document.body;
  if (target) {
    const observer = new MutationObserver(() => {
      ensureVideoListeners();
      checkAndUpdate();
    });
    observer.observe(target, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ["title", "aria-label", "src", "href"],
    });
  }

  // Listen to clicks on player controls
  document.addEventListener(
    "click",
    (e) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest("#play-pause-button, ytmusic-player-bar, .play-pause-button, tp-yt-paper-icon-button")) {
        setTimeout(() => checkAndUpdate(true), 50);
        setTimeout(() => checkAndUpdate(true), 250);
      }
    },
    true
  );

  // Tab close or exit -> immediately notify stopped
  const handleExit = () => {
    sendToBackground({ type: "TRACK_STOPPED" });
  };

  window.addEventListener("beforeunload", handleExit);
  window.addEventListener("pagehide", handleExit);

  // Heartbeat check every 1s
  setInterval(() => {
    ensureVideoListeners();
    checkAndUpdate();
  }, 1000);
}

// Initialize
loadConfig().then(() => {
  attachListeners();
  setTimeout(() => checkAndUpdate(true), 400);
  console.log("[NowPlaying Ext] Content script active & monitoring YouTube Music (Browser/PWA)!");
});
