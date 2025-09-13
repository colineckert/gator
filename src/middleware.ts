import type { CommandHandler, UserCommandHandler } from "src/commands";
import { readConfig } from "src/config";
import { getUserByName } from "src/lib/db/queries/users";

export const middlewareLoggedIn = (
  handler: UserCommandHandler,
): CommandHandler => {
  return async (cmdName: string, ...args: string[]) => {
    const config = readConfig();
    if (!config.currentUserName) {
      throw new Error(`No user is currently logged in. Please log in first.`);
    }

    const user = await getUserByName(config.currentUserName);
    if (!user) {
      throw new Error(`User ${config.currentUserName} not found`);
    }

    await handler(cmdName, user, ...args);
  };
};
