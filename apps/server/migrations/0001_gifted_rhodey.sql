CREATE TABLE `user` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`accountId` integer NOT NULL,
	`email` text NOT NULL,
	`userProfileURL` text,
	`firstName` text,
	`lastName` text,
	`createdAt` integer DEFAULT (unixepoch('now')),
	`updatedAt` integer DEFAULT (unixepoch('now')),
	FOREIGN KEY (`accountId`) REFERENCES `account`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
ALTER TABLE `account` ADD `isSuspended` integer DEFAULT false;--> statement-breakpoint
ALTER TABLE `account` ADD `updatedAt` integer DEFAULT (unixepoch('now'));--> statement-breakpoint
ALTER TABLE `account` ADD `deletedAt` integer;