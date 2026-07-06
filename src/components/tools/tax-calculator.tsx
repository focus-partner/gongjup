"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { calculateTax, type TaxResult } from "@/engines/tax";

/**
 * 个税计算器 UI
 * 核心输入：月薪、年终奖、五险一金、专项附加扣除
 */
export function TaxCalculator() {
  const [monthlySalary, setMonthlySalary] = useState(15000);
  const [yearEndBonus, setYearEndBonus] = useState(30000);
  const [socialInsurance, setSocialInsurance] = useState(1500);

  // 专项附加扣除
  const [children, setChildren] = useState(0); // 子女教育 2000/月/个
  const [housingLoan, setHousingLoan] = useState(0); // 房贷利息 1000/月
  const [housingRent, setHousingRent] = useState(0); // 房租 0/800/1100/1500
  const [elderlyCare, setElderlyCare] = useState(0); // 赡养老人 最高3000/月
  const [infantCare, setInfantCare] = useState(0); // 婴幼儿照护 2000/月/个

  const result = useMemo<TaxResult>(() => {
    return calculateTax({
      monthlySalary,
      yearEndBonus,
      socialInsurance,
      specialDeductions: {
        children: children * 2000,
        continuingEducation: 0,
        housingLoan: housingLoan ? 1000 : 0,
        housingRent,
        elderlyCare,
        infantCare: infantCare * 2000,
      },
    });
  }, [monthlySalary, yearEndBonus, socialInsurance, children, housingLoan, housingRent, elderlyCare, infantCare]);

  const formatMoney = (v: number) => `¥${v.toLocaleString()}`;

  return (
    <div className="space-y-6">
      {/* 基本收入 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="monthlySalary">税前月薪</Label>
          <Input
            id="monthlySalary"
            type="number"
            value={monthlySalary}
            onChange={(e) => setMonthlySalary(Number(e.target.value) || 0)}
            className="mt-1.5"
          />
        </div>
        <div>
          <Label htmlFor="yearEndBonus">年终奖</Label>
          <Input
            id="yearEndBonus"
            type="number"
            value={yearEndBonus}
            onChange={(e) => setYearEndBonus(Number(e.target.value) || 0)}
            className="mt-1.5"
          />
        </div>
        <div>
          <Label htmlFor="socialInsurance">每月五险一金（个人部分）</Label>
          <Input
            id="socialInsurance"
            type="number"
            value={socialInsurance}
            onChange={(e) => setSocialInsurance(Number(e.target.value) || 0)}
            className="mt-1.5"
          />
        </div>
      </div>

      {/* 专项附加扣除 */}
      <details className="group">
        <summary className="text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
          专项附加扣除设置 ▸
        </summary>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-3 pt-3 border-t border-border/50">
          <div>
            <Label htmlFor="children">子女教育（个）</Label>
            <Input
              id="children"
              type="number"
              min={0}
              max={10}
              value={children}
              onChange={(e) => setChildren(Number(e.target.value) || 0)}
              className="mt-1.5"
            />
            <p className="text-[11px] text-muted-foreground mt-1">每个 2000 元/月</p>
          </div>
          <div>
            <Label htmlFor="infantCare">婴幼儿照护（个）</Label>
            <Input
              id="infantCare"
              type="number"
              min={0}
              max={10}
              value={infantCare}
              onChange={(e) => setInfantCare(Number(e.target.value) || 0)}
              className="mt-1.5"
            />
            <p className="text-[11px] text-muted-foreground mt-1">每个 2000 元/月</p>
          </div>
          <div>
            <Label htmlFor="elderlyCare">赡养老人（元/月）</Label>
            <Input
              id="elderlyCare"
              type="number"
              min={0}
              max={3000}
              value={elderlyCare}
              onChange={(e) => setElderlyCare(Number(e.target.value) || 0)}
              className="mt-1.5"
            />
            <p className="text-[11px] text-muted-foreground mt-1">最高 3000 元/月</p>
          </div>
          <div>
            <Label htmlFor="housingRent">住房租金（元/月）</Label>
            <select
              id="housingRent"
              value={housingRent}
              onChange={(e) => setHousingRent(Number(e.target.value))}
              className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
            >
              <option value={0}>无</option>
              <option value={800}>800（中等城市）</option>
              <option value={1100}>1100（大城市）</option>
              <option value={1500}>1500（直辖市/省会）</option>
            </select>
          </div>
          <div>
            <Label>住房贷款利息</Label>
            <label className="flex items-center gap-2 mt-2 cursor-pointer">
              <input
                type="checkbox"
                checked={!!housingLoan}
                onChange={(e) => setHousingLoan(e.target.checked ? 1 : 0)}
                className="accent-primary"
              />
              <span className="text-sm">有首套房贷（1000 元/月）</span>
            </label>
          </div>
        </div>
      </details>

      <Separator />

      {/* 计算结果 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="年应纳税所得额" value={formatMoney(result.annualTaxableIncome)} />
        <StatCard label="年度个税" value={formatMoney(result.annualTax)} />
        <StatCard label="月均个税" value={formatMoney(result.monthlyTax)} />
        <StatCard label="实际税率" value={`${result.effectiveRate}%`} highlight />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <StatCard label="年税后收入（最优）" value={formatMoney(result.annualNetIncome)} highlight />
        <StatCard label="月税后收入" value={formatMoney(result.monthlyNetIncome)} />
      </div>

      {/* 年终奖计税建议 */}
      {yearEndBonus > 0 && (
        <Card className="bg-amber-50/50 dark:bg-amber-950/10 border-amber-200 dark:border-amber-800">
          <CardContent className="pt-4">
            <p className="text-sm font-medium">
              💡 年终奖计税建议：
              {result.recommendedMethod === "separate"
                ? " 推荐「单独计税」，可节省 "
                : " 推荐「并入综合所得」，可节省 "}
              <span className="text-primary font-bold">
                ¥{Math.abs(result.bonusTaxSeparate - result.bonusTaxCombined).toLocaleString()}
              </span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              单独计税：{formatMoney(result.bonusTaxSeparate)} | 并入综合：{formatMoney(result.bonusTaxCombined)}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border/50 bg-card p-4">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className={`font-bold text-lg ${highlight ? "text-primary" : "text-foreground"}`}>
        {value}
      </p>
    </div>
  );
}
