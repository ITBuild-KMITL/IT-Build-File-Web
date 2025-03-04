import { sql } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const usersTable = sqliteTable("account", {
    id: int().primaryKey({ autoIncrement: true }),
    googleId: text().unique().notNull(),
    userId : text().unique(),
    createdAt : int({mode : "timestamp"}).default(sql`(unixepoch('now'))`)
  });
  