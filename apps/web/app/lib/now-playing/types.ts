export interface NowPlayingState {
  title: string | null;
  artist: string | null;
  album?: string | null;
  artwork?: string | null;
  videoId?: string | null;
  isPlaying: boolean;
  progress?: number;
  duration?: number;
  updatedAt: number;
  isActive?: boolean;
}

export interface NowPlayingUpdatePayload {
  title?: string | null;
  artist?: string | null;
  album?: string | null;
  artwork?: string | null;
  videoId?: string | null;
  isPlaying?: boolean;
  progress?: number;
  duration?: number;
  updatedAt?: number;
  action?: "playing" | "paused" | "stopped" | "heartbeat";
}

export interface NowPlayingApiResponse {
  success: boolean;
  data: NowPlayingState;
  source?: "redis" | "memory";
}
