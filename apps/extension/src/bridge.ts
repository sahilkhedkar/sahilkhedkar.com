// Runs in MAIN world on music.youtube.com (Browser and PWA Desktop App)
(function () {
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

  function getBestArtwork(artworks?: readonly MediaImage[]): string | null {
    if (!artworks || artworks.length === 0) return null;
    const sorted = [...artworks].sort((a, b) => {
      const sizeA = parseInt(a.sizes?.split("x")[0] || "0", 10);
      const sizeB = parseInt(b.sizes?.split("x")[0] || "0", 10);
      return sizeB - sizeA;
    });
    return sorted[0]?.src || null;
  }

  function getTitleFromDocTitle(artistName?: string | null): { title: string; artist?: string } | null {
    // Only trust docTitle if the user is explicitly on a /watch URL
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
      // Find artist first so we can prevent artist name from becoming title
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

      // Explicit title element selector
      const titleEl = contentInfo.querySelector("yt-formatted-string.title, .title a, .title");
      if (titleEl) {
        const t = (titleEl.querySelector("a")?.textContent || titleEl.getAttribute("title") || titleEl.textContent || "").trim();
        if (t && !isGenericOrArtistTitle(t, artist)) {
          title = t;
        }
      }
    }

    // Fallback title selectors if contentInfo wrapper was structured differently
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

    // 2. Video ID extraction from playerBar links
    const links = playerBar.querySelectorAll<HTMLAnchorElement>("a[href*='watch?v='], a[href*='v=']");
    for (const link of links) {
      const href = link.getAttribute("href") || link.href || "";
      const match = href.match(/[?&]v=([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        videoId = match[1];
        break;
      }
    }

    // Fallback videoId from window URL
    if (!videoId) {
      try {
        const locMatch = (window.location.href || "").match(/[?&]v=([a-zA-Z0-9_-]+)/);
        if (locMatch && locMatch[1]) {
          videoId = locMatch[1];
        }
      } catch {}
    }

    // 3. Artwork from playerBar thumbnail
    const img = playerBar.querySelector<HTMLImageElement>(
      ".thumbnail-image-wrapper img, .image.ytmusic-player-bar, #song-image img, ytmusic-player-bar .image, .thumbnail img"
    );
    if (img?.src && !img.src.startsWith("data:") && !img.src.includes("clear.cache.gif")) {
      artwork = img.src;
    }

    return { title, artist, videoId, artwork };
  }

  function getTrackData() {
    const video = document.querySelector("video");
    const playerBar = document.querySelector("ytmusic-player-bar");
    const meta = navigator.mediaSession?.metadata;
    const domData = extractFromPlayerBar(playerBar);

    let title: string | null = null;
    let artist: string | null = null;
    let album: string | null = meta?.album?.trim() || null;
    let artwork: string | null = getBestArtwork(meta?.artwork) || domData.artwork;
    let videoId: string | null = domData.videoId;

    // 1. Resolve Artist first
    if (meta?.artist && meta.artist.trim()) {
      artist = meta.artist.trim();
    } else if (domData.artist) {
      artist = domData.artist;
    }

    // 2. Title Resolution (priority: MediaSession official API -> PlayerBar DOM)
    // MediaSession metadata is the purest source directly from YouTube Music audio player engine
    if (meta?.title && !isGenericOrArtistTitle(meta.title, artist)) {
      title = meta.title.trim();
    }

    if (!title && domData.title && !isGenericOrArtistTitle(domData.title, artist)) {
      title = domData.title;
    }

    // Strictly guarded docTitle only on /watch pages
    const docTitleData = getTitleFromDocTitle(artist);
    if (!title && docTitleData?.title && !isGenericOrArtistTitle(docTitleData.title, artist)) {
      title = docTitleData.title;
      if (!artist && docTitleData.artist) {
        artist = docTitleData.artist;
      }
    }

    // Final validation: Title MUST exist, CANNOT be generic ("Home", etc.), CANNOT be the artist
    if (!title || isGenericOrArtistTitle(title, artist)) {
      return null;
    }

    // 2. Playback state detection
    let isPlaying = false;
    const playPauseBtn = document.querySelector(
      "#play-pause-button, ytmusic-player-bar #play-pause-button, .play-pause-button"
    );
    if (playPauseBtn) {
      const btnTitle = (playPauseBtn.getAttribute("title") || "").toLowerCase();
      const btnAria = (playPauseBtn.getAttribute("aria-label") || "").toLowerCase();
      if (btnTitle.includes("pause") || btnAria.includes("pause")) {
        isPlaying = true;
      } else if (btnTitle.includes("play") || btnAria.includes("play")) {
        isPlaying = false;
      }
    } else if (navigator.mediaSession?.playbackState) {
      isPlaying = navigator.mediaSession.playbackState === "playing";
    } else if (video) {
      isPlaying = !video.paused && !video.ended;
    }

    const progress = video ? Math.floor(video.currentTime || 0) : 0;
    const duration = video && !isNaN(video.duration) ? Math.floor(video.duration || 0) : 0;

    return {
      title,
      artist: artist || "Unknown Artist",
      album,
      artwork,
      videoId,
      isPlaying,
      progress,
      duration,
      updatedAt: Date.now(),
    };
  }

  function emitMediaSessionState() {
    try {
      const data = getTrackData();
      if (data) {
        window.postMessage(
          {
            source: "YTM_NOW_PLAYING_BRIDGE",
            payload: data,
          },
          "*"
        );
      }
    } catch {}
  }

  // Poll state every 500ms
  setInterval(emitMediaSessionState, 500);

  // Video element event listeners
  function attachVideoListeners() {
    const video = document.querySelector("video");
    if (video) {
      video.addEventListener("play", () => setTimeout(emitMediaSessionState, 40));
      video.addEventListener("pause", () => setTimeout(emitMediaSessionState, 40));
      video.addEventListener("playing", () => setTimeout(emitMediaSessionState, 40));
      video.addEventListener("ended", () => setTimeout(emitMediaSessionState, 40));
    }
  }

  attachVideoListeners();
  setInterval(attachVideoListeners, 2500);

  // Document click listener on player controls
  document.addEventListener(
    "click",
    (e) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest("#play-pause-button, ytmusic-player-bar, .play-pause-button, tp-yt-paper-icon-button")) {
        setTimeout(emitMediaSessionState, 40);
        setTimeout(emitMediaSessionState, 200);
      }
    },
    true
  );

  emitMediaSessionState();
})();
