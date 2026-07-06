import { NextRequest, NextResponse } from "next/server";
import { generateArticle } from "@/content/generator/article-generator";
import { notifySearchEngines } from "@/content/distribution/social-publisher";

/**
 * POST /api/ai/generate-article
 *
 * 手动触发 AI 文章生成
 * Body: { topic, type, keywords, category?, model? }
 *
 * 需要设置环境变量 ANTHROPIC_API_KEY
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 简单鉴权（防止滥用）
    const authToken = request.headers.get("x-api-key");
    const expectedToken = process.env.CRON_SECRET || "toolstation-cron-secret";
    if (authToken !== expectedToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!body.topic || !body.keywords || !Array.isArray(body.keywords)) {
      return NextResponse.json(
        { error: "缺少必填参数: topic, keywords" },
        { status: 400 },
      );
    }

    const result = await generateArticle({
      topic: body.topic,
      type: body.type || "knowledge",
      keywords: body.keywords,
      category: body.category,
      model: body.model,
    });

    if (result.success) {
      // 通知搜索引擎收录新文章
      const siteUrl = process.env.SITE_URL || "https://gongjup.com";
      await notifySearchEngines([`${siteUrl}/blog/${result.slug}`]);

      return NextResponse.json(result);
    }

    return NextResponse.json(result, { status: 422 });
  } catch (error) {
    return NextResponse.json(
      { error: `请求处理失败: ${error instanceof Error ? error.message : "未知错误"}` },
      { status: 500 },
    );
  }
}
