/** 简繁转换引擎 —— 使用 chinese-s2t 库 */
import { s2t, t2s } from "chinese-s2t";

export function simplify(text: string): string { return t2s(text); }
export function traditionalize(text: string): string { return s2t(text); }

/** 常用词汇补充（库可能遗漏的台湾/香港用词差异） */
const phraseMap: Record<string, string> = {
  "服务器":"伺服器","软件":"軟體","硬件":"硬體","信息":"資訊","网络":"網路",
  "鼠标":"滑鼠","屏幕":"螢幕","文件":"檔案","内存":"記憶體","硬盘":"硬碟",
  "程序":"程式","命令行":"命令列","数据库":"資料庫","默认":"預設",
  "视频":"影片","音频":"音訊","分辨率":"解析度","像素":"畫素",
};
const reversePhraseMap = Object.fromEntries(Object.entries(phraseMap).map(([k,v])=>[v,k]));

export function traditionalizeFull(text: string): string {
  let result = traditionalize(text);
  for (const [simp, trad] of Object.entries(phraseMap)) result = result.replaceAll(simp, trad);
  return result;
}
export function simplifyFull(text: string): string {
  let result = simplify(text);
  for (const [trad, simp] of Object.entries(reversePhraseMap)) result = result.replaceAll(trad, simp);
  return result;
}
