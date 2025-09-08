import { db } from "..";
import { feeds } from "../schema";

export async function createFeed(url: string, name: string, userId: string) {
  const [result] = await db
    .insert(feeds)
    .values({ url, name, userId })
    .returning();
  return result;
}
