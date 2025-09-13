import { db } from "..";
import { feeds } from "../schema";
import { eq, sql } from "drizzle-orm";
import { firstOrUndefined } from "./utils";
import { fetchFeed } from "src/feed";

export async function createFeed(url: string, name: string, userId: string) {
  const result = await db
    .insert(feeds)
    .values({ url, name, userId })
    .returning();
  return firstOrUndefined(result);
}

export async function getFeeds() {
  const allFeeds = await db.select().from(feeds);
  return allFeeds;
}

export async function getFeedByUrl(url: string) {
  const result = await db.select().from(feeds).where(eq(feeds.url, url));
  return firstOrUndefined(result);
}

export async function markFeedFetched(feedId: string) {
  const result = await db
    .update(feeds)
    .set({ lastFetchedAt: new Date(), updatedAt: new Date() })
    .where(eq(feeds.id, feedId))
    .returning();
  return firstOrUndefined(result);
}

export async function getNextFeedToFetch() {
  const result = await db
    .select()
    .from(feeds)
    .orderBy(sql`${feeds.lastFetchedAt} desc nulls first`)
    .limit(1);
  return firstOrUndefined(result);
}
