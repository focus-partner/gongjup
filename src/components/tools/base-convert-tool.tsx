"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input"; import { Label } from "@/components/ui/label";
import { convertBase } from "@/engines/quick-tools";
import { Copy } from "lucide-react";

const bases=[{n:2,l:"二进制(BIN)"},{n:8,l:"八进制(OCT)"},{n:10,l:"十进制(DEC)"},{n:16,l:"十六进制(HEX)"}];

export function BaseConvertTool() {
  const [value,setValue]=useState("255"); const [from,setFrom]=useState(10);
  const results=bases.filter(b=>b.n!==from).map(b=>({label:b.l,value:convertBase(value,from,b.n)}));
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div><Label>输入数值</Label><Input value={value} onChange={e=>setValue(e.target.value)} className="mt-1.5 font-mono"/></div>
        <div><Label>当前进制</Label><div className="grid grid-cols-4 gap-1 mt-1.5">{bases.map(b=><button key={b.n} onClick={()=>setFrom(b.n)} className={`py-1.5 rounded-lg text-xs font-medium transition-colors ${from===b.n?"bg-primary text-primary-foreground":"bg-muted hover:bg-muted/70"}`}>{b.l}</button>)}</div></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">{results.map(r=><div key={r.label} className="flex items-center justify-between p-3 rounded-xl border border-border/50 bg-card"><span className="text-[10px] text-muted-foreground">{r.label}</span><code className="text-sm font-mono font-bold">{r.value}</code><button onClick={()=>navigator.clipboard.writeText(r.value)} className="p-1 rounded hover:bg-muted"><Copy className="h-3 w-3"/></button></div>)}</div>
    </div>
  );
}
