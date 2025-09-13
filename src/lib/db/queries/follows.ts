import { and, eq } from "drizzle-orm";
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

export async function getFeedFollowsForUser(userId: string) {
  const result = await db
    .select()
    .from(feedFollows)
    .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
    .innerJoin(users, eq(feedFollows.userId, users.id))
    .where(eq(feedFollows.userId, userId));

  return result;
}

export async function deleteFeedFollow(userId: string, url: string) {
  const [feedToUnfollow] = await db
    .select()
    .from(feeds)
    .where(eq(feeds.url, url));

  if (!feedToUnfollow) {
    throw new Error(`Feed with URL ${url} not found`);
  }

  const deletedCount = await db
    .delete(feedFollows)
    .where(
      and(
        eq(feedFollows.userId, userId),
        eq(feedFollows.feedId, feedToUnfollow.id),
      ),
    )
    .returning();

  return deletedCount.length > 0;
}
