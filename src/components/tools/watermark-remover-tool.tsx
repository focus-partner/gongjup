"use client";

import { useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  createMask,
  paintBrush,
  eraseBrush,
  inpaintMaskedArea,
  loadImageToCanvas,
  downloadImage,
  type WatermarkMask,
} from "@/engines/watermark-remover";
import {
  FileUp,
  Brush,
  Eraser,
  Trash2,
  Download,
  Eye,
  EyeOff,
  RotateCcw,
  Loader2,
} from "lucide-react";

type ToolMode = "brush" | "eraser";
type Status = "idle" | "loaded" | "processing" | "done";

/** 去水印工具 —— Canvas 涂鸦标记 + 像素修复 */
export function WatermarkRemoverTool() {
  const [status, setStatus] = useState<Status>("idle");
  const [mode, setMode] = useState<ToolMode>("brush");
  const [brushSize, setBrushSize] = useState(20);
  const [showOriginal, setShowOriginal] = useState(false);
  const [fileName, setFileName] = useState("");
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");

  // Canvas refs
  const mainCanvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 内部状态 refs（避免无谓重渲染）
  const maskRef = useRef<WatermarkMask>(createMask());
  const sourceImageRef = useRef<ImageData | null>(null);
  const resultImageRef = useRef<ImageData | null>(null);
  const imgSizeRef = useRef({ width: 0, height: 0 });
  const isDrawingRef = useRef(false);
  const drawnPixelsRef = useRef(0);

  /** 加载图片 */
  const handleFile = useCallback(async (file: File) => {
    setFileName(file.name);
    setStatus("idle");
    setErrorMsg("");
    setShowOriginal(false);
    maskRef.current = createMask();
    resultImageRef.current = null;
    drawnPixelsRef.current = 0;

    const canvas = mainCanvasRef.current;
    if (!canvas) return;

    try {
      const size = await loadImageToCanvas(file, canvas);
      imgSizeRef.current = size;

      // 保存原始图像数据
      const ctx = canvas.getContext("2d")!;
      sourceImageRef.current = ctx.getImageData(0, 0, size.width, size.height);

      // 初始化遮罩层
      const overlay = overlayRef.current;
      if (overlay) {
        overlay.width = size.width;
        overlay.height = size.height;
        overlay.getContext("2d")!.clearRect(0, 0, size.width, size.height);
      }

      setStatus("loaded");
    } catch {
      setErrorMsg("图片加载失败，请确认文件格式正确");
    }
  }, []);

  /** 获取 Canvas 坐标 */
  const getCanvasPos = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      const canvas = overlayRef.current;
      if (!canvas) return null;
      const rect = canvas.getBoundingClientRect();
      const scaleX = imgSizeRef.current.width / rect.width;
      const scaleY = imgSizeRef.current.height / rect.height;
      let clientX: number, clientY: number;
      if ("touches" in e) {
        if (e.touches.length === 0) return null;
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }
      return {
        x: Math.round((clientX - rect.left) * scaleX),
        y: Math.round((clientY - rect.top) * scaleY),
      };
    },
    [],
  );

  /** 绘制笔触 */
  const drawAt = useCallback(
    (pos: { x: number; y: number }) => {
      const overlay = overlayRef.current;
      if (!overlay) return;
      const ctx = overlay.getContext("2d")!;
      const mask = maskRef.current;

      if (mode === "brush") {
        const added = paintBrush(mask, pos.x, pos.y);
        // 只绘制新增部分（优化：避免重复绘制整个圆）
        const r = mask.brushSize / 2;
        ctx.fillStyle = "rgba(255, 60, 60, 0.45)";
        added.forEach((key) => {
          const [px, py] = key.split(",").map(Number);
          ctx.fillRect(px, py, 1, 1);
        });
        drawnPixelsRef.current = mask.maskedPixels.size;
      } else {
        eraseBrush(mask, pos.x, pos.y);
        // 重建遮罩层（擦除时清除整个圆形区域）
        const r = mask.brushSize / 2;
        ctx.clearRect(pos.x - r, pos.y - r, mask.brushSize, mask.brushSize);
        drawnPixelsRef.current = mask.maskedPixels.size;
      }
    },
    [mode],
  );

  const handlePointerDown = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      const pos = getCanvasPos(e);
      if (!pos) return;
      isDrawingRef.current = true;
      drawAt(pos);
    },
    [getCanvasPos, drawAt],
  );

  const handlePointerMove = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (!isDrawingRef.current) return;
      const pos = getCanvasPos(e);
      if (!pos) return;
      drawAt(pos);
    },
    [getCanvasPos, drawAt],
  );

  const handlePointerUp = useCallback(() => {
    isDrawingRef.current = false;
  }, []);

  /** 清除标记 */
  const clearMarks = useCallback(() => {
    maskRef.current = createMask();
    maskRef.current.brushSize = brushSize;
    drawnPixelsRef.current = 0;
    const overlay = overlayRef.current;
    if (overlay) {
      overlay.getContext("2d")!.clearRect(0, 0, overlay.width, overlay.height);
    }
  }, [brushSize]);

  /** 更新笔刷大小 */
  const updateBrushSize = useCallback((size: number) => {
    setBrushSize(size);
    maskRef.current.brushSize = size;
  }, []);

  /** 执行去水印 */
  const handleRemove = useCallback(() => {
    const canvas = mainCanvasRef.current;
    if (!canvas) return;
    if (maskRef.current.maskedPixels.size === 0) {
      setErrorMsg("请先在图像上涂抹标记水印区域");
      return;
    }
    setErrorMsg("");
    setStatus("processing");
    setProgress(0);

    requestAnimationFrame(() => {
      const ctx = canvas.getContext("2d")!;
      const { width, height } = imgSizeRef.current;
      const result = inpaintMaskedArea(ctx, maskRef.current, width, height, setProgress);
      ctx.putImageData(result, 0, 0);
      resultImageRef.current = result;

      // 清除遮罩层
      const overlay = overlayRef.current;
      if (overlay) overlay.getContext("2d")!.clearRect(0, 0, width, height);

      setStatus("done");
      setShowOriginal(false);
    });
  }, []);

  /** 切换原图/结果 */
  const toggleView = useCallback(() => {
    const canvas = mainCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const { width, height } = imgSizeRef.current;

    if (showOriginal) {
      // 切换到结果图
      if (resultImageRef.current) {
        ctx.putImageData(resultImageRef.current, 0, 0);
      }
    } else {
      // 切换到原图
      if (sourceImageRef.current) {
        ctx.putImageData(sourceImageRef.current, 0, 0);
      }
    }
    setShowOriginal(!showOriginal);
  }, [showOriginal]);

  /** 重置 */
  const handleReset = useCallback(() => {
    const canvas = mainCanvasRef.current;
    if (!canvas || !sourceImageRef.current) return;
    const ctx = canvas.getContext("2d")!;
    ctx.putImageData(sourceImageRef.current, 0, 0);
    maskRef.current = createMask();
    maskRef.current.brushSize = brushSize;
    drawnPixelsRef.current = 0;
    resultImageRef.current = null;
    const overlay = overlayRef.current;
    if (overlay) overlay.getContext("2d")!.clearRect(0, 0, overlay.width, overlay.height);
    setStatus("loaded");
    setShowOriginal(false);
    setErrorMsg("");
  }, [brushSize]);

  /** 下载 */
  const handleDownload = useCallback(() => {
    const canvas = mainCanvasRef.current;
    if (!canvas) return;
    downloadImage(canvas, fileName || "image.png");
  }, [fileName]);

  return (
    <div className="space-y-5">
      {/* ===== 上传区 ===== */}
      {status === "idle" && (
        <div
          className="rounded-2xl border-2 border-dashed border-border/50 p-10 text-center cursor-pointer hover:border-primary/30 hover:bg-muted/50 transition-colors"
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const f = e.dataTransfer.files[0];
            if (f?.type.startsWith("image/")) handleFile(f);
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
          />
          <FileUp className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
          <p className="text-sm font-medium">上传图片，涂抹水印区域即可去除</p>
          <p className="text-xs text-muted-foreground mt-1">
            支持 JPG/PNG/WebP · 处理在浏览器本地完成 · 不上传服务器
          </p>
        </div>
      )}

      {/* ===== 工具栏 ===== */}
      {status !== "idle" && (
        <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl border border-border/50 bg-card">
          <button
            onClick={() => setMode("brush")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              mode === "brush" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
            }`}
          >
            <Brush className="h-3.5 w-3.5" />涂抹
          </button>
          <button
            onClick={() => setMode("eraser")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              mode === "eraser" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
            }`}
          >
            <Eraser className="h-3.5 w-3.5" />擦除
          </button>
          <div className="w-px h-5 bg-border mx-1" />
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-muted-foreground">笔刷</span>
            <input
              type="range"
              min={5}
              max={80}
              value={brushSize}
              onChange={(e) => updateBrushSize(Number(e.target.value))}
              className="w-20 h-1.5 rounded-full bg-muted accent-primary cursor-pointer"
            />
            <span className="text-[10px] font-mono text-muted-foreground w-5">{brushSize}</span>
          </div>
          <div className="w-px h-5 bg-border mx-1" />
          <button onClick={clearMarks} className="p-1.5 rounded-lg hover:bg-muted transition-colors" title="清除标记">
            <Trash2 className="h-3.5 w-3.5" />
          </button>

          <div className="flex-1" />

          {status === "loaded" && (
            <Button onClick={handleRemove} size="sm">去除水印</Button>
          )}
          {status === "done" && (
            <>
              <button onClick={toggleView} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-muted transition-colors">
                {showOriginal ? <><EyeOff className="h-3.5 w-3.5" /> 显示结果</> : <><Eye className="h-3.5 w-3.5" /> 查看原图</>}
              </button>
              <button onClick={handleReset} className="p-1.5 rounded-lg hover:bg-muted transition-colors" title="重新编辑">
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
              <Button onClick={handleDownload} size="sm">
                <Download className="h-3.5 w-3.5 mr-1" />下载
              </Button>
            </>
          )}
        </div>
      )}

      {/* ===== 处理进度 ===== */}
      {status === "processing" && (
        <div className="rounded-xl border border-primary/20 bg-primary/[0.02] p-4">
          <div className="flex items-center gap-3 mb-2">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            <span className="text-sm font-medium">正在修复像素...</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {/* ===== 错误 ===== */}
      {errorMsg && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
          {errorMsg}
        </div>
      )}

      {/* ===== Canvas 编辑区 ===== */}
      {status !== "idle" && (
        <div className="relative rounded-2xl border border-border/50 bg-card overflow-hidden">
          <div
            className="relative w-full select-none"
            style={{ maxHeight: "70vh", overflow: "auto", touchAction: "none" }}
            onMouseDown={status === "loaded" ? handlePointerDown : undefined}
            onMouseMove={status === "loaded" ? handlePointerMove : undefined}
            onMouseUp={status === "loaded" ? handlePointerUp : undefined}
            onMouseLeave={status === "loaded" ? handlePointerUp : undefined}
            onTouchStart={status === "loaded" ? handlePointerDown : undefined}
            onTouchMove={status === "loaded" ? handlePointerMove : undefined}
            onTouchEnd={status === "loaded" ? handlePointerUp : undefined}
          >
            {/* 主图像 Canvas */}
            <canvas ref={mainCanvasRef} className="w-full h-auto block" />
            {/* 遮罩层（涂鸦标记） */}
            {status === "loaded" && (
              <canvas ref={overlayRef} className="absolute inset-0 w-full h-full cursor-crosshair" />
            )}
          </div>

          {/* 底部提示 */}
          {status === "loaded" && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-background/80 backdrop-blur text-xs text-muted-foreground border border-border/50 shadow-sm">
              {drawnPixelsRef.current > 0
                ? `已标记 ${drawnPixelsRef.current.toLocaleString()} 个像素`
                : "涂抹水印位置，红色区域将被修复"}
            </div>
          )}
          {status === "done" && showOriginal && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-amber-50/90 backdrop-blur text-xs text-amber-700 border border-amber-200 shadow-sm">
              正在查看原图
            </div>
          )}
          {status === "done" && !showOriginal && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-green-50/90 backdrop-blur text-xs text-green-700 border border-green-200 shadow-sm">
              水印已去除
            </div>
          )}
        </div>
      )}
    </div>
  );
}
