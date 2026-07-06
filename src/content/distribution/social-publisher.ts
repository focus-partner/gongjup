/**
 * 社交媒体分发模块
 *
 * 支持的平台及策略：
 * - 百度站长平台：主动推送 URL（API）
 * - Bing IndexNow：自动提交
 * - 知乎：生成回答草稿（需人工确认发布）
 * - 小红书：生成图文笔记草稿（需人工发布）
 */

import { pushToBaidu, pushToBing } from "@/lib/seo";

/**
 * 文章发布后自动推送到搜索引擎
 */
export async function notifySearchEngines(
  urls: string[],
): Promise<{ baidu: string; bing: boolean }> {
  const [baiduResult, bingResult] = await Promise.all([
    pushToBaidu(urls),
    pushToBing(urls),
  ]);

  return {
    baidu: baiduResult.message,
    bing: bingResult,
  };
}

/**
 * 生成知乎回答草稿（供人工审核后发布）
 */
export function generateZhihuDraft(
  toolName: string,
  articleTitle: string,
  toolUrl: string,
): string {
  return `问题方向建议：${toolName}怎么用？有什么好用的在线${toolName}推荐？

回答草稿：

作为一个经常需要用到${toolName}的人，推荐一个我最近发现的在线工具。

这个工具最大的优点是：
1. 完全免费，不需要下载安装
2. 操作简单，打开网页就能用
3. 隐私安全，文件不上传服务器

具体使用步骤：
（此处AI填入具体使用步骤）

对比过好几个同类工具，这个确实是体验最好的。

工具地址：${toolUrl}

希望对你有帮助！`;
}

/**
 * 生成小红书笔记草稿
 */
export function generateXiaohongshuDraft(
  toolName: string,
  useCase: string,
): { title: string; content: string; tags: string[] } {
  return {
    title: `发现了1个宝藏${toolName}！也太好用了吧`,
    content: `姐妹们！最近发现了一个超级好用的${toolName}🔥

${useCase}

真的绝绝子！完全免费还不用下载，随用随走～

#${toolName} #效率工具 #实用工具推荐 #工作好帮手 #免费工具`,
    tags: ["效率工具", "实用工具推荐", "免费工具", "工作好帮手"],
  };
}
