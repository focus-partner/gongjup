/** 汉字转拼音引擎 */
import { pinyin } from "pinyin-pro";

export function toPinyin(text: string, toneType: "none"|"num"|"symbol"="none"): string {
  return pinyin(text, { toneType, type: "string" }) as string;
}
export function toPinyinArray(text: string): string[][] {
  return pinyin(text, { toneType: "none", type: "array" }) as string[][];
}
