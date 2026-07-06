/**
 * JSON-LD 结构化数据组件
 *
 * 搜索引擎通过 JSON-LD 理解页面内容：
 * - 工具页 → WebApplication 类型
 * - 博客页 → Article 类型
 * - 首页 → WebSite 类型
 */

interface ToolStructuredDataProps {
  name: string;
  description: string;
  url: string;
  category: string;
}

/** 工具页结构化数据 */
export function ToolStructuredData({
  name,
  description,
  url,
  category,
}: ToolStructuredDataProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name,
    description,
    url,
    applicationCategory: "UtilityApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "CNY",
    },
    about: {
      "@type": "Thing",
      name: category,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

interface FAQStructuredDataProps {
  questions: { q: string; a: string }[];
}

/** FAQ 结构化数据 */
export function FAQStructuredData({ questions }: FAQStructuredDataProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

interface BreadcrumbStructuredDataProps {
  items: { name: string; url?: string }[];
}

/** 面包屑结构化数据 */
export function BreadcrumbStructuredData({
  items,
}: BreadcrumbStructuredDataProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem" as const,
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
