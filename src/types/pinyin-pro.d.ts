declare module "pinyin-pro" {
  interface PinyinOptions {
    toneType?: "none" | "num" | "symbol";
    type?: "string" | "array";
  }
  export function pinyin(text: string, options?: PinyinOptions): string | string[][];
}
