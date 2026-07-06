import type { MetadataRoute } from "next";

/**
 * robots.txt 生成
 * 允许所有爬虫，指向 sitemap
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.SITE_URL || "https://gongjup.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // 不索引 API 端点
      disallow: "/api/",
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
