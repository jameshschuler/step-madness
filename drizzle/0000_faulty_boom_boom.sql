CREATE TABLE `challenges` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`start_date` integer NOT NULL,
	`end_date` integer NOT NULL,
	`slug` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `challenges_slug_unique` ON `challenges` (`slug`);--> statement-breakpoint
CREATE TABLE `daily_performance` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`player_id` integer NOT NULL,
	`date` text NOT NULL,
	`step_count` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`player_id`) REFERENCES `players`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `player_date_idx` ON `daily_performance` (`player_id`,`date`);--> statement-breakpoint
CREATE TABLE `leaderboard` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`challenge_id` integer,
	`team_id` integer,
	`wins` integer DEFAULT 0,
	`losses` integer DEFAULT 0,
	`total_points` integer DEFAULT 0,
	`cumulative_steps` integer DEFAULT 0,
	`last_updated` integer,
	FOREIGN KEY (`challenge_id`) REFERENCES `challenges`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`team_id`) REFERENCES `teams`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `matchup_results` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`matchup_id` integer,
	`team1_total_steps` integer DEFAULT 0,
	`team2_total_steps` integer DEFAULT 0,
	`team1_points` integer DEFAULT 0,
	`team2_points` integer DEFAULT 0,
	`is_finalized` integer DEFAULT false,
	FOREIGN KEY (`matchup_id`) REFERENCES `matchups`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `matchups` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`challenge_id` integer,
	`team1_id` integer,
	`team2_id` integer,
	`start_date` integer NOT NULL,
	`end_date` integer NOT NULL,
	`week_number` integer,
	`round_number` integer,
	`is_playoff` integer DEFAULT false,
	`seed_1` integer,
	`seed_2` integer,
	`status` text DEFAULT 'pending',
	FOREIGN KEY (`challenge_id`) REFERENCES `challenges`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`team1_id`) REFERENCES `teams`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`team2_id`) REFERENCES `teams`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `players` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`avatar` text,
	`step_up_id` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `players_step_up_id_unique` ON `players` (`step_up_id`);--> statement-breakpoint
CREATE TABLE `team_players` (
	`team_id` integer NOT NULL,
	`player_id` integer NOT NULL,
	PRIMARY KEY(`team_id`, `player_id`),
	FOREIGN KEY (`team_id`) REFERENCES `teams`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`player_id`) REFERENCES `players`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `teams` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`avatar` text
);
