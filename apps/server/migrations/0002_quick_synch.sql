CREATE TABLE `storage` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`accountId` integer NOT NULL,
	`fileName` text NOT NULL,
	`path` text NOT NULL,
	`createdAt` integer DEFAULT (unixepoch('now')),
	`deletedAt` integer
);
