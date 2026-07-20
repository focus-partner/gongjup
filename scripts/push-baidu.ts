/**
 * 一次性推送所有 URL 给百度（手动脚本，不做定时任务）
 * 运行: npx tsx scripts/push-baidu.ts
 */
import { tools } from "../config/tools.config";
import { blogPosts } from "../src/content/blog/posts";

const TOKEN = "BmD7LecP5eh5HExu";
const SITE = "https://gongjup.com";

const urls: string[] = [SITE, `${SITE}/blog`];

// 工具页
for (const t of tools) {
  urls.push(`${SITE}/tools/${t.slug}`);
}

// 博客文章
for (const p of blogPosts) {
  urls.push(`${SITE}/blog/${p.slug}`);
}

async function main() {
  console.log(`共 ${urls.length} 个 URL，开始推送...`);

  const BATCH = 50;
  let totalSuccess = 0;

  for (let i = 0; i < urls.length; i += BATCH) {
    const batch = urls.slice(i, i + BATCH);
    try {
      const resp = await fetch(
        `http://data.zz.baidu.com/urls?site=${encodeURIComponent(SITE)}&token=${TOKEN}`,
        {
          method: "POST",
          headers: { "Content-Type": "text/plain" },
          body: batch.join("\n"),
        }
      );
      const text = await resp.text();
      console.log(`  批次 ${Math.floor(i / BATCH) + 1}: HTTP ${resp.status} → ${text}`);
      try {
        const data = JSON.parse(text);
        const ok = data.success || data.success_mip || 0;
        totalSuccess += ok;
      } catch {}
    } catch (e) {
      console.error(`  批次 ${Math.floor(i / BATCH) + 1} 失败:`, e);
    }
  }

  console.log(`\n总计成功推送: ${totalSuccess} / ${urls.length}`);
}

main();
