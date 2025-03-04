CREATE TABLE `account` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`googleId` text NOT NULL,
	`userId` text,
	`createdAt` integer DEFAULT (unixepoch('now'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `account_googleId_unique` ON `account` (`googleId`);--> statement-breakpoint
CREATE UNIQUE INDEX `account_userId_unique` ON `account` (`userId`);