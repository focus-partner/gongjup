import { NextRequest, NextResponse } from "next/server";
import { generateArticle } from "@/content/generator/article-generator";
import { getTopUncoveredKeywords, syncKeywordsToDB } from "@/content/research/keyword-research";
import { notifySearchEngines } from "@/content/distribution/social-publisher";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";

/**
 * GET /api/cron/daily-generate
 *
 * 每日定时任务（建议通过外部 Cron 服务如 cron-job.org 调用）
 * 1. 同步关键词库
 * 2. 取优先级最高的 3 个关键词
 * 3. 为每个关键词生成一篇文章
 * 4. 推送到搜索引擎
 *
 * 鉴权：x-api-key header 或 URL 参数 ?secret=xxx
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret") || request.headers.get("x-api-key");
  const expectedSecret = process.env.CRON_SECRET || "toolstation-cron-secret";

  if (secret !== expectedSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "未配置 AI API Key（ANTHROPIC_API_KEY 或 CLAUDE_API_KEY）" },
      { status: 500 },
    );
  }

  const results: {
    keyword: string;
    success: boolean;
    slug?: string;
    score?: number;
    error?: string;
  }[] = [];

  try {
    // Step 1: 同步关键词库
    const syncedCount = await syncKeywordsToDB();

    // Step 2: 获取优先级最高的关键词
    const topKeywords = await getTopUncoveredKeywords(3);

    if (topKeywords.length === 0) {
      return NextResponse.json({
        message: "没有待覆盖的关键词",
        keywordsSynced: syncedCount,
        results: [],
      });
    }

    // Step 3: 逐个生成文章
    const siteUrl = process.env.SITE_URL || "https://gongjup.com";
    const newUrls: string[] = [];

    for (const kw of topKeywords) {
      const result = await generateArticle({
        topic: kw.keyword,
        type: "knowledge",
        keywords: [kw.keyword],
        category: "auto-generated",
      });

      results.push({
        keyword: kw.keyword,
        success: result.success,
        slug: result.slug,
        score: result.qualityScore,
        error: result.error,
      });

      // 更新关键词状态
      if (result.success) {
        await db
          .update(schema.keywords)
          .set({
            status: "targeting",
            targetArticleId: undefined, // 后续可通过 slug 关联
            lastChecked: new Date().toISOString(),
          })
          .where(eq(schema.keywords.id, kw.id));

        newUrls.push(`${siteUrl}/blog/${result.slug}`);
      }
    }

    // Step 4: 通知搜索引擎
    if (newUrls.length > 0) {
      await notifySearchEngines(newUrls);
    }

    return NextResponse.json({
      message: `已处理 ${topKeywords.length} 个关键词`,
      keywordsSynced: syncedCount,
      articlesGenerated: results.filter((r) => r.success).length,
      results,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: `定时任务执行异常: ${error instanceof Error ? error.message : "未知错误"}`,
        partialResults: results,
      },
      { status: 500 },
    );
  }
}
