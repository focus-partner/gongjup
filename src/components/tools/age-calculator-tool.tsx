"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input"; import { Label } from "@/components/ui/label"; import { Button } from "@/components/ui/button";
import { calculateAge } from "@/engines/age-calc";

export function AgeCalculatorTool() {
  const [birth, setBirth] = useState("1990-01-01");
  const [result, setResult] = useState<ReturnType<typeof calculateAge> | null>(null);
  const handleCalc = () => { if (birth) setResult(calculateAge(new Date(birth))); };
  return (
    <div className="space-y-6">
      <div className="flex items-end gap-3">
        <div className="flex-1"><Label>出生日期</Label><Input type="date" value={birth} onChange={e=>setBirth(e.target.value)} className="mt-1.5" /></div>
        <Button onClick={handleCalc}>计算</Button>
      </div>
      {result && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[{l:"周岁",v:result.years},{l:"月龄",v:result.totalMonths},{l:"周龄",v:result.totalWeeks},{l:"天数",v:result.totalDays}].map(({l,v})=>(
            <div key={l} className="rounded-xl border border-border/50 bg-card p-4 text-center"><p className="text-3xl font-bold text-primary">{v.toLocaleString()}</p><p className="text-xs text-muted-foreground mt-1">{l}</p></div>
          ))}
          <div className="rounded-xl border border-border/50 bg-card p-4 text-center col-span-2"><p className="text-sm text-muted-foreground">生肖 · 下次生日还有</p><p className="text-xl font-bold">{result.zodiac} · {result.nextBirthday} 天</p></div>
        </div>
      )}
    </div>
  );
}
