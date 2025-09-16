import { getPostsForUser } from 'src/lib/db/queries/posts';
import { User } from 'src/lib/db/schema';

export async function handlerBrowse(
  cmdName: string,
  user: User,
  ...args: string[]
) {
  if (args.length > 1) {
    throw new Error(`usage: ${cmdName} <limit (optional, default 2)>`);
  }

  let limit = parseInt(args[0], 10);
  if (isNaN(limit)) {
    limit = 2;
  }

  const posts = await getPostsForUser(user.id, limit);
  if (posts.length === 0) {
    console.log('No posts found. Follow some feeds to see posts.');
    return;
  }

  console.log(`Showing ${posts.length} posts:`);
  for (const post of posts) {
    console.log(`- ${post.title} (${post.url})`);
  }
}
