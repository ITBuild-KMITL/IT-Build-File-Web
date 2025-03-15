PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_account` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`googleId` text NOT NULL,
	`userId` integer,
	`isSuspended` integer DEFAULT false,
	`createdAt` integer DEFAULT (unixepoch('now')),
	`updatedAt` integer DEFAULT (unixepoch('now')),
	`deletedAt` integer
);
--> statement-breakpoint
INSERT INTO `__new_account`("id", "googleId", "userId", "isSuspended", "createdAt", "updatedAt", "deletedAt") SELECT "id", "googleId", "userId", "isSuspended", "createdAt", "updatedAt", "deletedAt" FROM `account`;--> statement-breakpoint
DROP TABLE `account`;--> statement-breakpoint
ALTER TABLE `__new_account` RENAME TO `account`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `account_googleId_unique` ON `account` (`googleId`);--> statement-breakpoint
CREATE UNIQUE INDEX `account_userId_unique` ON `account` (`userId`);