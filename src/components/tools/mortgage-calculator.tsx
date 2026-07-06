"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  calculateMortgage,
  type LoanType,
  type PaymentMethod,
  type MortgageResult,
} from "@/engines/mortgage";

/** 默认 LPR 利率（2025年参考值） */
const DEFAULT_COMMERCIAL_RATE = 3.6;
const DEFAULT_PROVIDENT_RATE = 2.85;

/**
 * 房贷计算器 UI
 * 分三个 Tab：商业贷款 / 公积金贷款 / 组合贷款
 */
export function MortgageCalculator() {
  // 贷款类型
  const [loanType, setLoanType] = useState<LoanType>("commercial");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("equal-installment");

  // 金额（万元）
  const [commercialAmount, setCommercialAmount] = useState(100);
  const [providentAmount, setProvidentAmount] = useState(50);

  // 利率
  const [commercialRate, setCommercialRate] = useState(DEFAULT_COMMERCIAL_RATE);
  const [providentRate, setProvidentRate] = useState(DEFAULT_PROVIDENT_RATE);

  // 年限
  const [years, setYears] = useState(30);

  // 计算结果
  const result = useMemo<MortgageResult | null>(() => {
    const ca = loanType === "provident" ? 0 : commercialAmount;
    const pa = loanType === "commercial" ? 0 : providentAmount;
    if (ca === 0 && pa === 0) return null;

    return calculateMortgage({
      loanType,
      paymentMethod,
      commercialAmount: ca,
      providentAmount: pa,
      commercialRate,
      providentRate,
      years,
    });
  }, [loanType, paymentMethod, commercialAmount, providentAmount, commercialRate, providentRate, years]);

  // 明细显示控制
  const [showSchedule, setShowSchedule] = useState(false);
  const scheduleSlice = showSchedule
    ? result?.schedule
    : result?.schedule?.slice(0, 12);

  return (
    <div className="space-y-6">
      {/* 贷款类型 + 还款方式 */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Label className="text-sm font-medium mb-2 block">贷款类型</Label>
          <Tabs
            value={loanType}
            onValueChange={(v) => setLoanType(v as LoanType)}
          >
            <TabsList className="w-full">
              <TabsTrigger value="commercial" className="flex-1">商业贷款</TabsTrigger>
              <TabsTrigger value="provident" className="flex-1">公积金贷款</TabsTrigger>
              <TabsTrigger value="combined" className="flex-1">组合贷款</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="flex-1">
          <Label className="text-sm font-medium mb-2 block">还款方式</Label>
          <Tabs
            value={paymentMethod}
            onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}
          >
            <TabsList className="w-full">
              <TabsTrigger value="equal-installment" className="flex-1">
                等额本息
              </TabsTrigger>
              <TabsTrigger value="equal-principal" className="flex-1">
                等额本金
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* 金额输入 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {loanType !== "provident" && (
          <div>
            <Label htmlFor="commercialAmount">商业贷款金额（万元）</Label>
            <Input
              id="commercialAmount"
              type="number"
              value={commercialAmount}
              onChange={(e) => setCommercialAmount(Number(e.target.value) || 0)}
              className="mt-1.5"
            />
          </div>
        )}
        {loanType !== "commercial" && (
          <div>
            <Label htmlFor="providentAmount">公积金贷款金额（万元）</Label>
            <Input
              id="providentAmount"
              type="number"
              value={providentAmount}
              onChange={(e) => setProvidentAmount(Number(e.target.value) || 0)}
              className="mt-1.5"
            />
          </div>
        )}
        <div>
          <Label htmlFor="years">贷款年限</Label>
          <div className="flex items-center gap-3 mt-1.5">
            <input
              id="years"
              type="range"
              min={1}
              max={30}
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="flex-1 accent-primary"
            />
            <span className="text-sm font-medium w-16 text-right">{years} 年</span>
          </div>
        </div>
      </div>

      {/* 利率设置（可展开） */}
      <details className="group">
        <summary className="text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
          利率设置 ▸
        </summary>
        <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-border/50">
          {loanType !== "provident" && (
            <div>
              <Label htmlFor="commercialRate">商业贷款利率（%）</Label>
              <Input
                id="commercialRate"
                type="number"
                step={0.01}
                value={commercialRate}
                onChange={(e) => setCommercialRate(Number(e.target.value) || 0)}
                className="mt-1.5"
              />
            </div>
          )}
          {loanType !== "commercial" && (
            <div>
              <Label htmlFor="providentRate">公积金贷款利率（%）</Label>
              <Input
                id="providentRate"
                type="number"
                step={0.01}
                value={providentRate}
                onChange={(e) => setProvidentRate(Number(e.target.value) || 0)}
                className="mt-1.5"
              />
            </div>
          )}
        </div>
      </details>

      <Separator />

      {/* 计算结果 */}
      {result && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <ResultCard
              title="贷款总额"
              value={`${(result.totalLoan / 10000).toFixed(1)} 万元`}
            />
            <ResultCard
              title="还款总额"
              value={`${(result.totalPayment / 10000).toFixed(1)} 万元`}
            />
            <ResultCard
              title="利息总额"
              value={`${(result.totalInterest / 10000).toFixed(1)} 万元`}
            />
            <ResultCard
              title={paymentMethod === "equal-installment" ? "每月还款" : "首月还款"}
              value={`¥${result.monthlyPayment.toLocaleString()}`}
              highlight
            />
          </div>

          {paymentMethod === "equal-principal" && (
            <p className="text-sm text-muted-foreground">
              等额本金每月递减，末月还款：¥{result.monthlyPaymentLast.toLocaleString()}
            </p>
          )}

          {/* 还款明细表 */}
          <div>
            <button
              onClick={() => setShowSchedule(!showSchedule)}
              className="text-sm text-primary hover:underline"
            >
              {showSchedule ? "收起还款明细 ▲" : "查看还款明细 ▼"}
            </button>

            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50 text-muted-foreground">
                    <th className="text-left py-2 font-medium">期数</th>
                    <th className="text-right py-2 font-medium">月供</th>
                    <th className="text-right py-2 font-medium">本金</th>
                    <th className="text-right py-2 font-medium">利息</th>
                    <th className="text-right py-2 font-medium">剩余本金</th>
                  </tr>
                </thead>
                <tbody>
                  {scheduleSlice?.map((item) => (
                    <tr key={item.month} className="border-b border-border/30">
                      <td className="py-1.5">第 {item.month} 期</td>
                      <td className="text-right py-1.5">¥{item.payment.toLocaleString()}</td>
                      <td className="text-right py-1.5">¥{item.principal.toLocaleString()}</td>
                      <td className="text-right py-1.5">¥{item.interest.toLocaleString()}</td>
                      <td className="text-right py-1.5">
                        ¥{item.remaining.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function ResultCard({
  title,
  value,
  highlight,
}: {
  title: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border/50 bg-card p-4">
      <p className="text-xs text-muted-foreground mb-1">{title}</p>
      <p
        className={`font-bold text-lg ${
          highlight ? "text-primary" : "text-foreground"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
