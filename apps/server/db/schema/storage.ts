import { relations, sql } from "drizzle-orm";
import { sqliteTable , int , text } from "drizzle-orm/sqlite-core";
import { accountTable } from "./account";

export const storageTable = sqliteTable("storage", {
    id: int().primaryKey({ autoIncrement: true }),
    accountType: text({enum: ["account", "app"]}).notNull().default("account"),
    accountId: int().notNull(),
    fileName : text().notNull(),
    path: text().notNull(),
    createdAt: int({ mode: "timestamp" }).default(sql`(unixepoch('now'))`),
    deletedAt: int({ mode: "timestamp" }),
});

export const storageRelationTable = relations(storageTable, ({ one }) => ({
    account: one(accountTable, {
        fields: [storageTable.accountId],
        references: [accountTable.id]
    })
}))