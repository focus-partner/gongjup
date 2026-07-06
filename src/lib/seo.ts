/**
 * SEO 工具库
 * - 百度主动推送（加速收录）
 * - 生成 SEO 友好的 meta 标签
 * - 关键词密度计算
 */

const BAIDU_PUSH_URL = "http://data.zz.baidu.com/urls";

/**
 * 向百度主动推送 URL（加速收录）
 *
 * 使用前提：
 * 1. 在百度站长平台 (ziyuan.baidu.com) 验证站点
 * 2. 在「普通收录 → 主动推送」获取 token
 * 3. 将 token 设置到环境变量 BAIDU_PUSH_TOKEN
 */
export async function pushToBaidu(urls: string[]): Promise<{
  success: boolean;
  pushed: number;
  message: string;
}> {
  const siteUrl = process.env.SITE_URL;
  const token = process.env.BAIDU_PUSH_TOKEN;

  if (!siteUrl || !token) {
    return {
      success: false,
      pushed: 0,
      message: "未配置 SITE_URL 或 BAIDU_PUSH_TOKEN 环境变量",
    };
  }

  try {
    const apiUrl = `${BAIDU_PUSH_URL}?site=${encodeURIComponent(siteUrl)}&token=${token}`;
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: urls.join("\n"),
    });

    const data = await response.json();

    // 百度返回格式: { "remain": 剩余配额, "success": 成功数量 }
    return {
      success: data.success > 0 || data.success_mip > 0,
      pushed: data.success || 0,
      message: `成功推送 ${data.success || 0} 条，剩余配额 ${data.remain ?? "未知"}`,
    };
  } catch (error) {
    return {
      success: false,
      pushed: 0,
      message: `推送失败: ${error instanceof Error ? error.message : "网络错误"}`,
    };
  }
}

/**
 * 向 Bing 提交 URL（通过 IndexNow 协议）
 */
export async function pushToBing(urls: string[]): Promise<boolean> {
  const siteUrl = process.env.SITE_URL;
  if (!siteUrl) return false;

  try {
    const apiKey = process.env.INDEXNOW_KEY || "default-key";
    await fetch("https://www.bing.com/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        host: new URL(siteUrl).host,
        key: apiKey,
        urlList: urls,
      }),
    });
    return true;
  } catch {
    return false;
  }
}

/**
 * 生成 title 标签（SEO 优化格式）
 * 格式: [工具名]在线免费 - [核心词1] | [核心词2] - [品牌名]
 */
export function seoTitle(toolName: string, keywords: string[]): string {
  const topKeywords = keywords.slice(0, 2).join(" | ");
  return `${toolName}在线免费 - ${topKeywords} - 工具派`;
}

/**
 * 生成 description meta 标签
 */
export function seoDescription(
  toolName: string,
  description: string,
  keyword: string,
): string {
  return `${toolName}，${description}。搜索${keyword}找到本工具，免费使用无需下载。`;
}

/**
 * 计算文本关键词密度（用于 SEO 内容优化）
 */
export function keywordDensity(
  text: string,
  keyword: string,
): { count: number; density: number } {
  const words = text.replace(/\s+/g, "").length;
  const regex = new RegExp(keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g");
  const count = (text.match(regex) || []).length;
  return {
    count,
    density: words > 0 ? Math.round((count * keyword.length / words) * 10000) / 100 : 0,
  };
}
