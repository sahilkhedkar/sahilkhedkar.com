import fs from "fs";
import path from "path";
import { Redis as UpstashRedis } from "@upstash/redis";
import IORedis from "ioredis";
import type { NowPlayingState } from "./types";

const REDIS_KEY = "portfolio:now-playing";
// Consider song stale if playing but no update/heartbeat received in 5 minutes
const STALE_THRESHOLD_MS = 5 * 60 * 1000;

export const DEFAULT_RECENT_TRACK: NowPlayingState = {
  title: "Starboy",
  artist: "The Weeknd ft. Daft Punk",
  album: "Starboy",
  artwork: "https://i.ytimg.com/vi/34Na4j8AVgA/hqdefault.jpg",
  videoId: "34Na4j8AVgA",
  isPlaying: false,
  progress: 0,
  duration: 230,
  updatedAt: Date.now(),
  isActive: true,
};

interface GlobalNowPlayingStore {
  state: NowPlayingState | null;
  ioRedisClient?: IORedis | null;
  upstashClient?: UpstashRedis | null;
}

const globalStore = (globalThis as unknown as { __nowPlayingStore?: GlobalNowPlayingStore });
if (!globalStore.__nowPlayingStore) {
  globalStore.__nowPlayingStore = {
    state: null,
    ioRedisClient: null,
    upstashClient: null,
  };
}

function getCacheFilePath(): string {
  return path.join(process.cwd(), ".cache", "now-playing.json");
}

function readCacheFile(): NowPlayingState | null {
  try {
    const filePath = getCacheFilePath();
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(content) as NowPlayingState;
    }
  } catch {}
  return null;
}

function writeCacheFile(state: NowPlayingState) {
  try {
    const filePath = getCacheFilePath();
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(state, null, 2), "utf-8");
  } catch {}
}

function getUpstashClient(): UpstashRedis | null {
  if (globalStore.__nowPlayingStore?.upstashClient) {
    return globalStore.__nowPlayingStore.upstashClient;
  }
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token) {
    const client = new UpstashRedis({ url, token });
    if (globalStore.__nowPlayingStore) {
      globalStore.__nowPlayingStore.upstashClient = client;
    }
    return client;
  }
  return null;
}

function getIORedisClient(): IORedis | null {
  if (globalStore.__nowPlayingStore?.ioRedisClient) {
    return globalStore.__nowPlayingStore.ioRedisClient;
  }
  const redisUrl = process.env.REDIS_URL || "redis://127.0.0.1:6379";
  if (redisUrl) {
    try {
      const client = new IORedis(redisUrl, {
        lazyConnect: true,
        maxRetriesPerRequest: 1,
        enableOfflineQueue: false,
        connectTimeout: 1500,
      });
      client.on("error", (err) => {
        // Suppress unhandled redis errors if local redis not running
      });
      if (globalStore.__nowPlayingStore) {
        globalStore.__nowPlayingStore.ioRedisClient = client;
      }
      return client;
    } catch (err) {
      console.warn("[NowPlaying IORedis init failed, using fallback]:", err);
    }
  }
  return null;
}

export function sanitizeState(raw: NowPlayingState | null): NowPlayingState {
  if (!raw || !raw.title) {
    return {
      ...DEFAULT_RECENT_TRACK,
      updatedAt: Date.now(),
    };
  }

  const now = Date.now();
  const timeSinceUpdate = now - (raw.updatedAt || 0);
  const isStale = timeSinceUpdate > STALE_THRESHOLD_MS;

  // If stale, it can no longer be actively playing
  const isPlaying = !isStale && Boolean(raw.isPlaying);
  // Retain as active (recently played) indefinitely so recent track is never lost
  const isActive = Boolean(raw.title);

  return {
    title: raw.title,
    artist: raw.artist || null,
    album: raw.album || null,
    artwork: raw.artwork || null,
    videoId: raw.videoId || null,
    isPlaying,
    progress: typeof raw.progress === "number" ? raw.progress : 0,
    duration: typeof raw.duration === "number" ? raw.duration : 0,
    updatedAt: raw.updatedAt || now,
    isActive,
  };
}

export async function getNowPlayingState(): Promise<NowPlayingState> {
  // 1. Try Upstash Redis
  const upstash = getUpstashClient();
  if (upstash) {
    try {
      const data = await upstash.get<NowPlayingState>(REDIS_KEY);
      if (data && data.title) {
        const sanitized = sanitizeState(data);
        if (globalStore.__nowPlayingStore) {
          globalStore.__nowPlayingStore.state = sanitized;
        }
        return sanitized;
      }
    } catch (err) {
      console.warn("[NowPlaying Upstash get error, using fallback]:", err);
    }
  }

  // 2. Try IORedis
  const ioRedis = getIORedisClient();
  if (ioRedis) {
    try {
      if (ioRedis.status !== "ready" && ioRedis.status !== "connecting") {
        await ioRedis.connect();
      }
      const data = await ioRedis.get(REDIS_KEY);
      if (data) {
        const parsed = JSON.parse(data) as NowPlayingState;
        if (parsed?.title) {
          const sanitized = sanitizeState(parsed);
          if (globalStore.__nowPlayingStore) {
            globalStore.__nowPlayingStore.state = sanitized;
          }
          return sanitized;
        }
      }
    } catch (err) {
      // Redis fallback
    }
  }

  // 3. Try In-memory fallback
  if (globalStore.__nowPlayingStore?.state?.title) {
    return sanitizeState(globalStore.__nowPlayingStore.state);
  }

  // 4. Try File-system cache fallback
  const cached = readCacheFile();
  if (cached?.title) {
    const sanitized = sanitizeState(cached);
    if (globalStore.__nowPlayingStore) {
      globalStore.__nowPlayingStore.state = sanitized;
    }
    return sanitized;
  }

  // 5. Default recent track fallback
  return sanitizeState(DEFAULT_RECENT_TRACK);
}

export async function saveNowPlayingState(state: NowPlayingState): Promise<NowPlayingState> {
  const sanitized = sanitizeState(state);

  // Always update memory store
  if (globalStore.__nowPlayingStore) {
    globalStore.__nowPlayingStore.state = sanitized;
  }

  // Persist to local disk cache
  writeCacheFile(sanitized);

  // Persist indefinitely in Upstash Redis
  const upstash = getUpstashClient();
  if (upstash) {
    try {
      await upstash.set(REDIS_KEY, sanitized);
    } catch (err) {
      console.warn("[NowPlaying Upstash save error]:", err);
    }
  }

  // Persist indefinitely in IORedis
  const ioRedis = getIORedisClient();
  if (ioRedis) {
    try {
      if (ioRedis.status !== "ready" && ioRedis.status !== "connecting") {
        await ioRedis.connect();
      }
      await ioRedis.set(REDIS_KEY, JSON.stringify(sanitized));
    } catch (err) {
      // Redis fallback
    }
  }

  return sanitized;
}

