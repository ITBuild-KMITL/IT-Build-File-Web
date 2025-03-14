import { relations, sql } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { accountTable } from "./account";

export const usersTable = sqliteTable("user", {
    id: int().primaryKey({ autoIncrement: true }),
    accountId: int().notNull().references(() => accountTable.id),
    email: text().unique().notNull(),
    userProfileURL: text(),
    firstName: text(),
    lastName: text(),
    createdAt: int({ mode: "timestamp" }).default(sql`(unixepoch('now'))`),
    updatedAt: int({ mode: "timestamp" }).default(sql`(unixepoch('now'))`),
});

export const usersRelationTable = relations(usersTable, ({ one }) => ({
    account: one(accountTable, {
        fields: [usersTable.accountId],
        references: [accountTable.id]
    })
}))