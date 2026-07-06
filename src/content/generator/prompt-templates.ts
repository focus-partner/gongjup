/**
 * AI 文章生成 Prompt 模板库
 *
 * 模板类型：
 * - tool-guide: 工具使用教程
 * - knowledge: 知识科普（如"个税怎么算"）
 * - comparison: 对比类（如"等额本息vs等额本金"）
 * - faq: 问答类
 */

/** 工具使用教程 Prompt */
export function toolGuidePrompt(toolName: string, keywords: string[]): string {
  return `你是一位资深的在线工具使用教程作者，擅长用通俗易懂的语言帮助普通人理解和使用工具。

请为"${toolName}"写一篇使用教程文章，需要覆盖以下关键词：${keywords.slice(0, 4).join("、")}。

文章要求：
- 标题包含核心关键词，格式为"【2025最新】${toolName}使用教程 — [吸引眼球的副标题]"
- 文章长度 1500-2500 字
- 开头先用 2-3 句话说明这个工具能解决什么问题
- 正文分 3-5 个小标题，每个小标题用 H2 格式
- 包含使用步骤说明（用有序列表）
- 包含 1-2 个实际使用场景的例子
- 结尾总结工具优势和适用人群
- 语言口语化、接地气，像在和朋友聊天
- 段落短小，多用列表，方便手机阅读
- 不要使用"首先、其次、最后"等模板化过渡词
- 在合适的地方自然提到"免费使用"、"无需下载"等卖点

输出格式：Markdown，不要包含除文章内容外的任何说明文字。`;
}

/** 知识科普 Prompt */
export function knowledgePrompt(topic: string, keywords: string[]): string {
  return `你是一位擅长把复杂知识讲得通俗易懂的科普作者。

请写一篇关于"${topic}"的科普文章，覆盖关键词：${keywords.slice(0, 4).join("、")}。

文章要求：
- 标题吸引人，包含核心关键词
- 长度 1500-2500 字
- 用"你可能不知道"或"一个简单的例子"这类方式开头
- 分 3-4 个小标题，H2 格式
- 用具体数字和实例让概念更容易理解
- 至少包含 1 个对比表格（如适用）
- 语言像在给朋友解释，不要学究腔
- 段落短，适合手机阅读
- 不要用"综上所述"这类模板化结尾

输出格式：Markdown，不含其他说明。`;
}

/** 对比类文章 Prompt */
export function comparisonPrompt(
  itemA: string,
  itemB: string,
  keywords: string[],
): string {
  return `你是一位客观中立的测评作者。

请写一篇"${itemA} vs ${itemB}"的对比文章，覆盖关键词：${keywords.slice(0, 4).join("、")}。

文章要求：
- 标题格式："${itemA}和${itemB}哪个好？2025年对比分析"
- 长度 1500-2500 字
- 开头说明为什么需要做这个对比
- 分维度对比（如适用：费用、操作难度、效率、适用场景等）
- 包含对比表格，一目了然
- 每个维度给出明确结论
- 结尾根据不同人群给出选择建议
- 客观中立，不偏袒

输出格式：Markdown，不含其他说明。`;
}

/** 文章质量检查 Prompt */
export function qualityCheckPrompt(article: string, keywords: string[]): string {
  return `你是一位严格的 SEO 内容审核员。请审核以下文章，按以下维度打分（1-100）：

1. 标题吸引力：是否包含关键词、是否吸引点击
2. 内容质量：信息是否准确、有价值、非泛泛而谈
3. SEO 优化：关键词密度是否合理、是否有合适的 H2/H3 结构
4. 可读性：段落长度、语言流畅度、适合移动阅读
5. AI 痕迹：是否读起来像 AI 写的套话

规则：
- 总分 > 80 分：可以发布
- 总分 60-80：需要修改后发布
- 总分 < 60：重新生成

文章内容：
---
${article}
---

目标关键词：${keywords.join("、")}

请只输出 JSON 格式：
{
  "totalScore": 85,
  "scores": { "title": 80, "quality": 85, "seo": 90, "readability": 85, "aiTraces": 15 },
  "feedback": "简短的评价",
  "recommendation": "publish" | "revise" | "regenerate"
}`;
}
