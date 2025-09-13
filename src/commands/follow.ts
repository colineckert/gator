import { readConfig } from "src/config";
import { getFeedByUrl } from "src/lib/db/queries/feeds";
import {
  createFeedFollow,
  deleteFeedFollow,
  getFeedFollowsForUser,
} from "src/lib/db/queries/follows";
import { User } from "src/lib/db/schema";

export async function handlerFollow(
  cmdName: string,
  user: User,
  ...args: string[]
) {
  if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <url>`);
  }

  const url = args[0];
  console.log(`Following URL: ${url}`);

  const feed = await getFeedByUrl(url);
  if (!feed) {
    throw new Error(`Feed with URL ${url} not found`);
  }

  const feedFollow = await createFeedFollow(user.id, feed.id);
  console.log(
    `${feedFollow.users.name} successfully followed ${feedFollow.feeds.name}`,
  );
}

export async function handlerFollowing(
  cmdName: string,
  user: User,
  ...args: string[]
) {
  if (args.length !== 0) {
    throw new Error(`usage: ${cmdName}`);
  }

  const userFollows = await getFeedFollowsForUser(user.id);

  console.log(`Feeds followed by ${user.name}:`);
  for (const feedFollow of userFollows) {
    console.log(`* ${feedFollow.feeds.name} (${feedFollow.feeds.url})`);
  }
}

export async function handlerUnfollow(
  cmdName: string,
  user: User,
  ...args: string[]
) {
  if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <url>`);
  }

  const url = args[0];
  console.log(`Unfollowing URL: ${url}`);

  const success = await deleteFeedFollow(user.id, url);
  if (success) {
    console.log(`Successfully unfollowed feed with URL ${url}`);
  } else {
    console.log(`You were not following a feed with URL ${url}`);
  }
}
