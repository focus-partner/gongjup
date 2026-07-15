/** Word→MD + HTML→文本 + CSS/JS压缩 + URL Slug + 密码强度 */

// Word→MD via mammoth (browser-compatible)
export async function wordToMarkdown(file: File): Promise<string> {
  const mammoth = await import("mammoth");
  const arrBuf = await file.arrayBuffer();
  const result = await (mammoth as any).convertToMarkdown({ arrayBuffer: arrBuf });
  return result.value;
}

// HTML→纯文本
export function htmlToText(html: string): string {
  if (typeof document !== "undefined") { const d = document.createElement("div"); d.innerHTML = html; return d.textContent || "" }
  return html.replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/\s+/g, " ").trim();
}

// CSS压缩
export function minifyCSS(css: string): string { return css.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, " ").replace(/\s*([{}:;,])\s*/g, "$1").replace(/;}/g, "}").trim() }

// JS压缩（简易）
export function minifyJS(js: string): string { return js.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "").replace(/\s+/g, " ").replace(/\s*([{}();,:])\s*/g, "$1").trim() }

// URL Slug
export function toSlug(text: string): string { return text.replace(/[^\w一-鿿-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "").toLowerCase().slice(0, 80) || "untitled" }

// 密码强度
export function checkPasswordStrength(pw: string): { score: number; label: string; color: string; checks: { label: string; pass: boolean }[] } {
  const checks = [
    { label: "至少8位", pass: pw.length >= 8 },
    { label: "包含大写字母", pass: /[A-Z]/.test(pw) },
    { label: "包含小写字母", pass: /[a-z]/.test(pw) },
    { label: "包含数字", pass: /\d/.test(pw) },
    { label: "包含特殊符号", pass: /[^A-Za-z0-9]/.test(pw) },
    { label: "至少12位", pass: pw.length >= 12 },
  ];
  const passed = checks.filter(c => c.pass).length;
  const levels = [{ score: 0, label: "弱", color: "text-red-500" }, { score: 2, label: "较弱", color: "text-orange-500" }, { score: 3, label: "一般", color: "text-amber-500" }, { score: 4, label: "较强", color: "text-green-500" }, { score: 5, label: "强", color: "text-emerald-500" }, { score: 6, label: "非常强", color: "text-emerald-600" }];
  const level = levels.find(l => passed <= l.score) || levels[levels.length - 1];
  return { score: passed, label: level.label, color: level.color, checks };
}
