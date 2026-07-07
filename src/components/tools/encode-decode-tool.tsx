"use client";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea"; import { Label } from "@/components/ui/label"; import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { urlEncode,urlDecode,base64Encode,base64Decode,htmlEncode,htmlDecode } from "@/engines/encode-decode";
import { Copy } from "lucide-react";

type Mode = "url"|"base64"|"html";
const modes: {id:Mode;label:string}[]=[{id:"url",label:"URL编解码"},{id:"base64",label:"Base64(文本)"},{id:"html",label:"HTML实体"}];

export function EncodeDecodeTool() {
  const [mode,setMode]=useState<Mode>("url");
  const [input,setInput]=useState("");
  const [output,setOutput]=useState("");
  const [dir,setDir]=useState<"encode"|"decode">("encode");
  const process = () => {
    if(!input.trim()){setOutput("");return}
    try{
      if(mode==="url") setOutput(dir==="encode"?urlEncode(input):urlDecode(input));
      else if(mode==="base64") setOutput(dir==="encode"?base64Encode(input):base64Decode(input));
      else setOutput(dir==="encode"?htmlEncode(input):htmlDecode(input));
    }catch(e){setOutput("处理失败："+(e as Error).message)}
  };
  return (
    <div className="space-y-4">
      <Tabs value={mode} onValueChange={v=>{setMode(v as Mode);setOutput("");setDir("encode")}}><TabsList>{modes.map(m=><TabsTrigger key={m.id} value={m.id}>{m.label}</TabsTrigger>)}</TabsList></Tabs>
      <div className="flex gap-2"><Button variant={dir==="encode"?"default":"outline"} size="sm" onClick={()=>setDir("encode")}>编码</Button><Button variant={dir==="decode"?"default":"outline"} size="sm" onClick={()=>setDir("decode")}>解码</Button></div>
      <div><Label>输入</Label><Textarea value={input} onChange={e=>setInput(e.target.value)} className="mt-1.5 font-mono text-sm" rows={4} placeholder="输入要编码/解码的内容..."/></div>
      <Button onClick={process}>转换</Button>
      {output && <div className="relative"><Label>结果</Label><pre className="mt-1.5 p-4 rounded-xl border border-border/50 bg-muted/50 text-sm font-mono whitespace-pre-wrap break-all">{output}</pre><button onClick={()=>navigator.clipboard.writeText(output)} className="absolute top-6 right-3 p-1.5 rounded-lg hover:bg-muted"><Copy className="h-3.5 w-3.5"/></button></div>}
    </div>
  );
}
