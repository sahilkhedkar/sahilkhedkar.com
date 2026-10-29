import { getNowPlayingState } from "../../../lib/now-playing/storage";
import { registerClient } from "../../../lib/now-playing/broadcaster";

export const dynamic = "force-dynamic";

export async function GET() {
  const textEncoder = new TextEncoder();

  let unregister: (() => void) | null = null;

  const stream = new ReadableStream({
    async start(controller) {
      // Register with the global broadcaster
      unregister = registerClient(controller);

      // Send initial state immediately upon connecting
      try {
        const initialState = await getNowPlayingState();
        const payload = `event: now-playing\ndata: ${JSON.stringify(initialState)}\n\n`;
        controller.enqueue(textEncoder.encode(payload));
      } catch (err) {
        console.error("[NowPlaying Stream initial state error]:", err);
      }
    },
    cancel() {
      if (unregister) {
        unregister();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
