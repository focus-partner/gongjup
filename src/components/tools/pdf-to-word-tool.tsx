"use client";

import { useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  extractPDFText,
  generateDocx,
  downloadDocx,
  toPlainText,
  type PDFExtractResult,
} from "@/engines/pdf-to-word";
import { FileUp, Download, FileText, Loader2 } from "lucide-react";

/** 处理状态 */
type Status = "idle" | "loading" | "done" | "error";

/** PDF 转 Word —— 客户端解析，隐私安全 */
export function PDFToWordTool() {
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<PDFExtractResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  /** 处理文件上传 */
  const handleFile = useCallback(async (file: File) => {
    setFileName(file.name);
    setStatus("loading");
    setProgress(0);
    setErrorMsg("");
    setResult(null);

    try {
      const extracted = await extractPDFText(file, setProgress);
      setResult(extracted);
      setStatus("done");
    } catch (err) {
      console.error("PDF 解析失败:", err);
      setErrorMsg(
        err instanceof Error
          ? `解析失败：${err.message}`
          : "PDF 解析失败，请确认文件格式正确且未加密",
      );
      setStatus("error");
    }
  }, []);

  /** 下载 DOCX */
  const handleDownloadDocx = useCallback(async () => {
    if (!result) return;
    try {
      const blob = await generateDocx(result, fileName);
      downloadDocx(blob, fileName);
    } catch (err) {
      console.error("DOCX 生成失败:", err);
      setErrorMsg("Word 文档生成失败，请尝试下载 TXT 格式");
    }
  }, [result, fileName]);

  /** 下载 TXT（降级方案） */
  const handleDownloadTxt = useCallback(() => {
    if (!result) return;
    const text = toPlainText(result);
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName.replace(/\.pdf$/i, "") + ".txt";
    link.click();
    URL.revokeObjectURL(url);
  }, [result, fileName]);

  return (
    <div className="space-y-6">
      {/* ===== 上传区 ===== */}
      <div
        className={`rounded-2xl border-2 border-dashed p-8 sm:p-12 text-center transition-colors cursor-pointer ${
          status === "loading"
            ? "border-primary/30 bg-primary/[0.02]"
            : "border-border/50 hover:border-primary/30 hover:bg-muted/50"
        }`}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          const file = e.dataTransfer.files[0];
          if (file && file.type === "application/pdf") {
            handleFile(file);
          }
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />

        {status === "loading" ? (
          <div className="space-y-3">
            <Loader2 className="h-10 w-10 mx-auto animate-spin text-primary" />
            <p className="text-sm font-medium">正在解析 PDF...</p>
            <div className="mx-auto max-w-xs h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">{progress}%</p>
          </div>
        ) : (
          <>
            <FileUp className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
            <p className="text-sm font-medium">
              拖拽 PDF 文件到此处，或点击选择文件
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              文件在浏览器本地解析，不上传服务器，保护隐私
            </p>
          </>
        )}
      </div>

      {/* ===== 错误提示 ===== */}
      {status === "error" && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
          {errorMsg}
        </div>
      )}

      {/* ===== 结果展示 + 下载 ===== */}
      {status === "done" && result && (
        <div className="space-y-4">
          {/* 文件信息 */}
          <div className="rounded-xl border border-border/50 bg-card p-4 flex items-center gap-3">
            <FileText className="h-8 w-8 text-primary shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{fileName}</p>
              <p className="text-xs text-muted-foreground">
                {result.pageCount} 页 · {(result.fullText.length / 1024).toFixed(1)} KB 文本
                {result.metadata.title && ` · 原标题：${result.metadata.title}`}
              </p>
            </div>
          </div>

          {/* 下载按钮 */}
          <div className="flex gap-3">
            <Button onClick={handleDownloadDocx} className="flex-1" size="lg">
              <Download className="h-4 w-4 mr-1.5" />
              下载 Word (.docx)
            </Button>
            <Button
              onClick={handleDownloadTxt}
              variant="outline"
              size="lg"
              className="flex-1"
            >
              <Download className="h-4 w-4 mr-1.5" />
              下载纯文本 (.txt)
            </Button>
          </div>

          {/* 文本预览 */}
          <div className="rounded-xl border border-border/50 bg-card p-4 max-h-64 overflow-y-auto">
            <p className="text-xs text-muted-foreground mb-2 font-medium">
              文本预览
            </p>
            <pre className="text-xs leading-relaxed whitespace-pre-wrap font-sans text-muted-foreground">
              {result.fullText.slice(0, 2000)}
              {result.fullText.length > 2000 && "\n\n... 更多内容请下载查看"}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
