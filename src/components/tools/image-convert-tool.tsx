"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { convertImageFormat, formatFileSize, formatToExtension } from "@/engines/image-tools";
import type { ImageFormat, ImageInfo } from "@/engines/image-tools";
import { Upload, Download, X } from "lucide-react";

const FORMATS: { key: ImageFormat; label: string; ext: string }[] = [
  { key: "image/jpeg", label: "JPEG", ext: ".jpg" },
  { key: "image/png", label: "PNG", ext: ".png" },
  { key: "image/webp", label: "WebP", ext: ".webp" },
  { key: "image/avif", label: "AVIF", ext: ".avif" },
];

/** 图片格式转换工具 */
export function ImageConvertTool() {
  const [targetFormat, setTargetFormat] = useState<ImageFormat>("image/webp");
  const [quality, setQuality] = useState(90);
  const [results, setResults] = useState<ImageInfo[]>([]);
  const [processing, setProcessing] = useState(false);

  const handleFiles = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (files.length === 0) return;
      setProcessing(true);

      const newResults: ImageInfo[] = [];
      for (const file of files) {
        try {
          const result = await convertImageFormat(file, targetFormat, quality / 100);
          newResults.push(result);
        } catch { /* skip errors */ }
      }

      setResults((prev) => [...prev, ...newResults]);
      setProcessing(false);
    },
    [targetFormat, quality],
  );

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-primary/5 border border-primary/20 px-3 py-2 text-xs text-muted-foreground">
        🔒 图片完全在浏览器本地处理，<strong className="text-foreground">不会上传到服务器</strong>
      </div>

      {/* 格式选择 */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium mb-1.5 block">目标格式</label>
          <div className="grid grid-cols-2 gap-1.5">
            {FORMATS.map((f) => (
              <button
                key={f.key}
                onClick={() => setTargetFormat(f.key)}
                className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                  targetFormat === f.key
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border hover:bg-muted"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-sm font-medium mb-1.5 block">输出质量：{quality}%</label>
          <input
            type="range"
            min={10}
            max={100}
            value={quality}
            onChange={(e) => setQuality(Number(e.target.value))}
            className="w-full accent-primary"
          />
        </div>
      </div>

      {/* 上传 */}
      <label className="flex flex-col items-center gap-2 px-6 py-8 rounded-2xl border-2 border-dashed border-border/50 hover:border-primary/50 cursor-pointer transition-colors w-full">
        <Upload className="h-8 w-8 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          {processing ? "处理中..." : "点击或拖拽上传图片"}
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

      {/* 结果 */}
      {results.map((r, i) => (
        <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-card">
          <img src={r.previewUrl} alt={r.name} className="w-12 h-12 rounded-lg object-cover shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium truncate">{r.name}</p>
            <p className="text-[11px] text-muted-foreground">
              {r.width}×{r.height} | {formatFileSize(r.compressedSize)}
            </p>
          </div>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => {
              const url = URL.createObjectURL(r.blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `${r.name.replace(/\.[^.]+$/, "")}${formatToExtension(targetFormat)}`;
              a.click();
              URL.revokeObjectURL(url);
            }}
          >
            <Download className="h-3.5 w-3.5" />
          </Button>
        </div>
      ))}
    </div>
  );
}
