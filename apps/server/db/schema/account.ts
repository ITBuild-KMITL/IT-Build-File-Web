import { relations, sql } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { usersTable } from "./user";

export const accountTable = sqliteTable("account", {
  id: int().primaryKey({ autoIncrement: true }),
  googleId: text().unique().notNull(),
  userId: int().unique(),
  isSuspended: int({ mode: "boolean" }).default(false),
  createdAt: int({ mode: "timestamp" }).default(sql`(unixepoch('now'))`),
  updatedAt: int({ mode: "timestamp" }).default(sql`(unixepoch('now'))`),
  deletedAt: int({ mode: "timestamp" }),
});

export const accountRelationTable = relations(accountTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [accountTable.userId],
    references: [usersTable.id]
  })
}))
