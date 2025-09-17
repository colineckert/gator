Gator

Lightweight CLI for following and browsing RSS feeds backed by Postgres and Drizzle ORM.

## Overview

`gator` is a small command-line application written in TypeScript. It provides commands to register/login users, manage feeds, follow/unfollow users, aggregate posts, and browse content. The CLI reads a JSON config file from your home directory to find the database connection and the currently active user.

This README explains what you need to run the CLI, how to create the configuration file, and shows a few example commands.

## Prerequisites

- Node.js (16+ recommended) and npm or a compatible package manager.
- A Postgres database accessible from where you run the CLI.
- The project dependencies installed. From the repository root run:

```zsh
npm install
```

- Build/run helper `tsx` is used in `package.json` scripts; the `start` script uses it.

## Configuration

`gator` expects a JSON config file named `.gatorconfig.json` in your home directory. The file must contain two keys:

- `db_url` — the Postgres connection string (for example `postgres://user:pass@localhost:5432/dbname`).
- `current_user_name` — the username to treat as the currently logged-in user for commands that require authentication.

Example `~/.gatorconfig.json`:

```json
{
  "db_url": "postgres://gator:gatorpass@localhost:5432/gatordb",
  "current_user_name": "alice"
}
```

Notes:

- The config file is read and validated by `src/config.ts`. If either key is missing or not a string the CLI will throw an error.
- You can change the active user programmatically by calling the exported `setUser` from `src/config.ts` or by editing the file manually.

## Running the CLI

From the repository root you can run the CLI using the npm script defined in `package.json`:

```zsh
npm start -- <command> [args...]
```

The `--` separates npm arguments from the CLI arguments. Alternatively you can run `tsx` directly if you have it installed globally:

```zsh
npx tsx ./src/index.ts <command> [args...]
```

If you call the program with no command it will print a usage message and exit.

## Built-in commands (examples)

The CLI registers commands in `src/index.ts`. Here are a few useful ones:

- `register <username>` — create a new user in the database.
- `login <username>` — set or validate the currently active user (the code exposes a `login` handler).
- `reset` — reset or reinitialize some state (see `src/commands/reset.ts`).
- `users` — list users.
- `addfeed <feedUrl>` — add a new feed for the current user (requires `current_user_name` to be set).
- `feeds` — list feeds in the system.
- `follow <username>` — follow another user (requires logged-in user).
- `unfollow <username>` — unfollow a user (requires logged-in user).
- `following` — list who the current user is following.
- `agg` — run the aggregation process (likely fetches and stores posts from feeds).
- `browse` — browse content; this command is guarded by middleware that requires a logged-in user.

Examples:

```zsh
# Register a user named bob
npm run start register bob

# Set current user to bob (login)
npm run start login bob

# Add a feed for the logged-in user
npm run start addfeed https://example.com/feed.xml

# Aggregate posts (pull new items from feeds)
npm run start agg

# List feeds
npm run start feeds

# List followed feeds
npm run start following
```

## Database and migrations

This project uses Drizzle ORM and includes a `drizzle.config.ts` and SQL migrations under `src/lib/db/migrations/`. Two helper scripts are present in `package.json`:

- `npm run generate` — run `drizzle-kit generate` to generate schema artifacts.
- `npm run migrate` — run `drizzle-kit migrate` to apply migrations.

Before running the CLI against a clean database, ensure your Postgres server is running and apply migrations:

```zsh
# generate artifacts
npm run generate

# run migrations
npm run migrate
```

If you don't have `drizzle-kit` installed globally, the npm scripts will use the local devDependency.

## Edge cases and troubleshooting

- Missing config file: create `~/.gatorconfig.json` with the required keys.
- Invalid `db_url`: ensure the connection string is correct and the database accepts connections from your machine.
- Commands requiring authentication will throw if `current_user_name` is not set or if the user doesn't exist in the DB.
- If TypeScript or runtime errors appear, ensure dependencies are installed and `npm start` uses the local `tsx` binary.

## Development notes

- Source entrypoint: `src/index.ts` — this is the CLI bootstrapper and command registry.
- Commands live in `src/commands/*.ts`. Middleware that enforces login is in `src/middleware.ts`.
- Config handling is in `src/config.ts` and expects `~/.gatorconfig.json`.
