"use client";

import { useState } from "react";
import Link from "next/link";
import { tools, toolsByCategory } from "../../../config/tools.config";
import { categoryLabels } from "@/types/tool";
import type { ToolCategory, ToolConfig } from "@/types/tool";
import { Search, Sparkles, TrendingUp, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";

const categoryOrder: ToolCategory[] = ["calculator","file-processing","text-tools","developer","life","viral"];

/** 快速入口：精选高频工具 */
const featured = ["watermark-remover","pdf-to-word","chinese-converter","qr-generator","edict","nickname"];

/** 热门工具 */
const hot = ["password-generator","lottery-calc","love-words","bill-split","martian","image-compress","blood-type","resignation"];

/** 新工具 */
const newest = ["nickname","resignation","love-words","express","lottery-calc","edict","martian","blood-type","bill-split","device-info"];

export function ToolGrid() {
  const [search, setSearch] = useState("");

  const filtered = search.trim()
    ? tools.filter(t => t.name.includes(search) || t.keywords.some(k => k.includes(search)) || t.description.includes(search))
    : [];

  return (
    <>
      {/* ===== 搜索栏 ===== */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 pb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="搜索工具：去水印、PDF转Word、圣旨生成..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-11 h-12 text-base rounded-2xl border-2 border-border/50 focus:border-primary/50 shadow-sm"
          />
        </div>
        {/* 搜索热词 */}
        {!search && (
          <div className="flex flex-wrap gap-1.5 mt-3 justify-center">
            {["去水印","PDF转Word","简繁转换","圣旨生成器","情话生成","彩票倍投"].map(kw => (
              <button key={kw} onClick={() => setSearch(kw)} className="px-3 py-1 rounded-full text-xs bg-muted hover:bg-primary/10 hover:text-primary transition-colors">{kw}</button>
            ))}
          </div>
        )}
        {/* 搜索结果 */}
        {search && (
          <div className="mt-6">
            <p className="text-sm text-muted-foreground mb-3">找到 {filtered.length} 个工具</p>
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {filtered.map(t => <ToolCard key={t.slug} tool={t} />)}
              </div>
            ) : (
              <div className="text-center py-10 text-muted-foreground"><p className="text-lg mb-2">🔍 没找到相关工具</p><p className="text-sm">试试其他关键词，或者告诉我们你想用什么工具</p></div>
            )}
          </div>
        )}
      </section>

      {/* 搜索时不显示工具列表 */}
      {search && <div className="pb-20" />}

      {!search && <>
        {/* ===== 快速入口 ===== */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 pb-10">
          <div className="flex items-center gap-2 mb-4"><Sparkles className="h-4 w-4 text-primary" /><h2 className="text-lg font-bold">常用工具</h2></div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {featured.map(slug => { const t = tools.find(tt => tt.slug === slug); return t ? <Link key={slug} href={`/tools/${slug}`} className="group flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-card border border-border/30 hover:border-primary/30 hover:shadow-sm transition-all"><span className="text-2xl">{t.icon}</span><span className="text-xs text-center font-medium group-hover:text-primary transition-colors line-clamp-1">{t.name}</span></Link> : null; })}
          </div>
        </section>

        {/* ===== 新上线 ===== */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 pb-10">
          <div className="flex items-center gap-2 mb-4"><span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">NEW</span><h2 className="text-lg font-bold">最近上线</h2></div>
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 snap-x">
            {newest.map(slug => { const t = tools.find(tt => tt.slug === slug); return t ? <Link key={slug} href={`/tools/${slug}`} className="shrink-0 snap-start w-36"><div className="rounded-2xl border border-border/30 bg-card p-4 hover:border-primary/30 hover:shadow-sm transition-all"><span className="text-2xl">{t.icon}</span><p className="text-xs font-medium mt-2 line-clamp-1">{t.name}</p><p className="text-[10px] text-muted-foreground mt-1 line-clamp-2">{t.description.slice(0,30)}...</p></div></Link> : null; })}
          </div>
        </section>

        {/* ===== 热门推荐 ===== */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 pb-10">
          <div className="flex items-center gap-2 mb-4"><TrendingUp className="h-4 w-4 text-amber-500" /><h2 className="text-lg font-bold">热门推荐</h2></div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {hot.map(slug => { const t = tools.find(tt => tt.slug === slug); return t ? <ToolCard key={slug} tool={t} compact /> : null; })}
          </div>
        </section>

        {/* ===== 分类浏览 ===== */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 pb-20">
          <h2 className="text-lg font-bold mb-4">按分类浏览</h2>
          {categoryOrder.map(cat => {
            const catTools = toolsByCategory[cat] || [];
            if (!catTools.length) return null;
            const shown = catTools.slice(0, 8);
            const more = catTools.length - 8;
            return (
              <div key={cat} className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <Link href={`/category/${cat}`} className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1">{categoryLabels[cat]}<ArrowRight className="h-3 w-3"/></Link>
                  <span className="text-[10px] text-muted-foreground">{catTools.length}个工具</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                  {shown.map(t => <ToolCard key={t.slug} tool={t} compact />)}
                  {more > 0 && (
                    <Link href={`/category/${cat}`} className="flex items-center justify-center p-5 rounded-2xl border border-dashed border-border/30 hover:border-primary/30 transition-colors text-sm text-muted-foreground hover:text-primary">
                      +{more} 个<br/>查看全部
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </section>
      </>}
    </>
  );
}

/** 工具卡片 */
function ToolCard({ tool, compact }: { tool: ToolConfig; compact?: boolean }) {
  return (
    <Link href={`/tools/${tool.slug}`} className="block">
      {compact ? (
        <div className="flex items-center gap-2 p-3 rounded-xl border border-border/30 bg-card hover:border-primary/30 hover:bg-muted/30 transition-all">
          <span className="text-lg">{tool.icon}</span>
          <span className="text-xs font-medium">{tool.name}</span>
        </div>
      ) : (
        <div className="relative flex flex-col p-4 rounded-2xl border border-border/30 bg-card hover:border-primary/30 hover:shadow-sm transition-all">
          {(tool.isNew || tool.isPopular) && (
            <div className="absolute top-2 right-2 flex gap-1">
              {tool.isNew && <span className="px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">NEW</span>}
              {tool.isPopular && <span className="px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">热门</span>}
            </div>
          )}
          <span className="text-2xl">{tool.icon}</span>
          <h3 className="font-medium text-sm mt-1.5">{tool.name}</h3>
          <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">{tool.description}</p>
        </div>
      )}
    </Link>
  );
}
