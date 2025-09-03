import {
  CommandsRegistry,
  handlerLogging,
  registerCommand,
  runCommand,
} from './commands';

function main() {
  const commands = {} as CommandsRegistry;
  registerCommand(commands, 'login', handlerLogging);

  const [command, username] = process.argv.slice(2);
  if (!command) {
    console.error('No command provided');
    process.exit(1);
  }
  if (command === 'login' && !username) {
    console.error('No username provided for login');
    process.exit(1);
  }

  runCommand(commands, 'login', username);
}

main();
