import { NextRequest, NextResponse } from "next/server";
import { getNowPlayingState, saveNowPlayingState } from "../../lib/now-playing/storage";
import { broadcastNowPlaying } from "../../lib/now-playing/broadcaster";
import type { NowPlayingState, NowPlayingUpdatePayload } from "../../lib/now-playing/types";

// Dynamic route configuration
export const dynamic = "force-dynamic";

function getCorsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Authorization, Content-Type, x-api-key",
  };
}

function isInvalidOrArtistTitle(title: string | null | undefined, artist?: string | null): boolean {
  if (!title) return true;
  const lower = title.toLowerCase().trim();
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
    "playlist",
    "album",
    "artist",
    "track",
    "song",
  ];
  if (genericWords.includes(lower) || lower.length === 0) {
    return true;
  }
  if (artist && artist.trim()) {
    const lowerArtist = artist.toLowerCase().trim();
    if (lower === lowerArtist) return true;
    const subArtists = lowerArtist.split(/&|,|ft\.?|feat\.?/i).map((s) => s.trim()).filter(Boolean);
    for (const sub of subArtists) {
      if (sub.length > 2 && lower === sub) return true;
    }
  }
  return false;
}

function cleanSongTitle(raw: string, artistName?: string | null): string {
  if (!raw) return "";
  let clean = raw;
  if (clean.includes(" | ")) {
    clean = clean.split(" | ")[0] || clean;
  }
  clean = clean.replace(/\s*[\(\[][^\)\n]*(?:official|music\s*video|audio|lyric|video|visualizer)[^\)\]]*[\)\]]/gi, "");
  if (artistName) {
    const artists = artistName.split(/&|,|ft\.?|feat\.?/i).map((a) => a.trim()).filter(Boolean);
    for (const a of [artistName, ...artists]) {
      if (!a || a.length < 2) continue;
      const escaped = a.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      clean = clean.replace(new RegExp(`\\s*-\\s*${escaped}.*$`, "i"), "");
      clean = clean.replace(new RegExp(`^${escaped}\\s*-\\s*`, "i"), "");
      clean = clean.replace(new RegExp(`\\s+${escaped}\\s*$`, "i"), "");
    }
  }
  return clean.trim() || raw;
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: getCorsHeaders(),
  });
}

