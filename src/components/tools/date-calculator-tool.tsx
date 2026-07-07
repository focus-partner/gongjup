"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input"; import { Label } from "@/components/ui/label"; import { Button } from "@/components/ui/button";
import { addDays, diffDays, diffWorkdays, formatDateCN } from "@/engines/date-calc";

export function DateCalculatorTool() {
  const [d1,setD1]=useState(new Date().toISOString().slice(0,10));
  const [d2,setD2]=useState("");
  const [days,setDays]=useState(0);
  const [result,setResult]=useState<{type:string;text:string} | null>(null);
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
        <div><Label>起始日期</Label><Input type="date" value={d1} onChange={e=>setD1(e.target.value)} className="mt-1.5"/></div>
        <div><Label>结束日期（可选）</Label><Input type="date" value={d2} onChange={e=>setD2(e.target.value)} className="mt-1.5"/></div>
        <div><Label>加减天数</Label><Input type="number" value={days} onChange={e=>setDays(Number(e.target.value))} className="mt-1.5" placeholder="如 30"/></div>
      </div>
      <div className="flex gap-2 flex-wrap">
        <Button variant="outline" size="sm" onClick={()=>{if(!d1)return;setResult({type:"加",text:`${d1} + ${days}天 = ${addDays(new Date(d1),days).toISOString().slice(0,10)}`})}}>日期加天数</Button>
        <Button variant="outline" size="sm" onClick={()=>{if(!d1)return;setResult({type:"减",text:`${d1} - ${days}天 = ${addDays(new Date(d1),-days).toISOString().slice(0,10)}`})}}>日期减天数</Button>
        <Button variant="outline" size="sm" onClick={()=>{if(!d1||!d2)return;const diff=diffDays(new Date(d1),new Date(d2));const work=diffWorkdays(new Date(d1),new Date(d2));setResult({type:"差",text:`相差 ${diff} 天（含 ${work} 个工作日）`})}}>计算日期差</Button>
      </div>
      {result && <div className="rounded-xl border border-border/50 bg-card p-4"><p className="text-sm font-medium">{result.type}：</p><p className="text-xl font-bold text-primary mt-1">{result.text}</p></div>}
    </div>
  );
}
