import { db } from "..";
import { users } from "../schema";
import { eq } from "drizzle-orm";

export async function createUser(name: string) {
  const [result] = await db.insert(users).values({ name: name }).returning();
  return result;
}

export async function getUserByName(name: string) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.name, name))
    .limit(1);
  return user || null;
}

// export async function getUserByName(name: string) {
//   const users = await db.query.users.findMany({
//     where: (user, { eq }) => eq(user.name, name),
//   });
//   return users.length > 0 ? users[0] : null;
// }
