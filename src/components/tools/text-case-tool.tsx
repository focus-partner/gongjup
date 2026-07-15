"use client";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea"; import { Button } from "@/components/ui/button";
import { toUpperCase,toLowerCase,toTitleCase,toSentenceCase,reverseText } from "@/engines/quick-tools";
import { Copy } from "lucide-react";

const ops=[{l:"全大写",fn:toUpperCase},{l:"全小写",fn:toLowerCase},{l:"首字母大写",fn:toTitleCase},{l:"句首大写",fn:toSentenceCase},{l:"大小写反转",fn:(t:string)=>t.split("").map(c=>c===c.toUpperCase()?c.toLowerCase():c.toUpperCase()).join("")},{l:"文本反转",fn:reverseText}];

export function TextCaseTool() {
  const [input,setInput]=useState(""); const [output,setOutput]=useState("");
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-1.5">{ops.map(({l,fn})=><Button key={l} size="sm" variant="outline" onClick={()=>setOutput(fn(input))}>{l}</Button>)}</div>
      <Textarea value={input} onChange={e=>setInput(e.target.value)} rows={4} placeholder="输入英文文本..."/>
      {output&&<div className="relative"><pre className="p-4 rounded-xl border border-border/50 bg-muted/50 text-sm whitespace-pre-wrap font-sans">{output}</pre><button onClick={()=>navigator.clipboard.writeText(output)} className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-muted"><Copy className="h-3.5 w-3.5"/></button></div>}
    </div>
  );
}
