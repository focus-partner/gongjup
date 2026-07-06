import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "实用指南 — 工具使用教程与技巧分享",
  description: "发现高效使用在线工具的技巧与教程，提升工作和生活效率",
};

/** 博客列表页 —— 占位页面，SEO 文章系统后续实现 */
export default function BlogPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8 sm:py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        返回首页
      </Link>

      <div className="flex items-center gap-3 mb-6">
        <BookOpen className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold">实用指南</h1>
      </div>
      <p className="text-muted-foreground mb-8">
        工具使用教程、效率技巧与实用知识分享
      </p>

      {/* 空状态 */}
      <div className="text-center py-16 rounded-2xl border border-dashed border-border/50">
        <p className="text-4xl mb-4">📝</p>
        <p className="text-muted-foreground">文章正在赶来...</p>
        <p className="text-sm text-muted-foreground mt-1">
          我们正在撰写高质量的实用指南，敬请期待
        </p>
      </div>
    </div>
  );
}
