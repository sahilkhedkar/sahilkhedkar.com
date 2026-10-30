export interface TrackInfo {
  title: string | null;
  artist: string | null;
  album: string | null;
  artwork: string | null;
  videoId: string | null;
  isPlaying: boolean;
  progress: number;
  duration: number;
  updatedAt: number;
}

export interface ExtensionConfig {
  apiUrl: string;
  prodUrl?: string;
  localUrl?: string;
  dualSync?: boolean;
  token: string;
  enabled: boolean;
  lastSyncedAt?: number;
  lastStatus?: "idle" | "playing" | "paused" | "error" | "offline";
  lastError?: string | null;
  lastTrack?: TrackInfo | null;
}

export const DEFAULT_CONFIG: ExtensionConfig = {
  apiUrl: "https://sahilkhedkar.com/api/now-playing",
  prodUrl: "https://sahilkhedkar.com/api/now-playing",
  localUrl: "http://localhost:1234/api/now-playing",
  dualSync: true,
  token: "dev_secret_token_sahil_ytmusic_2026",
  enabled: true,
  lastStatus: "idle",
  lastError: null,
  lastTrack: null,
};

export type ExtensionMessage =
  | { type: "TRACK_CHANGED"; payload: TrackInfo }
  | { type: "HEARTBEAT"; payload: { isPlaying: boolean; progress: number; duration: number } }
  | { type: "TRACK_STOPPED" }
  | { type: "GET_CURRENT_TRACK" }
  | { type: "CONFIG_UPDATED"; payload: ExtensionConfig }
  | { type: "TEST_CONNECTION" };
