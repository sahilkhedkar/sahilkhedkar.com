"use client";

import { useEffect, useState, useTransition } from "react";
import type { NowPlayingState } from "../lib/now-playing/types";

interface NowPlayingProps {
  initialData?: NowPlayingState | null;
}

export function YouTubeMusicBadge() {
  return (
    <div className="now-playing-yt-badge" title="YouTube Music" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" className="now-playing-yt-badge-svg">
        <circle cx="12" cy="12" r="11" fill="#FF0000" />
        <circle cx="12" cy="12" r="7" stroke="#FFFFFF" strokeWidth="1.5" fill="none" />
        <polygon points="10,8.5 16,12 10,15.5" fill="#FFFFFF" />
      </svg>
    </div>
  );
}

export function NowPlaying({ initialData }: NowPlayingProps) {
  const [state, setState] = useState<NowPlayingState | null>(initialData ?? null);
  const [imageError, setImageError] = useState(false);
  const [, startTransition] = useTransition();

  useEffect(() => {
    setImageError(false);
  }, [state?.artwork]);

  useEffect(() => {
    let eventSource: EventSource | null = null;
    let pollInterval: ReturnType<typeof setInterval> | null = null;
    let isSubscribed = true;

    // Fetch initial state
    fetch(`/api/now-playing?ts=${Date.now()}`, { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json?.data && isSubscribed) {
          setState(json.data);
        }
      })
      .catch(() => {});

    function connectSSE() {
      if (typeof window === "undefined" || !("EventSource" in window)) return;

      try {
        eventSource = new EventSource("/api/now-playing/stream");

        eventSource.addEventListener("now-playing", (event) => {
          if (!isSubscribed) return;
          try {
            const data = JSON.parse(event.data) as NowPlayingState;
            startTransition(() => {
              setState(data);
            });
          } catch (e) {
            console.warn("[NowPlaying SSE parse error]:", e);
          }
        });

        eventSource.onerror = () => {
          if (eventSource) {
            eventSource.close();
            eventSource = null;
          }
          if (isSubscribed) {
            setTimeout(connectSSE, 3000);
          }
        };
      } catch (err) {
        console.warn("[NowPlaying SSE init error]:", err);
      }
    }

    connectSSE();

    // Polling is the reliable transport across separate Vercel function instances.
    pollInterval = setInterval(() => {
      if (!isSubscribed) return;
      fetch(`/api/now-playing?ts=${Date.now()}`, { cache: "no-store" })
        .then((res) => (res.ok ? res.json() : null))
        .then((json) => {
          if (json?.data && isSubscribed) {
            startTransition(() => {
              setState(json.data);
            });
          }
        })
        .catch(() => {});
    }, 2000);

    return () => {
      isSubscribed = false;
      if (eventSource) {
        eventSource.close();
      }
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, []);

  const isInvalidTitle =
    !state?.title ||
    state.title.toLowerCase().trim() === "home" ||
    Boolean(state.artist && state.title.toLowerCase().trim() === state.artist.toLowerCase().trim());

  const hasSong = Boolean(state?.title && !isInvalidTitle);
  const isPlaying = Boolean(hasSong && state?.isPlaying && state?.isActive);

  // Always show recent music when not playing (never "Not listening right now")
  const displayTitle = hasSong ? state!.title : "Starboy";
  const displayArtist = hasSong ? (state?.artist || "YouTube Music") : "The Weeknd ft. Daft Punk";
  const displayArtwork = hasSong ? state?.artwork : "https://i.ytimg.com/vi/34Na4j8AVgA/hqdefault.jpg";
  const displayVideoId = hasSong ? state?.videoId : "34Na4j8AVgA";

  // Link to YouTube Music track
  const trackUrl = displayVideoId
    ? `https://music.youtube.com/watch?v=${displayVideoId}`
    : displayTitle
      ? `https://music.youtube.com/search?q=${encodeURIComponent(`${displayTitle} ${displayArtist || ""}`)}`
      : "https://music.youtube.com";

  const statusLabel = isPlaying ? "Playing" : "Recently played";

  return (
    <div
      className={`now-playing ${isPlaying ? "playing" : "paused"}`}
      aria-label="Now Playing on YouTube Music"
    >
      <a
        href={trackUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="now-playing-link"
        title={displayTitle ? `Listen to "${displayTitle}" on YouTube Music` : undefined}
      >
        {/* Poster with Circular YouTube Music Badge on bottom-right */}
        <div className="now-playing-art-wrap">
          {displayArtwork && !imageError ? (
            <img
              src={displayArtwork}
              alt={displayTitle || "Album Artwork"}
              className="now-playing-art"
              width={44}
              height={44}
              loading="lazy"
              referrerPolicy="no-referrer"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="now-playing-art-fallback-box">
              <svg
                className="now-playing-art-fallback"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M9 18V5l12-2v13" />
                <circle cx="6" cy="18" r="3" />
                <circle cx="18" cy="16" r="3" />
              </svg>
            </div>
          )}
          <YouTubeMusicBadge />
        </div>

        {/* Center Details: Song Title & Artist */}
        <div className="now-playing-content">
          <div className="now-playing-title-wrap">
            <span className="now-playing-title">{displayTitle}</span>
          </div>

          {displayArtist && <div className="now-playing-artist">{displayArtist}</div>}
        </div>

        {/* Right Side: Status Text & Animated Bars when actively playing */}
        <div className="now-playing-right">
          <div className="now-playing-status-inline">
            <span className="now-playing-status-label">{statusLabel}</span>
          </div>

          {/* Dancing Audio Bars only visible when actively playing */}
          {isPlaying && (
            <div className="now-playing-bars playing" aria-hidden="true">
              <span className="bar bar-1" />
              <span className="bar bar-2" />
              <span className="bar bar-3" />
              <span className="bar bar-4" />
            </div>
          )}
        </div>
      </a>
    </div>
  );
}
