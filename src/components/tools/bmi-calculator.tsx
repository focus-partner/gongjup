"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { calculateBMI } from "@/engines/bmi";

/** BMI 计算器 */
export function BMICalculator() {
  const [height, setHeight] = useState(170);
  const [weight, setWeight] = useState(65);

  const result = calculateBMI(height, weight);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="bmi-height">身高（cm）</Label>
          <Input
            id="bmi-height"
            type="number"
            value={height}
            onChange={(e) => setHeight(Number(e.target.value) || 0)}
            className="mt-1.5"
            placeholder="例如 170"
          />
        </div>
        <div>
          <Label htmlFor="bmi-weight">体重（kg）</Label>
          <Input
            id="bmi-weight"
            type="number"
            value={weight}
            onChange={(e) => setWeight(Number(e.target.value) || 0)}
            className="mt-1.5"
            placeholder="例如 65"
          />
        </div>
      </div>

      {/* 结果展示 */}
      <div className="rounded-2xl border border-border/50 bg-card p-8 text-center">
        <p className="text-sm text-muted-foreground mb-2">您的 BMI 指数</p>
        <p className={`text-5xl font-bold ${result.categoryColor}`}>
          {result.bmi || "--"}
        </p>
        <p className={`mt-2 text-lg font-semibold ${result.categoryColor}`}>
          {result.categoryLabel}
        </p>

        {/* BMI 刻度尺 */}
        <div className="mt-6 h-3 rounded-full bg-gradient-to-r from-blue-400 via-green-400 via-amber-400 to-red-400 relative">
          <div
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-foreground shadow"
            style={{
              left: `${Math.min(100, Math.max(0, ((result.bmi - 14) / 24) * 100))}%`,
            }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-muted-foreground mt-1 px-1">
          <span>14 偏瘦</span>
          <span>18.5 正常</span>
          <span>24 偏胖</span>
          <span>28+ 肥胖</span>
        </div>
      </div>

      {/* 建议 */}
      <div className="rounded-xl border border-border/50 bg-card p-4">
        <p className="text-sm font-medium mb-2">健康建议</p>
        <p className="text-sm text-muted-foreground leading-relaxed">{result.advice}</p>
        <p className="text-xs text-muted-foreground mt-3">
          理想体重范围：{result.idealWeightMin} - {result.idealWeightMax} kg
        </p>
      </div>
    </div>
  );
}
