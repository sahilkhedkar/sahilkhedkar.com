import { NextResponse } from "next/server";
import { incrementPageViews } from "../../lib/page-views";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");

  if (!origin || !host) {
    return NextResponse.json({ error: "Invalid page view request" }, { status: 403 });
  }

  try {
    if (new URL(origin).host !== host.split(",")[0].trim()) {
      return NextResponse.json({ error: "Invalid page view request" }, { status: 403 });
    }
  } catch {
    return NextResponse.json({ error: "Invalid page view request" }, { status: 403 });
  }

  try {
    const count = await incrementPageViews();
    return NextResponse.json(
      { count },
      { headers: { "Cache-Control": "no-store, max-age=0" } },
    );
  } catch (error) {
    console.error("[Page views counter error]:", error);
    return NextResponse.json(
      { error: "Page views are temporarily unavailable" },
      { status: 503, headers: { "Cache-Control": "no-store, max-age=0" } },
    );
  }
}
