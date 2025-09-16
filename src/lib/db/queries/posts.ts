import { eq, desc } from 'drizzle-orm';
import { db } from '..';
import { feedFollows, feeds, posts } from '../schema';
import { firstOrUndefined } from './utils';

export async function createPost(
  feedId: string,
  title: string,
  url: string,
  description: string | null,
  publishedAt: Date
) {
  const [existingPost] = await db
    .select()
    .from(posts)
    .where(eq(posts.url, url))
    .limit(1);

  if (existingPost) {
    return existingPost;
  }

  const newPost = await db
    .insert(posts)
    .values({
      feedId,
      title,
      url,
      description,
      publishedAt,
    })
    .returning();

  return firstOrUndefined(newPost);
}

export async function getPostsForUser(userId: string, limit: number) {
  const result = await db
    .select()
    .from(posts)
    .innerJoin(feeds, eq(posts.feedId, feeds.id))
    .innerJoin(feedFollows, eq(feeds.id, feedFollows.feedId))
    .where(eq(feedFollows.userId, userId))
    .orderBy(desc(posts.publishedAt))
    .limit(limit);

  return result.map((row) => row.posts);
}
