// drizzle.config.ts

import { defineConfig } from "drizzle-kit";
import fs from "fs";
import path from "path";
import { config } from "dotenv";
import { execSync } from "child_process";

config({
  path: ".env.cloudflare",
});

function generateLocalD1DB(isInitial = true): string {
  if (!isInitial) {
    throw new Error(
      "Unknown error occured while creating a local D1 database."
    );
  }

  const command = `pnpm wrangler d1 execute it-build-file --local --command="PRAGMA table_list"`;

  try {
    execSync(command);
    return getLocalD1DB(false);
  } catch (err) {
    console.error("Failed to create local D1 database.");
    throw err;
  }
}

function getLocalD1DB(isInitial = true): string {
  const basePath = path.resolve(".wrangler");
  const exists = fs.existsSync(basePath);
  if (!exists) {
    // dir not exists
    return generateLocalD1DB(isInitial);
  }
  const dbFile = fs
    .readdirSync(basePath, { encoding: "utf-8", recursive: true })
    .find((f) => f.endsWith(".sqlite"));

  if (!dbFile) {
    // file not exists
    return generateLocalD1DB(isInitial);
  }

  const url = path.resolve(basePath, dbFile);
  return url;
}

export default defineConfig({
  dialect: "sqlite",
  schema: "./db/db.ts",
  out: "./migrations",
  ...(process.env.NODE_ENV === "production"
    ? {
        driver: "d1-http",
        dbCredentials: {
          accountId: process.env.CLOUDFLARE_D1_ACCOUNT_ID,
          databaseId: process.env.CLOUDFLARE_D1_DB_ID,
          token: process.env.CLOUDFLARE_D1_API_TOKEN,
        },
      }
    : {
        dbCredentials: {
          url: getLocalD1DB(),
        },
      }),
});