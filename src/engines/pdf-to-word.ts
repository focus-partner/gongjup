/**
 * PDF 转 Word 引擎
 * —— 客户端 PDF 文本提取 + DOCX 生成
 *
 * 隐私优先：PDF 文件在浏览器本地解析，不上传服务器
 */

import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  PageBreak,
} from "docx";

// pdfjs-dist 动态导入 —— 避免 SSR 时触发浏览器 API 依赖
let _pdfjsLib: typeof import("pdfjs-dist") | null = null;
async function getPdfJs() {
  if (!_pdfjsLib) {
    _pdfjsLib = await import("pdfjs-dist");
    _pdfjsLib.GlobalWorkerOptions.workerSrc =
      "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.mjs";
  }
  return _pdfjsLib;
}

export interface PDFExtractResult {
  fullText: string;
  pages: { pageNum: number; text: string }[];
  pageCount: number;
  metadata: {
    title?: string;
    author?: string;
    subject?: string;
    pageCount: number;
  };
}

/**
 * 从 PDF 文件中提取文本
 * @param file PDF 文件
 * @param onProgress 进度回调 (0-100)
 */
export async function extractPDFText(
  file: File,
  onProgress?: (percent: number) => void,
): Promise<PDFExtractResult> {
  // 1. 读取文件为 ArrayBuffer
  const arrayBuffer = await file.arrayBuffer();

  // 2. 动态加载 pdfjs-dist（仅客户端）
  const pdfjsLib = await getPdfJs();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;

  const pageCount = pdf.numPages;
  const pages: { pageNum: number; text: string }[] = [];
  const allTexts: string[] = [];

  // 3. 逐页提取文本
  for (let i = 1; i <= pageCount; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();

    // 将文本项按 y 坐标分组（保持大致行结构）
    const textItems = content.items
      .filter((item) => "str" in item && "transform" in item)
      .map((item) => {
        const textItem = item as { str: string; transform: number[] };
        return {
          str: textItem.str,
          y: Math.round(textItem.transform[5] * 100) / 100,
          x: textItem.transform[4],
        };
      });

    // 按行分组
    const lines: string[] = [];
    let currentY = textItems[0]?.y;
    let currentLine: string[] = [];

    for (const item of textItems) {
      if (Math.abs(item.y - (currentY ?? 0)) > 2) {
        // 新行
        if (currentLine.length > 0) {
          lines.push(currentLine.join(" "));
        }
        currentLine = [item.str];
        currentY = item.y;
      } else {
        currentLine.push(item.str);
      }
    }
    if (currentLine.length > 0) {
      lines.push(currentLine.join(" "));
    }

    const pageText = lines.join("\n");
    pages.push({ pageNum: i, text: pageText });
    allTexts.push(pageText);

    // 进度回调
    if (onProgress) {
      onProgress(Math.round((i / pageCount) * 100));
    }
  }

  // 4. 获取元数据
  const metadata = await pdf.getMetadata();
  const info = (metadata?.info ?? {}) as Record<string, unknown>;

  return {
    fullText: allTexts.join("\n\n--- 第 " + (pages.length + 1) + " 页 ---\n\n"),
    pages,
    pageCount,
    metadata: {
      title: info?.Title as string | undefined,
      author: info?.Author as string | undefined,
      subject: info?.Subject as string | undefined,
      pageCount,
    },
  };
}

/**
 * 生成纯文本内容（保留基本段落结构）
 */
export function toPlainText(result: PDFExtractResult): string {
  return result.pages
    .map((page, i) => {
      const header = result.pageCount > 1 ? `\n===== 第 ${i + 1} 页 =====\n\n` : "";
      return header + page.text;
    })
    .join("\n\n");
}

/**
 * 生成 DOCX 文件并触发下载
 * 将提取的文本转为 Word 文档
 */
export async function generateDocx(
  result: PDFExtractResult,
  filename: string,
): Promise<Blob> {
  const children: Paragraph[] = [];

  // 如果有标题元数据，先添加标题
  if (result.metadata.title) {
    children.push(
      new Paragraph({
        text: result.metadata.title,
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 300 },
      }),
    );
  }

  // 逐页处理
  for (let i = 0; i < result.pages.length; i++) {
    const page = result.pages[i];

    // 多页文档加页面标记
    if (result.pageCount > 1) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `第 ${i + 1} 页`,
              bold: true,
              size: 20, // 10pt
              color: "888888",
            }),
          ],
          spacing: { before: 200, after: 100 },
        }),
      );
    }

    // 将文本按段落分割（空行为段落分隔）
    const paragraphs = page.text.split(/\n\s*\n/).filter((p) => p.trim());
    for (const paraText of paragraphs) {
      // 检测是否为标题行（短且没有句号）
      const isHeading =
        paraText.trim().length < 50 && !paraText.includes("。") && !paraText.includes("，");

      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: paraText.trim(),
              bold: isHeading,
              size: isHeading ? 28 : 24, // heading 14pt, body 12pt
            }),
          ],
          heading: isHeading ? HeadingLevel.HEADING_3 : undefined,
          spacing: { after: 120 },
        }),
      );
    }

    // 页面间加分页符
    if (i < result.pages.length - 1 && result.pageCount > 1) {
      children.push(
        new Paragraph({
          children: [new PageBreak()],
        }),
      );
    }
  }

  const doc = new Document({
    sections: [
      {
        properties: {},
        children,
      },
    ],
  });

  return Packer.toBlob(doc);
}

/**
 * 触发 DOCX 文件下载
 */
export function downloadDocx(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename.replace(/\.pdf$/i, "") + ".docx";
  link.click();
  URL.revokeObjectURL(url);
}
