import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

// 工具使用统计
export const toolsUsage = sqliteTable("tools_usage", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  toolSlug: text("tool_slug").notNull(),
  date: text("date").notNull(), // YYYY-MM-DD
  usageCount: integer("usage_count").notNull().default(0),
  uniqueVisitors: integer("unique_visitors").notNull().default(0),
  avgDuration: integer("avg_duration").default(0), // 平均使用时长秒
});

// SEO 文章
export const articles = sqliteTable("articles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  content: text("content").notNull(), // Markdown 全文
  keywords: text("keywords").notNull(), // JSON 数组
  category: text("category").notNull(),
  status: text("status").notNull().default("draft"), // draft | published | archived
  aiModel: text("ai_model"),
  aiPrompt: text("ai_prompt"),
  wordCount: integer("word_count").default(0),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
  publishedAt: text("published_at"),
});

// 关键词库
export const keywords = sqliteTable("keywords", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  keyword: text("keyword").notNull().unique(),
  searchVolume: integer("search_volume"),
  difficulty: integer("difficulty"), // 1-100
  targetArticleId: integer("target_article_id"),
  status: text("status").notNull().default("researched"), // researched | targeting | ranking | abandoned
  currentRank: integer("current_rank"),
  lastChecked: text("last_checked"),
});

// 社交媒体分发记录
export const socialDistributions = sqliteTable("social_distributions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  articleId: integer("article_id").notNull(),
  platform: text("platform").notNull(), // zhihu | xiaohongshu | v2ex
  url: text("url"),
  status: text("status").notNull().default("pending"), // pending | posted | failed
  views: integer("views").default(0),
  postedAt: text("posted_at"),
});

// 广告展示统计
export const adImpressions = sqliteTable("ad_impressions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  date: text("date").notNull(),
  toolSlug: text("tool_slug"),
  adUnit: text("ad_unit").notNull(),
  impressions: integer("impressions").default(0),
  clicks: integer("clicks").default(0),
  revenue: real("revenue").default(0), // 收入(元)
});

// 站点配置
export const siteConfig = sqliteTable("site_config", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: text("updated_at"),
});
