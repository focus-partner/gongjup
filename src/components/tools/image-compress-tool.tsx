"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { compressImage, formatFileSize, type CompressOptions } from "@/engines/image-tools";
import type { ImageInfo } from "@/engines/image-tools";
import { Upload, Download, X, Image as ImageIcon } from "lucide-react";

/**
 * 图片压缩工具
 * 客户端 Canvas 处理，文件不上传
 */
export function ImageCompressTool() {
  const [quality, setQuality] = useState(0.7);
  const [maxWidth, setMaxWidth] = useState(1920);
  const [results, setResults] = useState<ImageInfo[]>([]);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const handleFiles = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (files.length === 0) return;

      setProcessing(true);
      setError("");
      const newResults: ImageInfo[] = [];

      const options: CompressOptions = {
        quality: quality / 100,
        maxWidth,
        format: "image/jpeg",
      };

      for (const file of files) {
        try {
          const result = await compressImage(file, options);
          newResults.push(result);
        } catch (err) {
          setError(`处理 ${file.name} 失败: ${err instanceof Error ? err.message : "未知错误"}`);
        }
      }

      setResults((prev) => [...prev, ...newResults]);
      setProcessing(false);
    },
    [quality, maxWidth],
  );

  const removeResult = (index: number) => {
    setResults((prev) => prev.filter((_, i) => i !== index));
  };

  const totalSaved =
    results.reduce((a, r) => a + (r.originalSize - r.compressedSize), 0);

  return (
    <div className="space-y-4">
      {/* 隐私提示 */}
      <div className="rounded-lg bg-primary/5 border border-primary/20 px-3 py-2 text-xs text-muted-foreground">
        🔒 图片完全在浏览器本地处理，<strong className="text-foreground">不会上传到服务器</strong>
      </div>

      {/* 压缩参数 */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium mb-1.5 block">
            压缩质量：{quality}%
          </label>
          <input
            type="range"
            min={10}
            max={100}
            value={quality}
            onChange={(e) => setQuality(Number(e.target.value))}
            className="w-full accent-primary"
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-1.5 block">
            最大宽度：{maxWidth}px
          </label>
          <input
            type="range"
            min={320}
            max={4096}
            step={100}
            value={maxWidth}
            onChange={(e) => setMaxWidth(Number(e.target.value))}
            className="w-full accent-primary"
          />
        </div>
      </div>

      {/* 上传按钮 */}
      <div className="flex items-center justify-center">
        <label className="flex flex-col items-center gap-2 px-6 py-8 rounded-2xl border-2 border-dashed border-border/50 hover:border-primary/50 cursor-pointer transition-colors w-full">
          <Upload className="h-8 w-8 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {processing ? "处理中..." : "点击或拖拽上传图片"}
          </span>
          <span className="text-xs text-muted-foreground/60">
            支持 JPG / PNG / WebP / AVIF
          </span>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFiles}
            className="hidden"
            disabled={processing}
          />
        </label>
      </div>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 dark:bg-red-950/20 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      {/* 结果列表 */}
      {results.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">压缩结果（{results.length} 张）</span>
            <span className="text-green-600">
              共节省 {formatFileSize(totalSaved)}
            </span>
          </div>

          <div className="space-y-2">
            {results.map((r, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-card"
              >
                <img
                  src={r.previewUrl}
                  alt={r.name}
                  className="w-12 h-12 rounded-lg object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{r.name}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {r.width}×{r.height}
                  </p>
                  <p className="text-[11px] text-green-600">
                    {formatFileSize(r.originalSize)} → {formatFileSize(r.compressedSize)}{" "}
                    ({(100 - (r.compressedSize / r.originalSize) * 100).toFixed(0)}%)
                  </p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => {
                      const url = URL.createObjectURL(r.blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `compressed_${r.name}`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    title="下载"
                  >
                    <Download className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500"
                    onClick={() => removeResult(i)}
                    title="移除"
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
