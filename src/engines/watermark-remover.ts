/**
 * 去水印引擎
 * —— 基于 Canvas 的手动标记 + 像素修复
 *
 * 工作原理：
 * 1. 用户在图像上涂鸦标记水印区域
 * 2. 点击"去除"后，对标记区域进行像素填充（取周围像素均值）
 * 3. 适合处理边缘水印、小 Logo、简单文字水印
 *
 * 限制（MVP）：
 * - 无法完美去除大面积、覆盖主体内容的水印
 * - 复杂水印建议使用"裁剪"功能替代
 */

export interface WatermarkMask {
  /** 涂抹标记的像素坐标集合，key 为 "x,y" */
  maskedPixels: Set<string>;
  brushSize: number;
}

/** 创建空的遮罩 */
export function createMask(): WatermarkMask {
  return {
    maskedPixels: new Set(),
    brushSize: 20,
  };
}

/**
 * 在遮罩上绘制一个圆形笔触
 * @returns 新增的像素坐标集合
 */
export function paintBrush(
  mask: WatermarkMask,
  centerX: number,
  centerY: number,
): Set<string> {
  const radius = mask.brushSize / 2;
  const newPixels = new Set<string>();

  for (let dy = -radius; dy <= radius; dy++) {
    for (let dx = -radius; dx <= radius; dx++) {
      if (dx * dx + dy * dy <= radius * radius) {
        const x = Math.round(centerX + dx);
        const y = Math.round(centerY + dy);
        const key = `${x},${y}`;
        mask.maskedPixels.add(key);
        newPixels.add(key);
      }
    }
  }

  return newPixels;
}

/**
 * 擦除笔触区域
 */
export function eraseBrush(
  mask: WatermarkMask,
  centerX: number,
  centerY: number,
): number {
  const radius = mask.brushSize / 2;
  let removed = 0;

  for (let dy = -radius; dy <= radius; dy++) {
    for (let dx = -radius; dx <= radius; dx++) {
      if (dx * dx + dy * dy <= radius * radius) {
        const x = Math.round(centerX + dx);
        const y = Math.round(centerY + dy);
        const key = `${x},${y}`;
        if (mask.maskedPixels.delete(key)) {
          removed++;
        }
      }
    }
  }

  return removed;
}

/**
 * 对遮罩区域进行像素修复
 * 使用"周围像素均值填充"策略，逐像素处理
 *
 * @param sourceCtx 原始图像的 Canvas Context
 * @param mask 水印遮罩
 * @param width 图像宽度
 * @param height 图像高度
 * @param onProgress 进度回调
 * @returns 修复后的 ImageData
 */
export function inpaintMaskedArea(
  sourceCtx: CanvasRenderingContext2D,
  mask: WatermarkMask,
  width: number,
  height: number,
  onProgress?: (percent: number) => void,
): ImageData {
  const imageData = sourceCtx.getImageData(0, 0, width, height);
  const pixels = imageData.data;

  // 将遮罩转为数组以便快速查找
  const maskSet = mask.maskedPixels;
  const maskedArr = Array.from(maskSet).map((key) => {
    const [x, y] = key.split(",").map(Number);
    return { x, y };
  });

  const total = maskedArr.length;
  if (total === 0) return imageData;

  let processed = 0;

  for (const { x, y } of maskedArr) {
    if (x < 0 || x >= width || y < 0 || y >= height) {
      processed++;
      continue;
    }

    // 采样周围未标记的像素，计算均值
    const sampleRadius = 15;
    let rSum = 0, gSum = 0, bSum = 0, aSum = 0, count = 0;

    for (let dy = -sampleRadius; dy <= sampleRadius; dy++) {
      for (let dx = -sampleRadius; dx <= sampleRadius; dx++) {
        const sx = x + dx;
        const sy = y + dy;
        if (sx < 0 || sx >= width || sy < 0 || sy >= height) continue;

        // 跳过标记区域内的像素
        if (maskSet.has(`${sx},${sy}`)) continue;

        const idx = (sy * width + sx) * 4;
        rSum += pixels[idx];
        gSum += pixels[idx + 1];
        bSum += pixels[idx + 2];
        aSum += pixels[idx + 3];
        count++;
      }
    }

    // 用均值替换当前像素
    const idx = (y * width + x) * 4;
    if (count > 0) {
      pixels[idx] = Math.round(rSum / count);
      pixels[idx + 1] = Math.round(gSum / count);
      pixels[idx + 2] = Math.round(bSum / count);
      pixels[idx + 3] = Math.round(aSum / count);
    }

    processed++;
    if (onProgress && processed % 100 === 0) {
      onProgress(Math.round((processed / total) * 100));
    }
  }

  if (onProgress) onProgress(100);
  return imageData;
}

/**
 * 加载图片文件到 Canvas
 */
export function loadImageToCanvas(
  file: File,
  canvas: HTMLCanvasElement,
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      // 限制最大尺寸，防止内存溢出
      const MAX_SIZE = 2048;
      let w = img.naturalWidth;
      let h = img.naturalHeight;

      if (w > MAX_SIZE || h > MAX_SIZE) {
        const ratio = Math.min(MAX_SIZE / w, MAX_SIZE / h);
        w = Math.round(w * ratio);
        h = Math.round(h * ratio);
      }

      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      resolve({ width: w, height: h });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("图片加载失败"));
    };

    img.src = url;
  });
}

/**
 * 触发下载处理后的图片
 */
export function downloadImage(canvas: HTMLCanvasElement, filename: string): void {
  const link = document.createElement("a");
  link.download = filename.replace(/\.(jpg|jpeg|png|webp)$/i, "_去水印.png");
  link.href = canvas.toDataURL("image/png");
  link.click();
}
