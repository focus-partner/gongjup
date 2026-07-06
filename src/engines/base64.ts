/**
 * Base64 编解码引擎
 *
 * 纯前端实现，使用浏览器内置 btoa/atob + TextEncoder/TextDecoder 处理 Unicode
 */

export interface Base64Result {
  success: boolean;
  result: string;
  error?: string;
}

/** 文本 → Base64 编码 */
export function encodeBase64(text: string): Base64Result {
  try {
    if (!text.trim()) {
      return { success: false, result: "", error: "请输入要编码的文本" };
    }
    // 使用 TextEncoder 处理 Unicode 字符（btoa 不支持中文）
    const bytes = new TextEncoder().encode(text);
    let binary = "";
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    const encoded = btoa(binary);
    return { success: true, result: encoded };
  } catch (e) {
    return {
      success: false,
      result: "",
      error: `编码失败: ${e instanceof Error ? e.message : "未知错误"}`,
    };
  }
}

/** Base64 → 文本解码 */
export function decodeBase64(base64: string): Base64Result {
  try {
    if (!base64.trim()) {
      return { success: false, result: "", error: "请输入要解码的 Base64 文本" };
    }
    // 清理输入
    const cleaned = base64.replace(/\s/g, "");
    const binary = atob(cleaned);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const decoded = new TextDecoder("utf-8").decode(bytes);
    return { success: true, result: decoded };
  } catch (e) {
    return {
      success: false,
      result: "",
      error: `解码失败: ${e instanceof Error ? e.message : "未知错误"}。请检查输入是否为有效 Base64。`,
    };
  }
}
