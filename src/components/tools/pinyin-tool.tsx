"use client";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea"; import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toPinyin } from "@/engines/pinyin";
import { Copy } from "lucide-react";

export function PinyinTool() {
  const [input,setInput]=useState(""); const [output,setOutput]=useState(""); const [hasTone,setHasTone]=useState(false);
  const convert = () => setOutput(toPinyin(input, hasTone?"num":"none"));
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-1.5 text-sm"><input type="checkbox" checked={hasTone} onChange={e=>setHasTone(e.target.checked)} className="rounded"/> 带声调</label>
      </div>
      <Textarea value={input} onChange={e=>setInput(e.target.value)} rows={4} placeholder="输入中文文本，如：你好世界"/>
      <Button size="sm" onClick={convert}>转拼音</Button>
      {output && <div className="relative"><div className="p-4 rounded-xl border border-border/50 bg-muted/50 text-base leading-relaxed">{output}</div><button onClick={()=>navigator.clipboard.writeText(output)} className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-muted"><Copy className="h-3.5 w-3.5"/></button></div>}
    </div>
  );
}
