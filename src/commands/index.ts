import { setUser } from 'src/config';

export type CommandHandler = (cmdName: string, ...args: string[]) => void;
export type CommandsRegistry = Record<string, CommandHandler>;

export function registerCommand(
  registry: CommandsRegistry,
  cmdName: string,
  handler: CommandHandler
) {
  registry[cmdName] = handler;
}

export function runCommand(
  registry: CommandsRegistry,
  cmdName: string,
  ...args: string[]
) {
  const handler = registry[cmdName];
  if (!handler) {
    throw new Error(`Command not found: ${cmdName}`);
  }
  handler(cmdName, ...args);
}

export function handlerLogging(cmdName: string, ...args: string[]) {
  if (args.length === 0) {
    throw new Error(`No arguments provided for command: ${cmdName}`);
  }

  const username = args[0];
  setUser(username);
  console.log(`User set to: ${username}`);
}
