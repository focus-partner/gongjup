"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input"; import { Label } from "@/components/ui/label"; import { Button } from "@/components/ui/button";
import { calcDueDate } from "@/engines/number-cn";

export function DueDateTool() {
  const [date,setDate]=useState(""); const [result,setResult]=useState<ReturnType<typeof calcDueDate>|null>(null);
  return (
    <div className="space-y-6">
      <div className="flex items-end gap-3"><div className="flex-1"><Label>末次月经第一天</Label><Input type="date" value={date} onChange={e=>setDate(e.target.value)} className="mt-1.5"/></div><Button onClick={()=>{if(date)setResult(calcDueDate(new Date(date)))}}>计算</Button></div>
      {result && <div className="grid grid-cols-3 gap-3">
        {[{l:"预产期",v:result.date},{l:"当前孕周",v:result.weeks+"周"},{l:"孕期阶段",v:result.trimester}].map(({l,v})=><div key={l} className="rounded-xl border border-border/50 bg-card p-4 text-center"><p className="text-xs text-muted-foreground">{l}</p><p className="text-xl font-bold text-primary mt-1">{v}</p></div>)}
      </div>}
      <p className="text-xs text-muted-foreground">💡 预产期按末次月经第一天+280天估算，仅供参考。请遵医嘱。</p>
    </div>
  );
}
