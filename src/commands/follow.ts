import { readConfig } from "src/config";
import { getFeedByUrl } from "src/lib/db/queries/feeds";
import {
  createFeedFollow,
  getFeedFollowsForUser,
} from "src/lib/db/queries/follows";
import { getUserByName } from "src/lib/db/queries/users";

export async function handlerFollow(cmdName: string, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <url>`);
  }

  const url = args[0];
  console.log(`Following URL: ${url}`);

  const config = readConfig();
  const user = await getUserByName(config.currentUserName);
  if (!user) {
    throw new Error(`User ${config.currentUserName} not found`);
  }

  const feed = await getFeedByUrl(url);
  if (!feed) {
    throw new Error(`Feed with URL ${url} not found`);
  }

  const feedFollow = await createFeedFollow(user.id, feed.id);
  console.log(
    `${feedFollow.users.name} successfully followed ${feedFollow.feeds.name}`,
  );
}

export async function handlerFollowing(cmdName: string, ...args: string[]) {
  if (args.length !== 0) {
    throw new Error(`usage: ${cmdName}`);
  }

  const config = readConfig();
  const user = await getUserByName(config.currentUserName);
  if (!user) {
    throw new Error(`User ${config.currentUserName} not found`);
  }

  const userFollows = await getFeedFollowsForUser(user.id);

  console.log(`Feeds followed by ${user.name}:`);
  for (const feedFollow of userFollows) {
    console.log(`* ${feedFollow.feeds.name} (${feedFollow.feeds.url})`);
  }
}
