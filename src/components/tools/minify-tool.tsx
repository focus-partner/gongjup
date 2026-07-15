"use client";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea"; import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { minifyCSS, minifyJS, htmlToText } from "@/engines/file-converters";
import { Copy } from "lucide-react";

type Mode="css"|"js"|"html";

export function MinifyTool() {
  const [mode,setMode]=useState<Mode>("css"); const [input,setInput]=useState(""); const [output,setOutput]=useState("");
  const compress=()=>{
    if(mode==="css")setOutput(minifyCSS(input)); else if(mode==="js")setOutput(minifyJS(input)); else setOutput(htmlToText(input));
  };
  return (
    <div className="space-y-4">
      <Tabs value={mode} onValueChange={v=>{setMode(v as Mode);setOutput("")}}><TabsList><TabsTrigger value="css">CSS压缩</TabsTrigger><TabsTrigger value="js">JS压缩</TabsTrigger><TabsTrigger value="html">HTML→文本</TabsTrigger></TabsList></Tabs>
      <Textarea value={input} onChange={e=>setInput(e.target.value)} className="font-mono text-sm" rows={6} placeholder={mode==="html"?"粘贴HTML代码...":"粘贴代码..."}/>
      <div className="flex gap-2"><Button size="sm" onClick={compress}>{mode==="html"?"提取文本":"压缩"}</Button></div>
      {output&&<div className="relative"><pre className="p-4 rounded-xl border border-border/50 bg-muted/50 text-sm font-mono whitespace-pre-wrap break-all max-h-80 overflow-auto">{output}</pre><button onClick={()=>navigator.clipboard.writeText(output)} className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-muted"><Copy className="h-3.5 w-3.5"/></button></div>}
    </div>
  );
}
