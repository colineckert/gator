import { readConfig } from 'src/config';
import { createFeed, getFeeds } from 'src/lib/db/queries/feeds';
import { createFeedFollow } from 'src/lib/db/queries/follows';
import { getUserById, getUserByName } from 'src/lib/db/queries/users';
import type { Feed, User } from 'src/lib/db/schema';

function printFeed(feed: Feed, user: User) {
  console.log(`* ID:            ${feed.id}`);
  console.log(`* Created:       ${feed.createdAt}`);
  console.log(`* Updated:       ${feed.updatedAt}`);
  console.log(`* name:          ${feed.name}`);
  console.log(`* URL:           ${feed.url}`);
  console.log(`* User:          ${user.name}`);
}

export async function handlerAddFeed(
  cmdName: string,
  user: User,
  ...args: string[]
) {
  if (args.length !== 2) {
    throw new Error(`usage: ${cmdName} <feed_name> <url>`);
  }

  const feedName = args[0];
  const url = args[1];
  const feed = await createFeed(url, feedName, user.id);
  if (!feed) {
    throw new Error(`Failed to create feed`);
  }

  console.log('Feed created successfully:');
  printFeed(feed, user);

  const feedFollow = await createFeedFollow(user.id, feed.id);
  console.log(
    `${feedFollow.users.name} successfully followed ${feedFollow.feeds.name}`
  );
}

export async function handlerFeeds(cmdName: string, ...args: string[]) {
  if (args.length !== 0) {
    throw new Error(`usage: ${cmdName}`);
  }

  const feeds = await getFeeds();
  if (feeds.length === 0) {
    console.log('No feeds found.');
    return;
  }

  for (const feed of feeds) {
    const user = await getUserById(feed.userId);
    if (!user) {
      console.log(`* Feed ID: ${feed.id} (User not found)`);
      continue;
    }
    printFeed(feed, user);
  }
  console.log(`Total feeds: ${feeds.length}`);
}
