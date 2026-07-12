import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, BookOpen, Calendar } from "lucide-react";
import { blogPosts } from "@/content/blog/posts";

export const metadata: Metadata = {
  title: "实用指南 — 工具使用教程与技巧分享",
  description: "发现高效使用在线工具的技巧与教程，提升工作和生活效率",
};

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8 sm:py-12">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
        <ArrowLeft className="h-3.5 w-3.5" />返回首页
      </Link>
      <div className="flex items-center gap-3 mb-2"><BookOpen className="h-6 w-6 text-primary" /><h1 className="text-3xl font-bold">实用指南</h1></div>
      <p className="text-muted-foreground mb-8">工具使用教程、效率技巧与实用知识分享</p>
      <div className="grid gap-4">
        {blogPosts.map(post => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="block p-6 rounded-2xl border border-border/50 bg-card hover:border-primary/30 hover:shadow-sm transition-all">
            <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
              <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-medium">{post.category}</span>
              <span className="flex items-center gap-1"><Calendar className="h-3 w-3"/>{post.date}</span>
            </div>
            <h2 className="text-lg font-bold mb-1 hover:text-primary transition-colors">{post.title}</h2>
            <p className="text-sm text-muted-foreground line-clamp-2">{post.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
