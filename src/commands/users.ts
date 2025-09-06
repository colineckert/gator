import { createUser, getUserByName } from "src/lib/db/queries/users";
import { setUser } from "../config";

export async function handlerLogin(cmdName: string, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <name>`);
  }

  const userName = args[0];
  const user = await getUserByName(userName);
  if (!user) {
    throw new Error(`User with name "${userName}" does not exist.`);
  }

  setUser(userName);
  console.log(`${userName} logged in successfully.`);
}

export async function handlerRegister(cmdName: string, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <name>`);
  }

  const userName = args[0];
  const existingUser = await getUserByName(userName);
  if (existingUser) {
    throw new Error(`User with name "${userName}" already exists.`);
  }

  const user = await createUser(userName);
  setUser(user.name);
  console.log("User created successfully:", user);
}
