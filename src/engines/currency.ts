/**
 * 汇率换算引擎
 *
 * 数据来源：exchangerate-api.com 免费层（1500 req/month）
 * 提供常见货币的静态汇率作为 Fallback
 */

// 常见货币符号与中文名
export const CURRENCIES: { code: string; name: string; symbol: string }[] = [
  { code: "CNY", name: "人民币", symbol: "¥" },
  { code: "USD", name: "美元", symbol: "$" },
  { code: "EUR", name: "欧元", symbol: "€" },
  { code: "JPY", name: "日元", symbol: "¥" },
  { code: "KRW", name: "韩元", symbol: "₩" },
  { code: "GBP", name: "英镑", symbol: "£" },
  { code: "HKD", name: "港币", symbol: "HK$" },
  { code: "TWD", name: "新台币", symbol: "NT$" },
  { code: "AUD", name: "澳元", symbol: "A$" },
  { code: "CAD", name: "加元", symbol: "C$" },
  { code: "SGD", name: "新加坡元", symbol: "S$" },
  { code: "THB", name: "泰铢", symbol: "฿" },
  { code: "MYR", name: "马来西亚林吉特", symbol: "RM" },
  { code: "PHP", name: "菲律宾比索", symbol: "₱" },
  { code: "VND", name: "越南盾", symbol: "₫" },
  { code: "INR", name: "印度卢比", symbol: "₹" },
  { code: "RUB", name: "俄罗斯卢布", symbol: "₽" },
  { code: "CHF", name: "瑞士法郎", symbol: "CHF" },
];

// 静态汇率 Fallback（以 CNY 为基准，更新时间会显示在 UI）
const FALLBACK_RATES: Record<string, number> = {
  CNY: 1, USD: 0.138, EUR: 0.128, JPY: 21.7, KRW: 190,
  GBP: 0.11, HKD: 1.08, TWD: 4.45, AUD: 0.21, CAD: 0.19,
  SGD: 0.185, THB: 4.95, MYR: 0.65, PHP: 7.75,
  VND: 3520, INR: 11.5, RUB: 12.5, CHF: 0.123,
};

// 缓存汇率数据
let cachedRates: Record<string, number> | null = null;
let cacheTime = 0;
const CACHE_DURATION = 1000 * 60 * 60; // 1 小时

/**
 * 获取实时汇率（优先 API，失败用 Fallback）
 */
export async function getExchangeRates(): Promise<{
  rates: Record<string, number>;
  isLive: boolean;
  updatedAt: string;
}> {
  // 检查缓存
  if (cachedRates && Date.now() - cacheTime < CACHE_DURATION) {
    return { rates: cachedRates, isLive: true, updatedAt: new Date(cacheTime).toISOString() };
  }

  try {
    const res = await fetch("https://open.er-api.com/v6/latest/CNY");
    if (res.ok) {
      const data = await res.json();
      cachedRates = data.rates;
      cacheTime = Date.now();
      return { rates: cachedRates!, isLive: true, updatedAt: new Date().toISOString() };
    }
  } catch {
    // API 调用失败，使用 Fallback
  }

  return { rates: FALLBACK_RATES, isLive: false, updatedAt: new Date().toISOString() };
}

/**
 * 货币换算
 * @param amount 金额
 * @param fromCode 源货币代码
 * @param toCode 目标货币代码
 * @param rates 汇率表
 */
export function convertCurrency(
  amount: number,
  fromCode: string,
  toCode: string,
  rates: Record<string, number>,
): number {
  const fromRate = rates[fromCode];
  const toRate = rates[toCode];

  if (!fromRate || !toRate) return NaN;

  // 先转成 CNY 基准，再转目标货币
  const amountInCNY = amount / fromRate;
  return amountInCNY * toRate;
}
