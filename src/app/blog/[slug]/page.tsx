import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Calendar } from "lucide-react";
import { blogPosts } from "@/content/blog/posts";

export function generateStaticParams() {
  return blogPosts.map(post => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find(p => p.slug === slug);
  if (!post) return { title: "文章未找到" };
  return {
    title: post.title, description: post.description, keywords: post.keywords,
  };
}

// 简单的 Markdown → JSX 渲染
function renderContent(md: string) {
  const lines = md.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith("## ")) {
      elements.push(<h2 key={i} className="text-xl font-bold mt-8 mb-3">{line.slice(3)}</h2>); i++; continue;
    }
    if (line.startsWith("### ")) {
      elements.push(<h3 key={i} className="text-lg font-semibold mt-6 mb-2">{line.slice(4)}</h3>); i++; continue;
    }
    if (/^\d\.\s/.test(line)) {
      elements.push(<li key={i} className="ml-4 text-muted-foreground"><strong>{line.match(/^\d\.\s\*\*(.+?)\*\*/)?.[1]}</strong>{line.replace(/^\d\.\s\*\*.+?\*\*/, "")}</li>); i++; continue;
    }
    if (line.startsWith("- ")) {
      const items: string[] = [];
      while (i < lines.length && lines[i].startsWith("- ")) { items.push(lines[i].slice(2)); i++; }
      elements.push(<ul key={i} className="space-y-1 my-3 ml-4">{items.map((item, j) => <li key={j} className="text-muted-foreground list-disc">{renderInline(item)}</li>)}</ul>);
      continue;
    }
    if (line.trim() === "") { i++; continue; }
    elements.push(<p key={i} className="text-muted-foreground leading-relaxed mb-3">{renderInline(line)}</p>);
    i++;
  }
  return elements;
}

function renderInline(text: string): React.ReactNode {
  // 链接
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts: React.ReactNode[] = [];
  let last = 0, match;
  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    parts.push(<Link key={match.index} href={match[2]} className="text-primary hover:underline" target={match[2].startsWith("http") ? "_blank" : undefined}>{match[1]}</Link>);
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts.length > 0 ? parts : text;
}
export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = blogPosts.find(p => p.slug === slug);
  if (!post) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8 sm:py-12">
      <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
        <ArrowLeft className="h-3.5 w-3.5" />返回实用指南
      </Link>
      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
        <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-medium">{post.category}</span>
        <span className="flex items-center gap-1"><Calendar className="h-3 w-3"/>{post.date}</span>
      </div>
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">{post.title}</h1>
      <div className="prose max-w-none">{renderContent(post.content)}</div>
      <div className="mt-10 p-5 rounded-2xl bg-primary/5 border border-primary/10 text-center">
        <p className="text-sm font-medium mb-2">🚀 发现更多实用在线工具</p>
        <Link href="/" className="text-primary font-bold hover:underline">访问工具派首页 →</Link>
      </div>
    </div>
  );
}
