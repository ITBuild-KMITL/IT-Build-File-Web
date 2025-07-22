CREATE TABLE `app` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`token` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`isSuspended` integer DEFAULT false,
	`createdAt` integer DEFAULT (unixepoch('now')),
	`updatedAt` integer DEFAULT (unixepoch('now')),
	`deletedAt` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `app_token_unique` ON `app` (`token`);