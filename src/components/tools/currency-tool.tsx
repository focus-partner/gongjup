"use client";

import { useState, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getExchangeRates, convertCurrency, CURRENCIES } from "@/engines/currency";
import { ArrowRightLeft } from "lucide-react";

/** 汇率换算工具 */
export function CurrencyTool() {
  const [amount, setAmount] = useState(100);
  const [fromCode, setFromCode] = useState("USD");
  const [toCode, setToCode] = useState("CNY");
  const [rates, setRates] = useState<Record<string, number>>({});
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    getExchangeRates().then((r) => {
      setRates(r.rates);
      setIsLive(r.isLive);
    });
  }, []);

  const result = useMemo(() => {
    return convertCurrency(amount, fromCode, toCode, rates);
  }, [amount, fromCode, toCode, rates]);

  const swap = () => {
    setFromCode(toCode);
    setToCode(fromCode);
  };

  const formatNum = (n: number) => {
    if (isNaN(n)) return "--";
    if (n >= 1000) return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
    return n.toLocaleString(undefined, { maximumFractionDigits: 4 });
  };

  return (
    <div className="space-y-4">
      {/* 金额输入 */}
      <div>
        <label className="text-sm font-medium mb-1.5 block">金额</label>
        <Input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value) || 0)}
          className="text-lg font-mono"
        />
      </div>

      {/* 货币选择 */}
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <label className="text-sm font-medium mb-1.5 block">源货币</label>
          <select
            value={fromCode}
            onChange={(e) => setFromCode(e.target.value)}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
          >
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.symbol} {c.code} - {c.name}
              </option>
            ))}
          </select>
        </div>

        <Button variant="outline" size="icon" onClick={swap} className="mb-0.5" title="交换">
          <ArrowRightLeft className="h-4 w-4" />
        </Button>

        <div className="flex-1">
          <label className="text-sm font-medium mb-1.5 block">目标货币</label>
          <select
            value={toCode}
            onChange={(e) => setToCode(e.target.value)}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
          >
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.symbol} {c.code} - {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 结果 */}
      <div className="rounded-xl border border-primary/30 bg-primary/5 p-5 text-center">
        <p className="text-sm text-muted-foreground mb-1">换算结果</p>
        <p className="text-3xl font-bold text-primary">
          {CURRENCIES.find((c) => c.code === toCode)?.symbol} {formatNum(result)}
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          {isLive ? "✅ 实时汇率" : "⚠️ 参考汇率（API 暂不可用）"}
        </p>
      </div>
    </div>
  );
}
