"use client";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea"; import { Label } from "@/components/ui/label"; import { Button } from "@/components/ui/button";
import { simplifyFull, traditionalizeFull } from "@/engines/chinese-convert";
import { Copy } from "lucide-react";

export function ChineseConverterTool() {
  const [input,setInput]=useState("");
  const [output,setOutput]=useState("");
  const [dir,setDir]=useState<"s2t"|"t2s">("s2t");
  const convert = () => { setOutput(dir==="s2t"?traditionalizeFull(input):simplifyFull(input)); };
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button variant={dir==="s2t"?"default":"outline"} size="sm" onClick={()=>setDir("s2t")}>简体 → 繁體</Button>
        <Button variant={dir==="t2s"?"default":"outline"} size="sm" onClick={()=>setDir("t2s")}>繁體 → 简体</Button>
      </div>
      <div><Label>输入文本</Label><Textarea value={input} onChange={e=>setInput(e.target.value)} className="mt-1.5" rows={5} placeholder="输入要转换的中文文本..."/></div>
      <Button onClick={convert}>转换</Button>
      {output && (
        <div className="relative">
          <Label>转换结果</Label>
          <div className="mt-1.5 p-4 rounded-xl border border-border/50 bg-muted/50 text-base leading-relaxed whitespace-pre-wrap">{output}</div>
          <button onClick={()=>navigator.clipboard.writeText(output)} className="absolute top-6 right-3 p-1.5 rounded-lg hover:bg-muted"><Copy className="h-3.5 w-3.5"/></button>
        </div>
      )}
    </div>
  );
}
