import { db } from "..";
import { feeds } from "../schema";
import { eq } from "drizzle-orm";
import { firstOrUndefined } from "./utils";

export async function createFeed(url: string, name: string, userId: string) {
  const [result] = await db
    .insert(feeds)
    .values({ url, name, userId })
    .returning();
  return result;
}

export async function getFeeds() {
  const allFeeds = await db.select().from(feeds);
  return allFeeds;
}

export async function getFeedByUrl(url: string) {
  const result = await db.select().from(feeds).where(eq(feeds.url, url));
  return firstOrUndefined(result);
}
