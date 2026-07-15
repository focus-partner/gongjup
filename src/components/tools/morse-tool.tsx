"use client";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea"; import { Button } from "@/components/ui/button";
import { textToMorse,morseToText } from "@/engines/quick-tools";
import { Copy, ArrowRightLeft } from "lucide-react";

export function MorseTool() {
  const [input,setInput]=useState("SOS");
  const [output,setOutput]=useState("");
  const [dir,setDir]=useState<"to"|"from">("to");
  const conv=()=>setOutput(dir==="to"?textToMorse(input):morseToText(input));
  return (
    <div className="space-y-4">
      <div className="flex gap-2"><Button variant={dir==="to"?"default":"outline"} size="sm" onClick={()=>{setDir("to");setOutput("")}}>文字 → 摩斯电码</Button><Button variant={dir==="from"?"default":"outline"} size="sm" onClick={()=>{setDir("from");setOutput("")}}>摩斯电码 → 文字</Button></div>
      <Textarea value={input} onChange={e=>setInput(e.target.value)} rows={3} className="font-mono" placeholder={dir==="to"?"输入文字...":"输入摩斯电码（用空格分隔）..."}/>
      <Button size="sm" onClick={conv}><ArrowRightLeft className="h-3.5 w-3.5 mr-1"/>转换</Button>
      {output&&<div className="relative"><pre className="p-4 rounded-xl border border-border/50 bg-muted/50 text-sm font-mono whitespace-pre-wrap">{output}</pre><button onClick={()=>navigator.clipboard.writeText(output)} className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-muted"><Copy className="h-3.5 w-3.5"/></button></div>}
      <p className="text-xs text-muted-foreground">📻 ··· −−− ···  (SOS)</p>
    </div>
  );
}
