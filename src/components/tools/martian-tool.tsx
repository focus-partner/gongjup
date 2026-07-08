"use client";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea"; import { Button } from "@/components/ui/button";
import { toMartian, fromMartian } from "@/engines/fun-generators";
import { Copy, ArrowRightLeft } from "lucide-react";

export function MartianTool() {
  const [input,setInput]=useState("你好我是火星人");
  const [output,setOutput]=useState("");
  const [dir,setDir]=useState<"to"|"from">("to");
  const convert=()=>setOutput(dir==="to"?toMartian(input):fromMartian(input));
  return (
    <div className="space-y-4">
      <div className="flex gap-2"><Button variant={dir==="to"?"default":"outline"} size="sm" onClick={()=>{setDir("to");setOutput("")}}>中文 → 火星文</Button><Button variant={dir==="from"?"default":"outline"} size="sm" onClick={()=>{setDir("from");setOutput("")}}>火星文 → 中文</Button></div>
      <Textarea value={input} onChange={e=>setInput(e.target.value)} rows={3} placeholder={dir==="to"?"输入中文...":"输入火星文..."}/>
      <Button size="sm" onClick={convert}><ArrowRightLeft className="h-3.5 w-3.5 mr-1"/>转换</Button>
      {output && <div className="relative"><div className="p-4 rounded-xl border border-border/50 bg-muted/50 text-lg">{output}</div><button onClick={()=>navigator.clipboard.writeText(output)} className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-muted"><Copy className="h-3.5 w-3.5"/></button></div>}
      <p className="text-xs text-muted-foreground">👽 莪湜焱暒亾，來冎悡滵！</p>
    </div>
  );
}
