CREATE TABLE `ad_impressions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`date` text NOT NULL,
	`tool_slug` text,
	`ad_unit` text NOT NULL,
	`impressions` integer DEFAULT 0,
	`clicks` integer DEFAULT 0,
	`revenue` real DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE `articles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`content` text NOT NULL,
	`keywords` text NOT NULL,
	`category` text NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`ai_model` text,
	`ai_prompt` text,
	`word_count` integer DEFAULT 0,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`published_at` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `articles_slug_unique` ON `articles` (`slug`);--> statement-breakpoint
CREATE TABLE `keywords` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`keyword` text NOT NULL,
	`search_volume` integer,
	`difficulty` integer,
	`target_article_id` integer,
	`status` text DEFAULT 'researched' NOT NULL,
	`current_rank` integer,
	`last_checked` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `keywords_keyword_unique` ON `keywords` (`keyword`);--> statement-breakpoint
CREATE TABLE `site_config` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL,
	`updated_at` text
);
--> statement-breakpoint
CREATE TABLE `social_distributions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`article_id` integer NOT NULL,
	`platform` text NOT NULL,
	`url` text,
	`status` text DEFAULT 'pending' NOT NULL,
	`views` integer DEFAULT 0,
	`posted_at` text
);
--> statement-breakpoint
CREATE TABLE `tools_usage` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`tool_slug` text NOT NULL,
	`date` text NOT NULL,
	`usage_count` integer DEFAULT 0 NOT NULL,
	`unique_visitors` integer DEFAULT 0 NOT NULL,
	`avg_duration` integer DEFAULT 0
);
