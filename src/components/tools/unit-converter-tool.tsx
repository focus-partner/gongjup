"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { convertUnit, getUnits, CATEGORY_NAMES, type UnitCategory } from "@/engines/unit-convert";
import { ArrowRightLeft } from "lucide-react";

/**
 * 单位换算工具
 * 支持 6 大类单位互转
 */
export function UnitConverterTool() {
  const [category, setCategory] = useState<UnitCategory>("length");
  const [value, setValue] = useState(1);
  const [fromUnit, setFromUnit] = useState("m");
  const [toUnit, setToUnit] = useState("cm");

  const units = useMemo(() => getUnits(category), [category]);

  const result = useMemo(() => {
    const r = convertUnit(value, fromUnit, toUnit, category);
    return isNaN(r) ? null : r;
  }, [value, fromUnit, toUnit, category]);

  const swap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  // 根据结果大小决定小数位数
  const formatResult = (n: number) => {
    if (Math.abs(n) < 0.0001) return n.toExponential(4);
    if (Math.abs(n) < 1) return n.toFixed(6);
    if (Math.abs(n) >= 1_000_000) return n.toExponential(4);
    return n.toLocaleString(undefined, { maximumFractionDigits: 6 });
  };

  return (
    <div className="space-y-4">
      {/* 类别选择 */}
      <Tabs value={category} onValueChange={(v) => {
        setCategory(v as UnitCategory);
        const us = getUnits(v as UnitCategory);
        setFromUnit(us[0].key);
        setToUnit(us[1]?.key || us[0].key);
      }}>
        <TabsList className="flex-wrap">
          {(Object.keys(CATEGORY_NAMES) as UnitCategory[]).map((cat) => (
            <TabsTrigger key={cat} value={cat} className="text-xs">
              {CATEGORY_NAMES[cat]}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* 输入值 */}
      <Input
        type="number"
        value={value}
        onChange={(e) => setValue(Number(e.target.value) || 0)}
        className="text-lg font-mono"
      />

      {/* 单位选择 + 结果 */}
      <div className="flex items-center gap-2">
        <select
          value={fromUnit}
          onChange={(e) => setFromUnit(e.target.value)}
          className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm"
        >
          {units.map((u) => (
            <option key={u.key} value={u.key}>
              {u.name} ({u.symbol})
            </option>
          ))}
        </select>

        <button
          onClick={swap}
          className="h-9 w-9 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors shrink-0"
          title="交换单位"
        >
          <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />
        </button>

        <select
          value={toUnit}
          onChange={(e) => setToUnit(e.target.value)}
          className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm"
        >
          {units.map((u) => (
            <option key={u.key} value={u.key}>
              {u.name} ({u.symbol})
            </option>
          ))}
        </select>
      </div>

      {/* 结果 */}
      {result !== null && (
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-5 text-center">
          <p className="text-sm text-muted-foreground mb-1">换算结果</p>
          <p className="text-3xl font-bold text-primary font-mono">
            {formatResult(result)}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {getUnits(category).find((u) => u.key === toUnit)?.symbol}
          </p>
        </div>
      )}
    </div>
  );
}
