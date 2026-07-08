/** 火星文 + 圣旨生成器引擎 */

const marsMap: Record<string, string> = {
  "的":"の","了":"ㄋ","是":"昰","我":"莪","你":"伱","他":"彵","她":"咃","们":"扪",
  "在":"洅","不":"卟","一":"⒈","二":"⒉","三":"⒊","四":"⒋","五":"⒌","六":"⒍","七":"⒎","八":"⒏","九":"⒐","零":"⓪",
  "好":"恏","爱":"嫒","想":"想-","看":"看-","说":"说-","做":"做-",
  "啊":"吖","哦":"喔","嗯":"摁","吧":"紦","吗":"鎷","么":"庅","哈":"鉿",
  "心":"忄","笑":"笶","哭":"哭-","玩":"琓","吃":"吃-","睡":"睡-",
};

export function toMartian(text: string): string {
  return text.split("").map(c => marsMap[c] || c).join("");
}

export function fromMartian(text: string): string {
  const reverse: Record<string, string> = {};
  for (const [k, v] of Object.entries(marsMap)) reverse[v] = k;
  return text.split("").map(c => reverse[c] || c).join("");
}

export interface EdictOptions {
  title: string;      // 如"吃饭诏书"
  recipient: string;  // 颁发给谁
  content: string;    // 诏书内容
  emperor: string;    // 朕的名字
}

export function generateEdict(opts: EdictOptions): string {
  const date = new Date().toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" });
  return `奉天承运，皇帝诏曰：

${opts.content}

钦此，赐予${opts.recipient}。
如有违逆，格杀勿论！

${opts.emperor}
${date}`;
}

export function generateWill(name: string, items: string[]): string {
  const date = new Date().toLocaleDateString("zh-CN");
  const itemList = items.map((item, i) => `${i + 1}. ${item}`).join("\n");
  return `【电子遗言】

本人 ${name}，在 ${date}，郑重声明：

${itemList}

以上内容在本人意识清醒状态下书写，具有法律效力（大概吧）。

签名：${name}
日期：${date}

💀 此遗言由"工具派"自动生成，仅供娱乐。珍惜当下，好好活着。`;
}
