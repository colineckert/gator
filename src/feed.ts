import { XMLParser } from "fast-xml-parser";

type RSSFeed = {
  channel: {
    title: string;
    link: string;
    description: string;
    item: RSSItem[];
  };
};

type RSSItem = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
};

export async function fetchFeed(feedUrl: string): Promise<RSSFeed> {
  const res = await fetch(feedUrl, {
    headers: {
      "User-Agent": "gator",
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch feed from ${feedUrl}: ${res.statusText}`);
  }

  const feedText = await res.text();
  const parser = new XMLParser();
  const { rss } = parser.parse(feedText) as { rss?: RSSFeed };

  if (!rss?.channel || !rss?.channel?.item) {
    throw new Error(`Invalid RSS feed format from ${feedUrl}`);
  }

  const { channel } = rss;
  if (!channel.title || !channel.link || !channel.description) {
    throw new Error(
      `Missing required channel fields in RSS feed from ${feedUrl}`,
    );
  }

  const { title, link, description } = channel;
  if (!Array.isArray(channel.item)) {
    channel.item = [];
  }

  const validItems: RSSItem[] = [];

  for (const item of channel.item) {
    if (!item.title || !item.link || !item.description || !item.pubDate) {
      console.warn(
        `Skipping item with missing required fields in RSS feed from ${feedUrl}: ${JSON.stringify(item)}`,
      );
      continue;
    }

    const {
      title: itemTitle,
      link: itemLink,
      description: itemDescription,
      pubDate,
    } = item;
    validItems.push({
      title: itemTitle,
      link: itemLink,
      description: itemDescription,
      pubDate,
    });
  }

  return {
    channel: {
      title,
      link,
      description,
      item: validItems,
    },
  };
}
