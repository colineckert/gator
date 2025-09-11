import { eq } from "drizzle-orm";
import { db } from "..";
import { feedFollows, feeds, users } from "../schema";

export async function createFeedFollow(userId: string, feedId: string) {
  const [newFeedFollow] = await db
    .insert(feedFollows)
    .values({ userId, feedId })
    .returning();

  const [joinedFeeds] = await db
    .select()
    .from(feedFollows)
    .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
    .innerJoin(users, eq(feedFollows.userId, users.id))
    .where(eq(feedFollows.id, newFeedFollow.id));

  return joinedFeeds;
}
