/** JSON格式化 + 文本去重 + 正则测试引擎 */

export function formatJSON(text: string, indent: number=2): string {
  try { return JSON.stringify(JSON.parse(text), null, indent) }
  catch { return "JSON格式错误，请检查输入" }
}
export function validateJSON(text: string): {valid:boolean; error?:string} {
  try { JSON.parse(text); return {valid:true} }
  catch(e) { return {valid:false, error:(e as Error).message} }
}
export function minifyJSON(text: string): string {
  try { return JSON.stringify(JSON.parse(text)) }
  catch { return "JSON格式错误" }
}

export function dedupLines(text: string, trimLines: boolean=true): {original:number; unique:number; result:string} {
  const lines = text.split("\n").map(l=>trimLines?l.trim():l).filter(l=>l);
  const unique = [...new Set(lines)];
  return {original:lines.length, unique:unique.length, result:unique.join("\n")}
}

export function regexTest(pattern: string, flags: string, text: string): {matches: string[]; count:number; error?:string} {
  try { const re=new RegExp(pattern,flags); const m=text.match(re); return {matches:m||[], count:m?m.length:0} }
  catch(e) { return {matches:[], count:0, error:(e as Error).message} }
}
