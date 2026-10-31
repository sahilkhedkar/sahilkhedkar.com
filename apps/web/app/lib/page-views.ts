import { Redis as UpstashRedis } from "@upstash/redis";
import IORedis from "ioredis";

const PAGE_VIEWS_KEY = "portfolio:page-views";

interface PageViewClients {
  upstash?: UpstashRedis | null;
  redis?: IORedis | null;
}

const globalClients = globalThis as typeof globalThis & {
  __pageViewClients?: PageViewClients;
};

function getClients() {
  if (!globalClients.__pageViewClients) globalClients.__pageViewClients = {};
  return globalClients.__pageViewClients;
}

export async function incrementPageViews() {
  const clients = getClients();
  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (upstashUrl && upstashToken) {
    const client = clients.upstash ?? new UpstashRedis({ url: upstashUrl, token: upstashToken });
    clients.upstash = client;
    return client.incr(PAGE_VIEWS_KEY);
  }

  const redisUrl = process.env.REDIS_URL;
  if (!redisUrl) throw new Error("Page view storage is not configured");

  const client =
    clients.redis ??
    new IORedis(redisUrl, {
      lazyConnect: true,
      maxRetriesPerRequest: 1,
      enableOfflineQueue: false,
      connectTimeout: 1500,
    });
  clients.redis = client;
  client.on("error", () => {});

  if (client.status !== "ready" && client.status !== "connecting") {
    await client.connect();
  }

  return client.incr(PAGE_VIEWS_KEY);
}
