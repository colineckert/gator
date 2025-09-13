import { scrapeFeeds } from "src/feed";

function parseDuration(durationStr: string): number {
  const regex = /^(\d+)(ms|s|m|h)$/;
  const match = durationStr.match(regex);

  if (!match) {
    throw new Error(
      `Invalid duration format: ${durationStr}. Expected formats like '500ms', '10s', '5m', '2h'.`,
    );
  }

  const value = parseInt(match[1], 10);
  const unit = match[2];

  switch (unit) {
    case "ms":
      return value;
    case "s":
      return value * 1000;
    case "m":
      return value * 60 * 1000;
    case "h":
      return value * 60 * 60 * 1000;
    default:
      throw new Error(`Unknown time unit: ${unit}`);
  }
}

function handleError(err: unknown) {
  if (err instanceof Error) {
    console.error("Error during feed scraping:", err.message);
  } else {
    console.error("Unknown error during feed scraping:", err);
  }
  process.exit(1);
}

export async function handlerAgg(_: string, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error(`usage: agg <duration>`);
  }

  const durationStr = args[0];
  const durationMs = parseDuration(durationStr);
  console.log(`Collecting feeds every ${durationStr} (${durationMs} ms)`);

  scrapeFeeds().catch(handleError);

  const intervalId = setInterval(() => {
    scrapeFeeds().catch(handleError);
  }, durationMs);

  await new Promise<void>((resolve) => {
    process.on("SIGINT", () => {
      clearInterval(intervalId);
      console.log("Shutting down feed aggregator...");
      resolve();
    });
  });
}
