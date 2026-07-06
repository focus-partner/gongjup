"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { generateQRDataURL, type QROptions } from "@/engines/qrcode";
import { Download, Upload } from "lucide-react";

/** 初始选项 */
const defaultOptions: QROptions = {
  text: "",
  size: 256,
  darkColor: "#000000",
  lightColor: "#ffffff",
  errorCorrection: "M",
};

/** 纠错级别选项 */
const ecOptions = [
  { value: "L" as const, label: "低 (7%)" },
  { value: "M" as const, label: "中 (15%)" },
  { value: "Q" as const, label: "较高 (25%)" },
  { value: "H" as const, label: "高 (30%)" },
];

/** 二维码生成器 —— 纯客户端渲染 Canvas */
export function QRGeneratorTool() {
  const [opts, setOpts] = useState<QROptions>(defaultOptions);
  const [dataUrl, setDataUrl] = useState<string>("");
  const [mounted, setMounted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 标记客户端挂载完成
  useEffect(() => {
    setMounted(true);
  }, []);

  /** 更新选项并重新生成 */
  const update = useCallback(
    async (patch: Partial<QROptions>) => {
      const next = { ...opts, ...patch };
      setOpts(next);
      if (next.text.trim() && mounted) {
        const url = await generateQRDataURL(next);
        setDataUrl(url);
      } else if (!next.text.trim()) {
        setDataUrl("");
      }
    },
    [opts, mounted],
  );

  /** 下载 PNG */
  const download = useCallback(() => {
    if (!dataUrl) return;
    const link = document.createElement("a");
    link.download = `qrcode-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
  }, [dataUrl]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ===== 左侧：配置区 ===== */}
        <div className="rounded-2xl border border-border/50 bg-card p-6 space-y-5">
          {/* 内容输入 */}
          <div>
            <Label htmlFor="qr-text">输入文本或网址</Label>
            <Textarea
              id="qr-text"
              placeholder="输入要生成二维码的文本、网址或其他内容..."
              value={opts.text}
              onChange={(e) => update({ text: e.target.value })}
              className="mt-1.5 min-h-[80px]"
              rows={3}
            />
          </div>

          {/* 尺寸 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>二维码尺寸</Label>
              <span className="text-sm font-mono text-primary">
                {opts.size}px
              </span>
            </div>
            <input
              type="range"
              min={128}
              max={512}
              step={16}
              value={opts.size}
              onChange={(e) => update({ size: Number(e.target.value) })}
              className="w-full h-2 rounded-full bg-muted appearance-none cursor-pointer accent-primary [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer"
            />
          </div>

          {/* 颜色 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>前景色</Label>
              <div className="flex items-center gap-2 mt-1.5">
                <input
                  type="color"
                  value={opts.darkColor}
                  onChange={(e) => update({ darkColor: e.target.value })}
                  className="h-9 w-9 rounded-lg border border-border/50 cursor-pointer p-0.5"
                />
                <Input
                  value={opts.darkColor}
                  onChange={(e) => update({ darkColor: e.target.value })}
                  className="font-mono text-sm"
                />
              </div>
            </div>
            <div>
              <Label>背景色</Label>
              <div className="flex items-center gap-2 mt-1.5">
                <input
                  type="color"
                  value={opts.lightColor}
                  onChange={(e) => update({ lightColor: e.target.value })}
                  className="h-9 w-9 rounded-lg border border-border/50 cursor-pointer p-0.5"
                />
                <Input
                  value={opts.lightColor}
                  onChange={(e) => update({ lightColor: e.target.value })}
                  className="font-mono text-sm"
                />
              </div>
            </div>
          </div>

          {/* 纠错级别 */}
          <div>
            <Label>纠错级别</Label>
            <p className="text-xs text-muted-foreground mt-0.5 mb-2">
              级别越高，二维码被遮挡后越容易恢复，但图案也更密集
            </p>
            <div className="grid grid-cols-4 gap-2">
              {ecOptions.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => update({ errorCorrection: value })}
                  className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                    opts.errorCorrection === value
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border/50 hover:border-border"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ===== 右侧：预览区 ===== */}
        <div className="rounded-2xl border border-border/50 bg-muted/30 p-6 flex flex-col items-center justify-center min-h-[400px]">
          {mounted && dataUrl ? (
            <>
              <div className="bg-white p-4 rounded-2xl shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={dataUrl}
                  alt="生成的二维码"
                  className="max-w-full h-auto"
                  style={{ width: opts.size, height: opts.size }}
                />
              </div>
              <Button onClick={download} className="mt-5" size="sm">
                <Download className="h-4 w-4 mr-1.5" />
                下载 PNG
              </Button>
            </>
          ) : (
            <div className="text-center py-16">
              <div className="h-20 w-20 mx-auto mb-4 rounded-2xl border-2 border-dashed border-border/50 flex items-center justify-center">
                <span className="text-3xl">📱</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {!mounted
                  ? "加载中..."
                  : opts.text.trim()
                    ? "生成中..."
                    : "输入内容后自动生成二维码"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
