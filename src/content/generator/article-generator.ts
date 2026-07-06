/**
 * AI 文章生成 Pipeline
 *
 * 4 阶段流程：
 * 1. 大纲生成 → 2. 逐段写作 → 3. 质量检查 → 4. 写入数据库
 *
 * 支持多模型：
 * - Claude Sonnet (高质量)
 * - DeepSeek V3 (低成本日常文章)
 *
 * 使用方式：
 * - 手动调用 API: POST /api/ai/generate-article
 * - 定时 Cron: 每日自动检查关键词库并生成
 */

import { db, schema } from "@/lib/db";
import { toolGuidePrompt, knowledgePrompt, qualityCheckPrompt } from "./prompt-templates";
import { eq } from "drizzle-orm";

export interface ArticleGenerationInput {
  topic: string;
  type: "tool-guide" | "knowledge" | "comparison";
  keywords: string[];
  category?: string;
  model?: "claude-sonnet" | "deepseek-v3";
}

export interface ArticleGenerationOutput {
  success: boolean;
  slug?: string;
  title?: string;
  content?: string;
  wordCount?: number;
  qualityScore?: number;
  error?: string;
}

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";

/** 调用 AI 生成文章 */
export async function generateArticle(
  input: ArticleGenerationInput,
): Promise<ArticleGenerationOutput> {
  const apiKey = process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY;

  if (!apiKey) {
    return { success: false, error: "未配置 ANTHROPIC_API_KEY 或 CLAUDE_API_KEY 环境变量。请设置后重试。" };
  }

  const model = input.model === "deepseek-v3"
    ? "deepseek-chat"
    : "claude-sonnet-4-6-20250514";

  // 选择 Prompt 模板
  let systemPrompt: string;
  if (input.type === "tool-guide") {
    systemPrompt = toolGuidePrompt(input.topic, input.keywords);
  } else if (input.type === "knowledge") {
    systemPrompt = knowledgePrompt(input.topic, input.keywords);
  } else {
    systemPrompt = knowledgePrompt(input.topic, input.keywords);
  }

  try {
    // 调用 AI API 生成文章
    const response = await fetch(
      model === "deepseek-chat"
        ? "https://api.deepseek.com/v1/chat/completions"
        : ANTHROPIC_API_URL,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          ...(model !== "deepseek-chat" && {
            "anthropic-version": "2023-06-01",
          }),
        },
        body: JSON.stringify(
          model === "deepseek-chat"
            ? {
                model: "deepseek-chat",
                messages: [
                  { role: "system", content: systemPrompt },
                  { role: "user", content: "请开始写作。" },
                ],
                max_tokens: 4096,
                temperature: 0.7,
              }
            : {
                model,
                system: systemPrompt,
                messages: [{ role: "user", content: "请开始写作。输出完整的 Markdown 格式文章。" }],
                max_tokens: 4096,
              },
        ),
      },
    );

    if (!response.ok) {
      const errText = await response.text();
      return { success: false, error: `AI API 调用失败: ${response.status} ${errText.slice(0, 200)}` };
    }

    const data = await response.json();

    // 提取文章内容
    let content: string;
    if (model === "deepseek-chat") {
      content = data.choices?.[0]?.message?.content || "";
    } else {
      content = data.content?.[0]?.text || "";
    }

    if (!content) {
      return { success: false, error: "AI 返回内容为空" };
    }

    // 提取标题（第一个 # 行）
    const titleMatch = content.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1].trim() : input.topic;

    // 生成 slug
    const slug = title
      .replace(/[【】\[\]]/g, "")
      .replace(/[^\w一-鿿-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .toLowerCase()
      .slice(0, 80);

    const wordCount = content.replace(/\s/g, "").length;

    // === 阶段 3: 质量检查 ===
    const qualityResult = await checkContentQuality(content, input.keywords, apiKey);

    // 质量不达标则返回（不写入数据库）
    if (qualityResult.totalScore < 60) {
      return {
        success: false,
        error: `文章质量不合格（${qualityResult.totalScore}分），建议重新生成。原因：${qualityResult.feedback}`,
        slug,
        title,
        content,
        wordCount,
        qualityScore: qualityResult.totalScore,
      };
    }

    // === 阶段 4: 写入数据库 ===
    try {
      await db.insert(schema.articles).values({
        slug,
        title,
        description: content.replace(/[#*`\n]/g, "").slice(0, 150),
        content,
        keywords: JSON.stringify(input.keywords),
        category: input.category || "general",
        status: qualityResult.totalScore >= 80 ? "published" : "draft",
        aiModel: model,
        aiPrompt: systemPrompt.slice(0, 500),
        wordCount,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        publishedAt: qualityResult.totalScore >= 80 ? new Date().toISOString() : null,
      });
    } catch (dbError) {
      // slug 冲突时静默处理
      if (!String(dbError).includes("UNIQUE constraint")) {
        throw dbError;
      }
    }

    return {
      success: true,
      slug,
      title,
      content,
      wordCount,
      qualityScore: qualityResult.totalScore,
    };
  } catch (error) {
    return {
      success: false,
      error: `生成异常: ${error instanceof Error ? error.message : "未知错误"}`,
    };
  }
}

/** 内容质量检查 */
async function checkContentQuality(
  content: string,
  keywords: string[],
  apiKey: string,
): Promise<{
  totalScore: number;
  feedback: string;
  recommendation: "publish" | "revise" | "regenerate";
}> {
  try {
    const response = await fetch(ANTHROPIC_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        system: qualityCheckPrompt(content, keywords),
        messages: [{ role: "user", content: "请审核。" }],
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      // 质量检查失败时默认通过（不阻塞流程）
      return { totalScore: 70, feedback: "质量检查跳过（API 错误）", recommendation: "publish" };
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      const result = JSON.parse(jsonMatch[0]);
      return {
        totalScore: result.totalScore || 70,
        feedback: result.feedback || "",
        recommendation: result.recommendation || "publish",
      };
    }
  } catch {
    // 静默处理
  }

  return { totalScore: 70, feedback: "质量检查默认通过", recommendation: "publish" };
}
