"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  calculateSocialInsurance,
  CITY_LIST,
  CITY_CONFIGS,
} from "@/engines/social-insurance";

/** 五险一金计算器 */
export function SocialInsuranceTool() {
  const [cityKey, setCityKey] = useState("beijing");
  const [salary, setSalary] = useState(15000);
  const [housingRate, setHousingRate] = useState(12);

  const result = useMemo(
    () => calculateSocialInsurance({ cityKey, salary, housingFundRate: housingRate }),
    [cityKey, salary, housingRate],
  );

  const config = CITY_CONFIGS[cityKey];

  const formatYuan = (v: number) => `¥${v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="space-y-6">
      {/* 输入区 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="city">城市</Label>
          <select
            id="city"
            value={cityKey}
            onChange={(e) => setCityKey(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
          >
            {CITY_LIST.map((c) => (
              <option key={c.key} value={c.key}>
                {c.city}（{c.province}）
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="si-salary">税前月工资</Label>
          <Input
            id="si-salary"
            type="number"
            value={salary}
            onChange={(e) => setSalary(Number(e.target.value) || 0)}
            className="mt-1.5"
          />
        </div>
        <div>
          <Label htmlFor="housingRate">公积金比例（{housingRate}%）</Label>
          <input
            id="housingRate"
            type="range"
            min={5}
            max={12}
            value={housingRate}
            onChange={(e) => setHousingRate(Number(e.target.value))}
            className="mt-1.5 w-full accent-primary"
          />
        </div>
      </div>

      {/* 社保基数提示 */}
      {config && (
        <p className="text-xs text-muted-foreground bg-muted/50 rounded-lg px-3 py-2">
          📌 {config.city}缴费基数范围：{config.baseMin.toLocaleString()} ~ {config.baseMax.toLocaleString()} 元/月。
          工资在此范围内按实际计算，超出上下限按上下限计算。
        </p>
      )}

      {result && (
        <>
          {/* 汇总数据 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard label="缴费基数" value={formatYuan(result.salary)} />
            <StatCard label="个人缴纳" value={formatYuan(result.personalTotal)} />
            <StatCard label="单位缴纳" value={formatYuan(result.employerTotal)} />
            <StatCard label="五险一金后到手" value={formatYuan(result.netSalary)} highlight />
          </div>

          {/* 明细表 */}
          <div className="overflow-x-auto rounded-xl border border-border/50">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50 bg-muted/30 text-muted-foreground">
                  <th className="text-left py-2 px-3 font-medium">项目</th>
                  <th className="text-right py-2 px-3 font-medium">个人</th>
                  <th className="text-right py-2 px-3 font-medium">单位</th>
                  <th className="text-right py-2 px-3 font-medium">比例</th>
                </tr>
              </thead>
              <tbody>
                <TableRow label="养老保险" personal={result.personalPension} employer={result.employerPension} personalRate={config?.pensionEmployee} employerRate={config?.pensionEmployer} />
                <TableRow label="医疗保险" personal={result.personalMedical} employer={result.employerMedical} personalRate={config?.medicalEmployee} employerRate={config?.medicalEmployer} />
                <TableRow label="失业保险" personal={result.personalUnemployment} employer={result.employerUnemployment} personalRate={config?.unemploymentEmployee} employerRate={config?.unemploymentEmployer} />
                <TableRow label="工伤保险" personal={0} employer={result.employerInjury} personalRate={0} employerRate={config?.injuryEmployer} />
                <TableRow label="生育保险" personal={0} employer={result.employerMaternity} personalRate={0} employerRate={config?.maternityEmployer} />
                <TableRow label="住房公积金" personal={result.personalHousingFund} employer={result.employerHousingFund} personalRate={housingRate} employerRate={housingRate} isLast />
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-border font-semibold bg-muted/20">
                  <td className="py-2 px-3">合计</td>
                  <td className="text-right py-2 px-3">{formatYuan(result.personalTotal)}</td>
                  <td className="text-right py-2 px-3">{formatYuan(result.employerTotal)}</td>
                  <td className="text-right py-2 px-3 text-primary">{formatYuan(result.grandTotal)}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* 公积金属个人 + 单位，等于双份存款 */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-4">
              <p className="text-sm">
                💡 公积金每月存入个人账户：<strong>{formatYuan(result.personalHousingFund + result.employerHousingFund)}</strong>
                （可用于购房、租房提取）
              </p>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

function TableRow({
  label, personal, employer, personalRate, employerRate, isLast,
}: {
  label: string; personal: number; employer: number;
  personalRate?: number; employerRate?: number; isLast?: boolean;
}) {
  return (
    <tr className={`${isLast ? "" : "border-b border-border/30"}`}>
      <td className="py-2 px-3 font-medium">{label}</td>
      <td className="text-right py-2 px-3">¥{personal.toFixed(2)}</td>
      <td className="text-right py-2 px-3">¥{employer.toFixed(2)}</td>
      <td className="text-right py-2 px-3 text-muted-foreground text-xs">
        {personalRate ?? 0}% / {employerRate ?? 0}%
      </td>
    </tr>
  );
}

function StatCard({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="rounded-xl border border-border/50 bg-card p-4">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className={`font-bold text-lg ${highlight ? "text-primary" : "text-foreground"}`}>
        {value}
      </p>
    </div>
  );
}
