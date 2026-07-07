/** 日期计算器引擎 */

export function addDays(date: Date, days: number): Date { const d = new Date(date); d.setDate(d.getDate() + days); return d; }
export function diffDays(a: Date, b: Date): number { return Math.ceil((b.getTime() - a.getTime()) / 86400000); }
export function diffWorkdays(a: Date, b: Date): number {
  let count = 0; const cur = new Date(a);
  while (cur <= b) { const day = cur.getDay(); if (day !== 0 && day !== 6) count++; cur.setDate(cur.getDate() + 1); }
  return count;
}
export function isWeekend(d: Date): boolean { return d.getDay() === 0 || d.getDay() === 6; }
export function formatDateCN(d: Date): string { return `${d.getFullYear()}年${d.getMonth()+1}月${d.getDate()}日 星期${"日一二三四五六"[d.getDay()]}`; }