export async function GET() {
  try {
    const state = await getNowPlayingState();
    return NextResponse.json(
      { success: true, data: state },
      {
        headers: {
          ...getCorsHeaders(),
          "Cache-Control": "public, s-maxage=3, stale-while-revalidate=10",
        },
      }
    );
  } catch (error) {
    console.error("[NowPlaying GET error]:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch now playing state",
      },
      { status: 500, headers: getCorsHeaders() }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const configuredToken = process.env.NOW_PLAYING_UPDATE_TOKEN;

    if (!configuredToken) {
      console.error(
        "[NowPlaying POST error]: NOW_PLAYING_UPDATE_TOKEN environment variable is not configured on the server."
      );
      return NextResponse.json(
        {
          success: false,
          error: "Server configuration error: NOW_PLAYING_UPDATE_TOKEN is not set.",
        },
        { status: 500, headers: getCorsHeaders() }
      );
    }

    // Authenticate request
    const authHeader = req.headers.get("authorization");
    const apiKeyHeader = req.headers.get("x-api-key");
    const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;
    const providedToken = bearerToken || apiKeyHeader;

    if (!providedToken || providedToken !== configuredToken) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Invalid or missing token" },
        { status: 401, headers: getCorsHeaders() }
      );
    }

    const payload = (await req.json()) as NowPlayingUpdatePayload;
    console.log("[NowPlaying API POST incoming payload]:", JSON.stringify(payload));

    const currentState = await getNowPlayingState();
    const now = Date.now();

    let newState: NowPlayingState;

    if (payload.action === "stopped") {
      newState = {
        ...currentState,
        title: payload.title || currentState?.title || null,
        artist: payload.artist || currentState?.artist || null,
        album: payload.album || currentState?.album || null,
        artwork: payload.artwork || currentState?.artwork || null,
        videoId: payload.videoId || currentState?.videoId || null,
        isPlaying: false,
        isActive: true,
        updatedAt: now,
      };
    } else if (payload.action === "heartbeat") {
      newState = {
        ...currentState,
        isPlaying: payload.isPlaying !== undefined ? payload.isPlaying : currentState.isPlaying,
        updatedAt: now,
        progress: payload.progress !== undefined ? payload.progress : currentState.progress,
        duration: payload.duration !== undefined ? payload.duration : currentState.duration,
      };
    } else {
      // Normal track update
      if (!payload.title) {
        return NextResponse.json(
          { success: false, error: "Song title is required" },
          { status: 400, headers: getCorsHeaders() }
        );
      }

      let resolvedTitle = payload.title.trim();
      let resolvedArtist = payload.artist?.trim() || currentState?.artist || null;
      let resolvedArtwork = payload.artwork || currentState?.artwork || null;

      const isSameSong = Boolean(
        currentState?.title &&
        resolvedTitle &&
        resolvedTitle.toLowerCase() === currentState.title.toLowerCase() &&
        (!resolvedArtist || !currentState.artist || resolvedArtist.toLowerCase() === currentState.artist.toLowerCase())
      );

      let resolvedVideoId = payload.videoId || (isSameSong ? currentState?.videoId : null) || null;

      let isInvalid = isInvalidOrArtistTitle(resolvedTitle, resolvedArtist);

      // If generic title ("Home", etc.) or artist was sent as title, automatically resolve using YouTube official oEmbed API
      if (isInvalid && payload.videoId) {
        try {
          const oembedRes = await fetch(
            `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${payload.videoId}&format=json`
          );
          if (oembedRes.ok) {
            const oembedData = (await oembedRes.json()) as { title?: string; author_name?: string; thumbnail_url?: string };
            if (oembedData?.title) {
              const cleaned = cleanSongTitle(oembedData.title, resolvedArtist);
              if (cleaned && !isInvalidOrArtistTitle(cleaned, resolvedArtist)) {
                resolvedTitle = cleaned;
                isInvalid = false;
              }
              if (oembedData.author_name && (!resolvedArtist || resolvedArtist === "Unknown Artist")) {
                resolvedArtist = oembedData.author_name;
              }
              if (oembedData.thumbnail_url && !resolvedArtwork) {
                resolvedArtwork = oembedData.thumbnail_url;
              }
            }
          }
        } catch (e) {
          console.warn("[NowPlaying oEmbed fallback warning]:", e);
        }
      }

      // If still invalid, automatically resolve real song title via YouTube Search scraper
      if (isInvalid && resolvedArtist && resolvedArtist !== "Unknown Artist") {
        try {
          const searchQuery = payload.album ? `${resolvedArtist} ${payload.album}` : resolvedArtist;
          const ytRes = await fetch(
            `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`,
            { headers: { "User-Agent": "Mozilla/5.0" } }
          );
          if (ytRes.ok) {
            const ytHtml = await ytRes.text();
            const titleMatch = ytHtml.match(/"title":\{"runs":\[\{"text":"([^"]+)"/);
            const videoIdMatch = ytHtml.match(/\/watch\?v=([a-zA-Z0-9_-]{11})/);
            if (titleMatch && titleMatch[1]) {
              const cleaned = cleanSongTitle(titleMatch[1], resolvedArtist);
              if (cleaned && !isInvalidOrArtistTitle(cleaned, resolvedArtist)) {
                resolvedTitle = cleaned;
                isInvalid = false;
              }
            }
            if (videoIdMatch && videoIdMatch[1] && !payload.videoId) {
              resolvedVideoId = videoIdMatch[1];
            }
          }
        } catch (e) {
          console.warn("[NowPlaying search resolution warning]:", e);
        }
      }

      // Final safety: if STILL invalid, use previous valid title or album
      if (isInvalid) {
        if (currentState?.title && !isInvalidOrArtistTitle(currentState.title, resolvedArtist)) {
          resolvedTitle = currentState.title;
          isInvalid = false;
        } else if (payload.album && !isInvalidOrArtistTitle(payload.album, resolvedArtist)) {
          resolvedTitle = payload.album.trim();
          isInvalid = false;
        }
      }

      // Reject update if title remains invalid (e.g. still "Home" or artist name)
      if (isInvalid || isInvalidOrArtistTitle(resolvedTitle, resolvedArtist)) {
        console.warn(`[NowPlaying POST rejected]: Title "${resolvedTitle}" is invalid or matches artist "${resolvedArtist}"`);
        return NextResponse.json(
          {
            success: false,
            error: "Invalid song title: 'Home' and artist names are not allowed as song titles.",
          },
          { status: 400, headers: getCorsHeaders() }
        );
      }

      newState = {
        title: resolvedTitle,
        artist: resolvedArtist,
        album: payload.album?.trim() || currentState?.album || null,
        artwork: resolvedArtwork,
        videoId: resolvedVideoId,
        isPlaying: payload.isPlaying !== undefined ? Boolean(payload.isPlaying) : true,
        progress: typeof payload.progress === "number" ? payload.progress : 0,
        duration: typeof payload.duration === "number" ? payload.duration : 0,
        updatedAt: payload.updatedAt || now,
        isActive: payload.isPlaying !== undefined ? Boolean(payload.isPlaying) : true,
      };
    }

    const savedState = await saveNowPlayingState(newState);

    // Push real-time event to all connected visitors
    broadcastNowPlaying(savedState);

    return NextResponse.json(
      { success: true, data: savedState },
      { headers: getCorsHeaders() }
    );
  } catch (error) {
    console.error("[NowPlaying POST error]:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to update state",
      },
      { status: 500, headers: getCorsHeaders() }
    );
  }
}
