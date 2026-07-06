/**
 * 关键词研究模块
 *
 * 策略：
 * 1. 种子关键词来自 tools.config.ts（每个工具都有预设关键词）
 * 2. 通过 AI 扩展长尾词
 * 3. 评估搜索量和竞争度
 * 4. 写入 keywords 表，按优先级排期
 */

import { tools } from "../../../config/tools.config";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";

export interface KeywordResult {
  keyword: string;
  searchVolume: number;
  difficulty: number;
  intent: "informational" | "navigational" | "transactional";
  priority: number;
}

/**
 * 从工具配置中提取所有种子关键词
 */
export function getSeedKeywords(): string[] {
  const keywords = new Set<string>();
  for (const tool of tools) {
    for (const kw of tool.keywords) {
      keywords.add(kw);
    }
  }
  return Array.from(keywords);
}

/**
 * 通过 AI 扩展长尾关键词
 */
export async function expandKeywords(
  seedKeyword: string,
  apiKey: string,
): Promise<string[]> {
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        system: `你是一位中文 SEO 关键词研究专家。给定一个种子关键词，生成 15-20 个中文长尾关键词，涵盖信息型、导航型、交易型三种搜索意图。每个关键词估算月搜索量和竞争度（低/中/高）。请只输出 JSON 数组格式：[{"keyword": "...", "volume": 1000, "difficulty": "low"}]。`,
        messages: [{ role: "user", content: `种子关键词: "${seedKeyword}"` }],
        max_tokens: 2000,
      }),
    });

    if (!response.ok) return [];

    const data = await response.json();
    const text = data.content?.[0]?.text || "";
    const jsonMatch = text.match(/\[[\s\S]*\]/);

    if (jsonMatch) {
      const results = JSON.parse(jsonMatch[0]);
      return results.map((r: { keyword: string }) => r.keyword);
    }

    return [];
  } catch {
    return [];
  }
}

/**
 * 同步关键词到数据库
 * 新关键词状态为 "researched"，等待文章生成
 */
export async function syncKeywordsToDB(): Promise<number> {
  const seedKeywords = getSeedKeywords();
  let inserted = 0;

  for (const kw of seedKeywords) {
    try {
      // 检查是否已存在
      const existing = await db
        .select({ id: schema.keywords.id })
        .from(schema.keywords)
        .where(eq(schema.keywords.keyword, kw))
        .limit(1);

      if (existing.length === 0) {
        await db.insert(schema.keywords).values({
          keyword: kw,
          searchVolume: estimateVolume(kw),
          difficulty: estimateDifficulty(kw),
          status: "researched",
          lastChecked: new Date().toISOString(),
        });
        inserted++;
      }
    } catch {
      // 跳过重复
    }
  }

  return inserted;
}

/** 估算搜索量（基于关键词长度和热度，粗略估算） */
function estimateVolume(keyword: string): number {
  const len = keyword.length;
  if (len <= 4) return 5000;
  if (len <= 7) return 2000;
  if (len <= 10) return 800;
  return 300;
}

/** 估算竞争度（1-100） */
function estimateDifficulty(keyword: string): number {
  const len = keyword.length;
  if (len <= 3) return 85;
  if (len <= 5) return 65;
  if (len <= 8) return 40;
  return 25;
}

/**
 * 获取优先级最高的待覆盖关键词
 */
export async function getTopUncoveredKeywords(limit = 5): Promise<
  { id: number; keyword: string; priority: number }[]
> {
  const results = await db
    .select({
      id: schema.keywords.id,
      keyword: schema.keywords.keyword,
      searchVolume: schema.keywords.searchVolume,
      difficulty: schema.keywords.difficulty,
    })
    .from(schema.keywords)
    .where(eq(schema.keywords.status, "researched"))
    .orderBy(schema.keywords.searchVolume)
    .limit(limit)
    .all();

  // 计算优先级：搜索量 / 难度
  return results
    .map((r) => ({
      id: r.id,
      keyword: r.keyword,
      priority: Math.round(((r.searchVolume ?? 100) / (r.difficulty ?? 50)) * 100),
    }))
    .sort((a, b) => b.priority - a.priority);
}
