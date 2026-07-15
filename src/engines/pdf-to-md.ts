/**
 * PDF 转 Markdown 引擎
 * —— 复用 pdfjs-dist，输出干净的 Markdown 格式
 * 适配 AI 大模型输入场景
 */
import { extractPDFText, type PDFExtractResult } from "./pdf-to-word";

// 复用 pdf-to-word 的 extractPDFText，仅改变输出格式

/**
 * 将 PDF 提取结果转为 Markdown 格式
 * - H1: 文档标题（如有）
 * - H2: 页面标题（多页文档）
 * - 段落自动识别（按空行分段）
 * - 短行自动识别为标题
 */
export function toMarkdown(result: PDFExtractResult): string {
  const lines: string[] = [];

  // 文档标题
  if (result.metadata.title) {
    lines.push(`# ${result.metadata.title}\n`);
  }

  // 逐页处理
  for (let i = 0; i < result.pages.length; i++) {
    const page = result.pages[i];

    // 多页文档加页面分隔
    if (result.pageCount > 1) {
      lines.push(`## 第 ${i + 1} 页\n`);
    }

    // 按段落分割
    const paragraphs = page.text.split(/\n\s*\n/).filter((p) => p.trim());
    for (const para of paragraphs) {
      const trimmed = para.trim();
      if (!trimmed) continue;

      // 检测标题：短行且无句号
      if (trimmed.length < 60 && !trimmed.includes("。") && !trimmed.includes("，")) {
        lines.push(`### ${trimmed}\n`);
      } else {
        lines.push(`${trimmed}\n`);
      }
    }

    // 页面间分割线
    if (i < result.pages.length - 1) {
      lines.push("\n---\n");
    }
  }

  return lines.join("\n");
}

/**
 * 触发 Markdown 文件下载
 */
export function downloadMarkdown(text: string, filename: string): void {
  const blob = new Blob([text], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename.replace(/\.pdf$/i, "") + ".md";
  link.click();
  URL.revokeObjectURL(url);
}
