import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { tools, toolsByCategory } from "../../../../config/tools.config";
import { categoryLabels, categoryDescriptions } from "@/types/tool";
import type { ToolCategory, ToolConfig } from "@/types/tool";
import { ArrowLeft } from "lucide-react";

// 所有有效分类
const validCategories = Object.keys(categoryLabels) as ToolCategory[];

/** 生成所有分类的静态页面 */
export function generateStaticParams() {
  return validCategories.map((cat) => ({ category: cat }));
}

/** 动态 SEO 元数据 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  if (!validCategories.includes(category as ToolCategory)) {
    return { title: "分类不存在" };
  }
  const cat = category as ToolCategory;
  const count = toolsByCategory[cat]?.length || 0;
  return {
    title: `${categoryLabels[cat]} — ${count}款免费在线${categoryLabels[cat]}工具`,
    description: categoryDescriptions[cat],
  };
}

/** 分类页 —— 展示该类别下所有工具 */
export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;

  if (!validCategories.includes(category as ToolCategory)) {
    notFound();
  }

  const cat = category as ToolCategory;
  const categoryTools = toolsByCategory[cat] || [];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12">
      {/* 返回 + 分类标题 */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        返回首页
      </Link>

      <h1 className="text-3xl font-bold text-foreground mb-2">
        {categoryLabels[cat]}
      </h1>
      <p className="text-muted-foreground mb-8">{categoryDescriptions[cat]}</p>

      {/* 工具网格 */}
      {categoryTools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {categoryTools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground text-center py-16">该分类暂无工具</p>
      )}
    </div>
  );
}

function ToolCard({ tool }: { tool: ToolConfig }) {
  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="group relative flex flex-col p-5 rounded-2xl border border-border/50 bg-card hover:border-primary/30 hover:shadow-lg hover:-translate-y-0.5 transition-all"
    >
      {tool.isNew && (
        <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
          NEW
        </span>
      )}
      <span className="text-3xl mb-3">{tool.icon}</span>
      <h3 className="font-semibold group-hover:text-primary transition-colors">
        {tool.name}
      </h3>
      <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
        {tool.description}
      </p>
    </Link>
  );
}
