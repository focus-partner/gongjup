/**
 * 单位换算引擎
 * 涵盖长度、重量、温度、面积、体积、速度六大类
 */

export type UnitCategory = "length" | "weight" | "temperature" | "area" | "volume" | "speed";

export interface UnitDef {
  key: string;
  name: string; // 中文名
  symbol: string; // 符号
  toBase: (v: number) => number; // 转基准单位
  fromBase: (v: number) => number; // 从基准单位转回
}

// 基准单位: 长度=米, 重量=千克, 温度=开尔文, 面积=平方米, 体积=升, 速度=m/s
const UNITS: Record<UnitCategory, UnitDef[]> = {
  length: [
    { key: "mm", name: "毫米", symbol: "mm", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    { key: "cm", name: "厘米", symbol: "cm", toBase: (v) => v / 100, fromBase: (v) => v * 100 },
    { key: "m", name: "米", symbol: "m", toBase: (v) => v, fromBase: (v) => v },
    { key: "km", name: "千米", symbol: "km", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    { key: "inch", name: "英寸", symbol: "in", toBase: (v) => v * 0.0254, fromBase: (v) => v / 0.0254 },
    { key: "ft", name: "英尺", symbol: "ft", toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
    { key: "mile", name: "英里", symbol: "mi", toBase: (v) => v * 1609.344, fromBase: (v) => v / 1609.344 },
  ],
  weight: [
    { key: "mg", name: "毫克", symbol: "mg", toBase: (v) => v / 1_000_000, fromBase: (v) => v * 1_000_000 },
    { key: "g", name: "克", symbol: "g", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    { key: "kg", name: "千克", symbol: "kg", toBase: (v) => v, fromBase: (v) => v },
    { key: "ton", name: "吨", symbol: "t", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    { key: "lb", name: "磅", symbol: "lb", toBase: (v) => v * 0.453592, fromBase: (v) => v / 0.453592 },
    { key: "oz", name: "盎司", symbol: "oz", toBase: (v) => v * 0.0283495, fromBase: (v) => v / 0.0283495 },
    { key: "jin", name: "斤", symbol: "斤", toBase: (v) => v * 0.5, fromBase: (v) => v / 0.5 },
  ],
  temperature: [
    {
      key: "c", name: "摄氏度", symbol: "℃",
      toBase: (v) => v + 273.15, fromBase: (v) => v - 273.15,
    },
    {
      key: "f", name: "华氏度", symbol: "℉",
      toBase: (v) => (v - 32) * 5 / 9 + 273.15,
      fromBase: (v) => (v - 273.15) * 9 / 5 + 32,
    },
    {
      key: "k", name: "开尔文", symbol: "K",
      toBase: (v) => v, fromBase: (v) => v,
    },
  ],
  area: [
    { key: "m2", name: "平方米", symbol: "m²", toBase: (v) => v, fromBase: (v) => v },
    { key: "km2", name: "平方千米", symbol: "km²", toBase: (v) => v * 1_000_000, fromBase: (v) => v / 1_000_000 },
    { key: "ha", name: "公顷", symbol: "ha", toBase: (v) => v * 10000, fromBase: (v) => v / 10000 },
    { key: "mu", name: "亩", symbol: "亩", toBase: (v) => v * 666.667, fromBase: (v) => v / 666.667 },
    { key: "ft2", name: "平方英尺", symbol: "ft²", toBase: (v) => v * 0.092903, fromBase: (v) => v / 0.092903 },
  ],
  volume: [
    { key: "ml", name: "毫升", symbol: "mL", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    { key: "l", name: "升", symbol: "L", toBase: (v) => v, fromBase: (v) => v },
    { key: "m3", name: "立方米", symbol: "m³", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    { key: "gal", name: "加仑(美)", symbol: "gal", toBase: (v) => v * 3.78541, fromBase: (v) => v / 3.78541 },
    { key: "cup", name: "杯(美)", symbol: "cup", toBase: (v) => v * 0.236588, fromBase: (v) => v / 0.236588 },
  ],
  speed: [
    { key: "ms", name: "米/秒", symbol: "m/s", toBase: (v) => v, fromBase: (v) => v },
    { key: "kmh", name: "千米/时", symbol: "km/h", toBase: (v) => v / 3.6, fromBase: (v) => v * 3.6 },
    { key: "mph", name: "英里/时", symbol: "mph", toBase: (v) => v * 0.44704, fromBase: (v) => v / 0.44704 },
    { key: "knot", name: "节", symbol: "kn", toBase: (v) => v * 0.514444, fromBase: (v) => v / 0.514444 },
  ],
};

export const CATEGORY_NAMES: Record<UnitCategory, string> = {
  length: "长度",
  weight: "重量",
  temperature: "温度",
  area: "面积",
  volume: "体积",
  speed: "速度",
};

/** 执行单位换算 */
export function convertUnit(
  value: number,
  fromKey: string,
  toKey: string,
  category: UnitCategory,
): number {
  const units = UNITS[category];
  const fromUnit = units.find((u) => u.key === fromKey);
  const toUnit = units.find((u) => u.key === toKey);

  if (!fromUnit || !toUnit) return NaN;

  const baseValue = fromUnit.toBase(value);
  return toUnit.fromBase(baseValue);
}

export function getUnits(category: UnitCategory): UnitDef[] {
  return UNITS[category];
}
