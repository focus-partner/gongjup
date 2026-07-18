/**
 * JSON-LD 结构化数据组件
 * 帮助搜索引擎理解页面内容，在搜索结果中展示富摘要
 *
 * Schema 类型参考:
 * - WebApplication: 工具页面 → 可能触发 "应用" 富摘要
 * - Article: 博客文章 → 可能触发 "文章" 富摘要（发布时间、作者等）
 * - FAQ: 常见问题 → 可能触发问答富摘要（百度/Google 都支持）
 */

import type { ToolConfig } from "@/types/tool";
import type { BlogPost } from "@/content/blog/posts";

/** 工具页结构化数据 */
export function ToolJsonLd({ tool }: { tool: ToolConfig }) {
  const baseUrl = process.env.SITE_URL || "https://gongjup.com";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool.name,
    description: tool.description,
    url: `${baseUrl}/tools/${tool.slug}`,
    applicationCategory: "UtilityApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "CNY",
    },
    browserRequirements: "Requires JavaScript",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

/** 博客文章结构化数据 */
export function ArticleJsonLd({ post }: { post: BlogPost }) {
  const baseUrl = process.env.SITE_URL || "https://gongjup.com";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: { "@type": "Organization", name: "工具派" },
    publisher: { "@type": "Organization", name: "工具派", url: baseUrl },
    url: `${baseUrl}/blog/${post.slug}`,
    mainEntityOfPage: { "@type": "WebPage", "@id": `${baseUrl}/blog/${post.slug}` },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

/** FAQ 结构化数据 */
export function FaqJsonLd({ faq }: { faq: { q: string; a: string }[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

/** 面包屑结构化数据 */
export function BreadcrumbJsonLd({
  items,
}: {
  items: { label: string; href?: string }[];
}) {
  const baseUrl = process.env.SITE_URL || "https://gongjup.com";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      item: item.href ? `${baseUrl}${item.href}` : undefined,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
