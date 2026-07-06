/**
 * 图片处理引擎
 * 所有操作在浏览器 Canvas 完成，不上传服务器
 */

export type ImageFormat = "image/jpeg" | "image/png" | "image/webp" | "image/avif";

export interface CompressOptions {
  quality: number; // 0.1 - 1.0
  maxWidth?: number; // 最大宽度 px
  maxHeight?: number; // 最大高度 px
  format: ImageFormat;
}

export interface ImageInfo {
  name: string;
  originalSize: number; // bytes
  compressedSize: number;
  width: number;
  height: number;
  blob: Blob;
  previewUrl: string;
}

/**
 * 压缩单张图片
 */
export async function compressImage(
  file: File,
  options: CompressOptions,
): Promise<ImageInfo> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = () => {
      img.src = reader.result as string;
    };
    reader.onerror = () => reject(new Error("文件读取失败"));

    img.onload = () => {
      // 计算目标尺寸
      let { width, height } = img;
      if (options.maxWidth && width > options.maxWidth) {
        height = Math.round((options.maxWidth / width) * height);
        width = options.maxWidth;
      }
      if (options.maxHeight && height > options.maxHeight) {
        width = Math.round((options.maxHeight / height) * width);
        height = options.maxHeight;
      }

      // Canvas 绘制
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas 初始化失败"));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      // 导出压缩后 Blob
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("图片导出失败"));
            return;
          }

          resolve({
            name: file.name,
            originalSize: file.size,
            compressedSize: blob.size,
            width,
            height,
            blob,
            previewUrl: URL.createObjectURL(blob),
          });
        },
        options.format,
        options.quality,
      );
    };
    img.onerror = () => reject(new Error("图片加载失败，请检查文件格式"));

    reader.readAsDataURL(file);
  });
}

/**
 * 图片格式转换
 */
export async function convertImageFormat(
  file: File,
  targetFormat: ImageFormat,
  quality = 0.9,
): Promise<ImageInfo> {
  return compressImage(file, {
    quality,
    format: targetFormat,
    // 格式转换不改变尺寸
  });
}

/** 获取格式扩展名 */
export function formatToExtension(format: ImageFormat): string {
  switch (format) {
    case "image/jpeg": return ".jpg";
    case "image/png": return ".png";
    case "image/webp": return ".webp";
    case "image/avif": return ".avif";
  }
}

/** 格式化文件大小 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
