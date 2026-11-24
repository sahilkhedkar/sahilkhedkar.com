"use client";

import { useEffect, useState, useTransition } from "react";
import type { NowPlayingState } from "../lib/now-playing/types";

interface NowPlayingProps {
  initialData?: NowPlayingState | null;
}

export function NowPlaying({ initialData }: NowPlayingProps) {
  const [state, setState] = useState<NowPlayingState | null>(initialData ?? null);
  const [, startTransition] = useTransition();

  useEffect(() => {
    let eventSource: EventSource | null = null;
    let pollInterval: ReturnType<typeof setInterval> | null = null;
    let isSubscribed = true;

    // Fetch initial state with cache busting
    fetch(`/api/now-playing?_t=${Date.now()}`, { cache: "no-store" })
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

    // Fast polling fallback to ensure real-time accuracy across serverless instances
    pollInterval = setInterval(() => {
      if (!isSubscribed) return;
      fetch(`/api/now-playing?_t=${Date.now()}`, { cache: "no-store" })
        .then((res) => (res.ok ? res.json() : null))
        .then((json) => {
          if (json?.data && isSubscribed) {
            startTransition(() => {
              setState(json.data);
            });
          }
        })
        .catch(() => {});
    }, 2500);

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
    state.title.toLowerCase().trim() === "library" ||
    state.title.toLowerCase().trim() === "explore" ||
    state.title.toLowerCase().trim() === "youtube music";

  const hasSong = Boolean(state?.title && !isInvalidTitle);
  const isPlaying = Boolean(hasSong && state?.isPlaying && state?.isActive);

  // Always show recent music when not playing (never "Not listening right now")
  const displayTitle = hasSong ? state!.title : "Starboy";
  const displayArtist = hasSong ? (state?.artist || "YouTube Music") : "The Weeknd ft. Daft Punk";
  const displayVideoId = hasSong ? state?.videoId : "34Na4j8AVgA";

  // Link to YouTube Music track
  const trackUrl = displayVideoId
    ? `https://music.youtube.com/watch?v=${displayVideoId}`
    : displayTitle
      ? `https://music.youtube.com/search?q=${encodeURIComponent(`${displayTitle} ${displayArtist || ""}`)}`
      : "https://music.youtube.com";

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
        {/* Animated equalizer bars */}
        <div className="now-playing-bars playing" aria-hidden="true">
          <span className="bar bar-1" />
          <span className="bar bar-2" />
          <span className="bar bar-3" />
        </div>

        {/* Song title and artist inline */}
        <span className="now-playing-title">{displayTitle}</span>
        <span className="now-playing-separator">·</span>
        {displayArtist && <span className="now-playing-artist">{displayArtist}</span>}
      </a>
    </div>
  );
}
