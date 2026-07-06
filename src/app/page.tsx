import Link from "next/link";
import { tools, toolsByCategory } from "../../config/tools.config";
import { categoryLabels, categoryDescriptions } from "@/types/tool";
import type { ToolCategory, ToolConfig } from "@/types/tool";
import { ArrowRight, Shield, Sparkles, Zap } from "lucide-react";

/**
 * 首页 —— 工具导航 + 品牌介绍
 *
 * 设计思路：
 * 1. Hero 区：一句话说清网站价值 + CTA
 * 2. 信任条：隐私安全 / 完全免费 / 无需下载
 * 3. 工具网格：按分类排列卡片
 */

const categoryOrder: ToolCategory[] = [
  "calculator",
  "file-processing",
  "developer",
  "text-tools",
  "life",
  "viral",
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* ===== Hero ===== */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-primary/5 to-transparent rounded-full blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-16 pb-12 sm:pt-24 sm:pb-16 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
            发现实用
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              在线工具
            </span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {tools.length}+ 款免费在线工具，涵盖计算、文件处理、开发辅助等场景。
            <br className="hidden sm:block" />
            无需下载安装，即用即走，隐私安全有保障。
          </p>

          <div className="mt-8 flex items-center justify-center gap-3">
            <Link
              href="#tools"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
            >
              开始使用
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border font-medium hover:bg-muted transition-colors"
            >
              实用指南
            </Link>
          </div>
        </div>
      </section>

      {/* ===== 信任条 ===== */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6 rounded-2xl bg-card border border-border/50">
          <TrustItem
            icon={<Shield className="h-5 w-5" />}
            title="隐私安全"
            desc="文件处理全在本地浏览器完成，不上传服务器"
          />
          <TrustItem
            icon={<Sparkles className="h-5 w-5" />}
            title="完全免费"
            desc="所有基础工具永久免费，付费功能仅高级需求"
          />
          <TrustItem
            icon={<Zap className="h-5 w-5" />}
            title="即用即走"
            desc="无需注册登录，打开网页就能用，用完就走"
          />
        </div>
      </section>

      {/* ===== 工具展示 ===== */}
      <section id="tools" className="mx-auto max-w-7xl px-4 sm:px-6 pb-20">
        {categoryOrder.map((category) => {
          const categoryTools = toolsByCategory[category] || [];
          if (categoryTools.length === 0) return null;

          return (
            <div key={category} className="mb-14">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-foreground">
                  {categoryLabels[category]}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {categoryDescriptions[category]}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {categoryTools.map((tool) => (
                  <ToolCard key={tool.slug} tool={tool} />
                ))}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}

/** 信任条单项 */
function TrustItem({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex items-start gap-3 p-3">
      <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary/10 text-primary shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-sm">{title}</h3>
        <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
      </div>
    </div>
  );
}

/** 工具卡片 */
function ToolCard({ tool }: { tool: ToolConfig }) {
  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="group relative flex flex-col p-5 rounded-2xl border border-border/50 bg-card tool-card-hover"
    >
      {/* 徽章 */}
      <div className="absolute top-3 right-3 flex gap-1.5">
        {tool.isNew && (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
            NEW
          </span>
        )}
        {tool.isPopular && (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
            热门
          </span>
        )}
      </div>

      <span className="text-3xl mb-3">{tool.icon}</span>

      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
        {tool.name}
      </h3>
      <p className="mt-1 text-xs text-muted-foreground leading-relaxed line-clamp-2">
        {tool.description}
      </p>

      {tool.keywords[0] && (
        <span className="mt-3 text-[11px] text-muted-foreground/60">
          {tool.keywords[0]}
        </span>
      )}
    </Link>
  );
}
