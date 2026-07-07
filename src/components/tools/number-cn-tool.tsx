"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input"; import { Label } from "@/components/ui/label";
import { numberToChinese, numberToChineseUpper } from "@/engines/number-cn";
import { Copy } from "lucide-react";

export function NumberCNTool() {
  const [num,setNum]=useState(12345);
  return (
    <div className="space-y-6">
      <div><Label>输入数字</Label><Input type="number" value={num} onChange={e=>setNum(Number(e.target.value))} className="mt-1.5 text-xl font-mono"/></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[{l:"小写中文",v:numberToChinese(num)},{l:"大写（财务）",v:numberToChineseUpper(num)}].map(({l,v})=>(
          <div key={l} className="rounded-xl border border-border/50 bg-card p-4"><p className="text-xs text-muted-foreground mb-1">{l}</p><p className="text-xl font-bold">{v}</p><button onClick={()=>navigator.clipboard.writeText(v)} className="mt-2 p-1 rounded hover:bg-muted"><Copy className="h-3 w-3"/></button></div>
        ))}
      </div>
    </div>
  );
}
