"use client";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea"; import { Button } from "@/components/ui/button";
import { dedupLines } from "@/engines/formatters";
import { Copy } from "lucide-react";

export function TextDedupTool() {
  const [input,setInput]=useState(""); const [output,setOutput]=useState(""); const [stats,setStats]=useState<{original:number;unique:number}|null>(null);
  const dedup = () => { const r=dedupLines(input); setOutput(r.result); setStats({original:r.original,unique:r.unique}); };
  return (
    <div className="space-y-4">
      <Textarea value={input} onChange={e=>setInput(e.target.value)} rows={6} placeholder="每行一条数据，重复行将被去除..."/>
      <div className="flex gap-2 items-center">
        <Button size="sm" onClick={dedup}>去重</Button>
        {stats && <span className="text-xs text-muted-foreground">{stats.original} 行 → {stats.unique} 行（去除了 {stats.original-stats.unique} 行重复）</span>}
      </div>
      {output && <div className="relative"><pre className="p-4 rounded-xl border border-border/50 bg-muted/50 text-sm whitespace-pre-wrap max-h-80 overflow-auto">{output}</pre><button onClick={()=>navigator.clipboard.writeText(output)} className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-muted"><Copy className="h-3.5 w-3.5"/></button></div>}
    </div>
  );
}
