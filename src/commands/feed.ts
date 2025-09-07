import { fetchFeed } from "src/feed";

export async function handlerAgg(_: string) {
  const feed = await fetchFeed("https://www.wagslane.dev/index.xml");
  console.log("Fetched feed:", JSON.stringify(feed, null, 2));
}
