/** 一次性推送所有 URL 给 Bing IndexNow */
import { tools } from "../config/tools.config";
import { blogPosts } from "../src/content/blog/posts";

const SITE = "https://gongjup.com";

const urls: string[] = [SITE, `${SITE}/blog`];
for (const t of tools) urls.push(`${SITE}/tools/${t.slug}`);
for (const p of blogPosts) urls.push(`${SITE}/blog/${p.slug}`);

async function main() {
  console.log(`共 ${urls.length} 个 URL，推送给 Bing...`);

  const resp = await fetch("https://www.bing.com/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      host: "gongjup.com",
      key: "default-key",
      urlList: urls,
    }),
  });

  console.log(`HTTP ${resp.status}: ${await resp.text()}`);
}

main();
