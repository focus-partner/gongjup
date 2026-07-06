"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PDFDocument } from "pdf-lib";
import { Upload, Download, X, ArrowUpDown, FileText } from "lucide-react";

interface PDFFile {
  name: string;
  file: File;
  pageCount?: number;
}

/**
 * PDF 合并/拆分工具
 * 使用 pdf-lib 在浏览器完成，文件不上传服务器
 */
export function PDFMergeTool() {
  const [mode, setMode] = useState<"merge" | "split">("merge");
  const [files, setFiles] = useState<PDFFile[]>([]);
  const [processing, setProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [error, setError] = useState("");

  const addFiles = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    if (newFiles.length === 0) return;

    const pdfFiles: PDFFile[] = [];

    for (const file of newFiles) {
      if (file.type !== "application/pdf") {
        setError(`「${file.name}」不是 PDF 文件`);
        continue;
      }
      // 读取页数
      try {
        const bytes = await file.arrayBuffer();
        const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
        pdfFiles.push({ name: file.name, file, pageCount: doc.getPageCount() });
      } catch {
        pdfFiles.push({ name: file.name, file });
      }
    }

    setFiles((prev) => [...prev, ...pdfFiles]);
    setError("");
  }, []);

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // 上移/下移文件
  const moveFile = (index: number, dir: -1 | 1) => {
    setFiles((prev) => {
      const newFiles = [...prev];
      const target = index + dir;
      if (target < 0 || target >= newFiles.length) return prev;
      [newFiles[index], newFiles[target]] = [newFiles[target], newFiles[index]];
      return newFiles;
    });
  };

  // 合并 PDF
  const mergePDFs = useCallback(async () => {
    if (files.length < 2) {
      setError("请选择至少 2 个 PDF 文件");
      return;
    }
    setProcessing(true);
    setError("");

    try {
      const mergedDoc = await PDFDocument.create();

      for (const pdfFile of files) {
        const bytes = await pdfFile.file.arrayBuffer();
        const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
        const pages = await mergedDoc.copyPages(doc, doc.getPageIndices());
        pages.forEach((page) => mergedDoc.addPage(page));
      }

      const mergedBytes = await mergedDoc.save();
      const blob = new Blob([mergedBytes as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
    } catch (err) {
      setError(`合并失败: ${err instanceof Error ? err.message : "未知错误"}`);
    } finally {
      setProcessing(false);
    }
  }, [files]);

  // 拆分 PDF（提取每一页）
  const splitPDF = useCallback(async () => {
    if (files.length !== 1) {
      setError("拆分模式请只选择一个 PDF 文件");
      return;
    }
    setProcessing(true);
    setError("");

    try {
      const bytes = await files[0].file.arrayBuffer();
      const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const pageCount = doc.getPageCount();

      // 每页拆为独立 PDF，打包成 ZIP 或用多个 URL
      // 简化：拆分后合并为一个多文件下载（实际上传一个合并后的预览包）
      const splitPages: { name: string; blob: Blob; url: string }[] = [];

      for (let i = 0; i < pageCount; i++) {
        const newDoc = await PDFDocument.create();
        const [page] = await newDoc.copyPages(doc, [i]);
        newDoc.addPage(page);
        const pageBytes = await newDoc.save();
        const blob = new Blob([pageBytes as BlobPart], { type: "application/pdf" });
        splitPages.push({
          name: `${files[0].name.replace(".pdf", "")}_第${i + 1}页.pdf`,
          blob,
          url: URL.createObjectURL(blob),
        });
      }

      // 返回第一个文件的下载链接（拆分用另一个UI展示全部页面）
      setDownloadUrl(splitPages[0]?.url || "");
      if (splitPages.length > 1) {
        // 自动触发下载第一个文件
        const a = document.createElement("a");
        a.href = splitPages[0].url;
        a.download = splitPages[0].name;
        a.click();
        // 延迟下载后续文件
        splitPages.slice(1).forEach((sp, i) => {
          setTimeout(() => {
            const a2 = document.createElement("a");
            a2.href = sp.url;
            a2.download = sp.name;
            a2.click();
          }, (i + 1) * 500);
        });
      }
    } catch (err) {
      setError(`拆分失败: ${err instanceof Error ? err.message : "未知错误"}`);
    } finally {
      setProcessing(false);
    }
  }, [files]);

  const process = mode === "merge" ? mergePDFs : splitPDF;
  const totalPages = files.reduce((sum, f) => sum + (f.pageCount || 0), 0);

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-primary/5 border border-primary/20 px-3 py-2 text-xs text-muted-foreground">
        🔒 PDF 文件完全在浏览器本地处理，<strong className="text-foreground">不会上传到服务器</strong>
      </div>

      <Tabs value={mode} onValueChange={(v) => { setMode(v as typeof mode); setFiles([]); setDownloadUrl(""); }}>
        <TabsList>
          <TabsTrigger value="merge">📎 合并 PDF</TabsTrigger>
          <TabsTrigger value="split">✂️ 拆分 PDF</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* 上传 */}
      <label className="flex flex-col items-center gap-2 px-6 py-6 rounded-2xl border-2 border-dashed border-border/50 hover:border-primary/50 cursor-pointer transition-colors w-full">
        <Upload className="h-7 w-7 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          {mode === "merge" ? "选择多个 PDF 文件" : "选择一个 PDF 文件"}
        </span>
        <input
          type="file"
          accept="application/pdf"
          multiple={mode === "merge"}
          onChange={addFiles}
          className="hidden"
          disabled={processing}
        />
      </label>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 dark:bg-red-950/20 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      {/* 文件列表 */}
      {files.length > 0 && (
        <div>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="font-medium">
              {files.length} 个文件{totalPages > 0 ? `（共 ${totalPages} 页）` : ""}
            </span>
            <span className="text-muted-foreground">
              拖拽排序（桌面端通过上下箭头）
            </span>
          </div>

          <div className="space-y-1.5">
            {files.map((f, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-card"
              >
                <FileText className="h-5 w-5 text-red-500 shrink-0" />
                <span className="flex-1 text-sm truncate">{f.name}</span>
                {f.pageCount && (
                  <span className="text-xs text-muted-foreground shrink-0">{f.pageCount} 页</span>
                )}
                {mode === "merge" && (
                  <div className="flex gap-0.5 shrink-0">
                    <button
                      onClick={() => moveFile(i, -1)}
                      disabled={i === 0}
                      className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30"
                    >
                      <ArrowUpDown className="h-3.5 w-3.5 rotate-180" />
                    </button>
                    <button
                      onClick={() => moveFile(i, 1)}
                      disabled={i === files.length - 1}
                      className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30"
                    >
                      <ArrowUpDown className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
                <button
                  onClick={() => removeFile(i)}
                  className="p-1 text-red-500 hover:text-red-600 shrink-0"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>

          <Button
            className="mt-4"
            onClick={process}
            disabled={processing || files.length === 0 || (mode === "merge" && files.length < 2)}
          >
            {processing ? "处理中..." : mode === "merge" ? "合并 PDF" : "拆分 PDF"}
          </Button>

          {downloadUrl && (
            <Button
              variant="outline"
              className="mt-2 ml-2"
              onClick={() => {
                const a = document.createElement("a");
                a.href = downloadUrl;
                a.download = mode === "merge" ? "merged.pdf" : "split.zip";
                a.click();
              }}
            >
              <Download className="h-3.5 w-3.5 mr-1.5" />
              下载结果
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
