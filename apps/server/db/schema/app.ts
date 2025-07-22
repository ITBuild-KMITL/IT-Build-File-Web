import { relations, sql } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { usersTable } from "./user";

export const appTable = sqliteTable("app", {
  id: int().primaryKey({ autoIncrement: true }),
  token : text().unique().notNull(),
  name: text().notNull(),
  description: text(),
  isSuspended: int({ mode: "boolean" }).default(false),
  createdAt: int({ mode: "timestamp" }).default(sql`(unixepoch('now'))`),
  updatedAt: int({ mode: "timestamp" }).default(sql`(unixepoch('now'))`),
  deletedAt: int({ mode: "timestamp" }),
});

