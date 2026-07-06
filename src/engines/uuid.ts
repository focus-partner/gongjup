/**
 * UUID 生成引擎
 * 支持 UUID v4 标准格式，批量生成
 */

/** 生成单个 UUID v4 */
export function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/** 批量生成 UUID */
export function generateUUIDs(count: number): string[] {
  return Array.from({ length: Math.min(count, 1000) }, () => generateUUID());
}

/** 生成无连字符的 UUID */
export function generateUUIDSimple(): string {
  return generateUUID().replace(/-/g, "");
}
