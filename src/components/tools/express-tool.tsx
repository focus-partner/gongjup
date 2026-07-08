"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input"; import { Label } from "@/components/ui/label"; import { Button } from "@/components/ui/button";
import { generateExpress } from "@/engines/template-generators";
import { Copy, RefreshCw } from "lucide-react";

export function ExpressTool() {
  const [order,setOrder]=useState(()=>"EX"+Date.now().toString(36).toUpperCase());
  const [result,setResult]=useState("");
  const gen=()=>setResult(generateExpress(order));
  return (
    <div className="space-y-5">
      <div className="flex items-end gap-3"><div className="flex-1"><Label>订单号（可自定义）</Label><Input value={order} onChange={e=>setOrder(e.target.value)} className="mt-1.5 font-mono"/></div><Button onClick={gen} size="sm">生成</Button></div>
      {result && <div className="relative"><pre className="p-5 rounded-xl border border-border/50 bg-muted/30 text-sm leading-relaxed whitespace-pre-wrap font-sans">{result}</pre><button onClick={()=>{gen();}} className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-muted"><RefreshCw className="h-3.5 w-3.5"/></button></div>}
      <p className="text-xs text-muted-foreground">📦 仅供娱乐整蛊，请勿用于非法用途</p>
    </div>
  );
}
