/**
 * 二维码生成器引擎
 * —— 封装 qrcode 库，提供纯函数接口
 */

import QRCode from "qrcode";

export interface QROptions {
  text: string;
  size: number; // 像素尺寸 (128-512)
  darkColor: string; // 深色模块颜色 (默认 #000000)
  lightColor: string; // 浅色模块颜色 (默认 #ffffff)
  errorCorrection: "L" | "M" | "Q" | "H"; // 纠错级别：L(7%) M(15%) Q(25%) H(30%)
}

/**
 * 生成二维码 Canvas
 * 返回 HTMLCanvasElement，可直接展示或导出
 */
export async function generateQRCanvas(
  opts: QROptions,
): Promise<HTMLCanvasElement> {
  const canvas = document.createElement("canvas");
  await QRCode.toCanvas(canvas, opts.text || " ", {
    width: opts.size,
    margin: 2,
    color: {
      dark: opts.darkColor,
      light: opts.lightColor,
    },
    errorCorrectionLevel: opts.errorCorrection,
  });
  return canvas;
}

/**
 * 生成二维码 Data URL（适合 <img> 标签展示）
 */
export async function generateQRDataURL(opts: QROptions): Promise<string> {
  return QRCode.toDataURL(opts.text || " ", {
    width: opts.size,
    margin: 2,
    color: {
      dark: opts.darkColor,
      light: opts.lightColor,
    },
    errorCorrectionLevel: opts.errorCorrection,
  });
}

/**
 * 将 Logo 绘制到二维码 Canvas 中央
 * @param canvas 二维码 canvas
 * @param logoImg Logo 图片元素
 * @param logoSize Logo 占二维码的比例 (0.15-0.3)
 */
export function drawLogoOnQR(
  canvas: HTMLCanvasElement,
  logoImg: HTMLImageElement,
  logoSize: number = 0.2,
): HTMLCanvasElement {
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  const size = canvas.width * logoSize;
  const x = (canvas.width - size) / 2;
  const y = (canvas.height - size) / 2;

  // 白色背景圆角（让 Logo 和二维码隔开）
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(canvas.width / 2, canvas.height / 2, size / 2 + 4, 0, Math.PI * 2);
  ctx.fill();

  // 绘制 Logo
  ctx.drawImage(logoImg, x, y, size, size);

  return canvas;
}

/**
 * 将 Canvas 导出为 PNG 并触发下载
 */
export function downloadCanvasAsPNG(
  canvas: HTMLCanvasElement,
  filename: string = "qrcode.png",
): void {
  const link = document.createElement("a");
  link.download = filename;
  link.href = canvas.toDataURL("image/png");
  link.click();
}
