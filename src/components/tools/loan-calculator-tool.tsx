"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input"; import { Label } from "@/components/ui/label";
import { calcLoan } from "@/engines/number-cn";

export function LoanCalculatorTool() {
  const [principal,setP]=useState(100000); const [rate,setR]=useState(4.9); const [months,setM]=useState(12);
  const r=calcLoan(principal,rate,months);
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div><Label>贷款金额(元)</Label><Input type="number" value={principal} onChange={e=>setP(Number(e.target.value))} className="mt-1.5"/></div>
        <div><Label>年利率(%)</Label><Input type="number" value={rate} onChange={e=>setR(Number(e.target.value))} className="mt-1.5"/></div>
        <div><Label>期限(月)</Label><Input type="number" value={months} onChange={e=>setM(Number(e.target.value))} className="mt-1.5"/></div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[{l:"月供",v:"¥"+r.monthly.toLocaleString()},{l:"还款总额",v:"¥"+r.total.toLocaleString()},{l:"总利息",v:"¥"+r.totalInterest.toLocaleString()}].map(({l,v})=><div key={l} className="rounded-xl border border-border/50 bg-card p-4 text-center"><p className="text-xs text-muted-foreground">{l}</p><p className="text-lg font-bold text-primary mt-1">{v}</p></div>)}
      </div>
    </div>
  );
}
