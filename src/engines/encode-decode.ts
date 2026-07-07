/** 编码解码工具引擎 */

export function urlEncode(text: string): string { try { return encodeURIComponent(text); } catch { return text; } }
export function urlDecode(text: string): string { try { return decodeURIComponent(text); } catch { return "解码失败：格式不正确"; } }

export function base64Encode(text: string): string { try { return btoa(unescape(encodeURIComponent(text))); } catch { return "编码失败"; } }
export function base64Decode(text: string): string { try { return decodeURIComponent(escape(atob(text))); } catch { return "解码失败：格式不正确"; } }

export function htmlEncode(text: string): string {
  return text.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");
}
export function htmlDecode(text: string): string {
  return text.replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,'"').replace(/&#39;/g,"'");
}
