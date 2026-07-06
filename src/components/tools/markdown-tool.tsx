"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Eye, Edit3 } from "lucide-react";

/**
 * Markdown 编辑器
 * 实时预览 + 一键复制/导出（基础版，后续可扩展导出 PDF）
 */
export function MarkdownTool() {
  const [content, setContent] = useState(`# 欢迎使用 Markdown 编辑器

## 基本语法

**粗体文本** 和 *斜体文本*

### 列表示例

- 项目一
- 项目二
- 项目三

### 代码块

\`\`\`javascript
console.log("Hello, World!");
\`\`\`

### 引用

> 这是一段引用文字

### 链接

[访问工具派](https://gongjup.com)

---

> 💡 在左侧编辑，右侧实时预览
`);
  const [tab, setTab] = useState<"edit" | "preview" | "split">("split");

  // 简单的 Markdown 渲染（使用正则替换）
  const renderMarkdown = (md: string): string => {
    let html = md
      // 转义 HTML
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      // 代码块
      .replace(/```(\w*)\n([\s\S]*?)```/g,
        '<pre class="bg-muted p-3 rounded-lg overflow-auto text-xs my-2"><code>$2</code></pre>')
      // 行内代码
      .replace(/`([^`]+)`/g, '<code class="bg-muted px-1 rounded text-xs">$1</code>')
      // 标题
      .replace(/^#### (.+)$/gm, '<h4 class="text-sm font-semibold mt-4 mb-2">$1</h4>')
      .replace(/^### (.+)$/gm, '<h3 class="text-base font-semibold mt-4 mb-2">$1</h3>')
      .replace(/^## (.+)$/gm, '<h2 class="text-lg font-bold mt-5 mb-3">$1</h2>')
      .replace(/^# (.+)$/gm, '<h1 class="text-xl font-bold mt-6 mb-3">$1</h1>')
      // 粗体/斜体
      .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      // 无序列表
      .replace(/^- (.+)$/gm, '<li class="ml-4 text-sm">$1</li>')
      // 引用
      .replace(/^> (.+)$/gm,
        '<blockquote class="border-l-2 border-primary pl-3 my-2 text-muted-foreground text-sm">$1</blockquote>')
      // 链接
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" class="text-primary underline" target="_blank" rel="noopener">$1</a>')
      // 分隔线
      .replace(/^---$/gm, '<hr class="my-4 border-border" />')
      // 段落（空行分隔）
      .replace(/\n\n/g, '</p><p class="text-sm leading-relaxed my-2">')
      // 单换行
      .replace(/\n/g, '<br />');

    return `<p class="text-sm leading-relaxed my-2">${html}</p>`;
  };

  const copyContent = async () => {
    await navigator.clipboard.writeText(content);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
          <TabsList>
            <TabsTrigger value="edit">
              <Edit3 className="h-3.5 w-3.5 mr-1" /> 编辑
            </TabsTrigger>
            <TabsTrigger value="split">
              <Eye className="h-3.5 w-3.5 mr-1" /> 分屏
            </TabsTrigger>
            <TabsTrigger value="preview">
              <Eye className="h-3.5 w-3.5 mr-1" /> 预览
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <Button variant="outline" size="sm" onClick={copyContent}>
          <Copy className="h-3.5 w-3.5 mr-1" />
          复制原文
        </Button>
      </div>

      <div className={`grid ${tab === "split" ? "grid-cols-2" : "grid-cols-1"} gap-3`}>
        {/* 编辑区 */}
        {(tab === "edit" || tab === "split") && (
          <div>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="font-mono text-sm min-h-[350px]"
              placeholder="输入 Markdown 内容..."
            />
          </div>
        )}

        {/* 预览区 */}
        {(tab === "preview" || tab === "split") && (
          <div
            className="rounded-xl border border-border/50 bg-card p-4 min-h-[350px] prose prose-sm max-w-none overflow-auto"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
          />
        )}
      </div>

      <p className="text-xs text-muted-foreground text-center">
        💡 基础版 Markdown 渲染。支持标题、粗体、斜体、代码块、列表、引用、链接。
      </p>
    </div>
  );
}
