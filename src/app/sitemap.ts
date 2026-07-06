import type { MetadataRoute } from "next";
import { tools } from "../../config/tools.config";
import { categoryLabels } from "@/types/tool";
import type { ToolCategory } from "@/types/tool";

/**
 * 动态生成 sitemap.xml
 * 包含：首页、分类页、工具页
 * 后续博客上线后会自动扩展文章 URL
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.SITE_URL || "https://gongjup.com";

  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.7,
    },
  ];

  // 分类页（priority 0.8）
  const categories = Object.keys(categoryLabels) as ToolCategory[];
  for (const cat of categories) {
    routes.push({
      url: `${baseUrl}/category/${cat}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }

  // 工具页（priority 0.9）
  for (const tool of tools) {
    routes.push({
      url: `${baseUrl}/tools/${tool.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    });
  }

  return routes;
}
