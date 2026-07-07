"use client";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea"; import { Label } from "@/components/ui/label"; import { Button } from "@/components/ui/button";
import { hashText, type HashAlgo } from "@/engines/hash-generator";
import { Copy } from "lucide-react";

const algos: HashAlgo[] = ["MD5","SHA-1","SHA-256","SHA-384","SHA-512"];

export function HashGeneratorTool() {
  const [input,setInput]=useState("");
  const [results,setResults]=useState<{algo:HashAlgo;hash:string}[]>([]);
  const genAll = async () => {
    const r=[]; for(const a of algos) r.push({algo:a,hash:await hashText(input,a)}); setResults(r);
  };
  return (
    <div className="space-y-4">
      <div><Label>输入文本</Label><Textarea value={input} onChange={e=>setInput(e.target.value)} className="mt-1.5 font-mono text-sm" rows={3} placeholder="输入要计算哈希的文本..."/></div>
      <Button onClick={genAll}>全部计算</Button>
      {results.length>0 && <div className="space-y-2">
        {results.map(({algo,hash})=>(
          <div key={algo} className="flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-muted/30">
            <span className="text-xs font-medium w-16 shrink-0">{algo}</span>
            <code className="text-xs font-mono break-all flex-1">{hash}</code>
            <button onClick={()=>navigator.clipboard.writeText(hash)} className="shrink-0 p-1 rounded hover:bg-muted"><Copy className="h-3 w-3"/></button>
          </div>
        ))}
      </div>}
    </div>
  );
}
