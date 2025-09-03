import { readConfig, setUser } from './config';

function main() {
  setUser('Colin Eckert');
  const updatedConfig = readConfig();
  console.log(updatedConfig);
}

main();
