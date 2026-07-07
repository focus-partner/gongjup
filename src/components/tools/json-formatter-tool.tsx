"use client";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea"; import { Button } from "@/components/ui/button";
import { formatJSON, minifyJSON, validateJSON } from "@/engines/formatters";
import { Copy } from "lucide-react";

export function JSONFormatterTool() {
  const [input,setInput]=useState(""); const [output,setOutput]=useState(""); const [error,setError]=useState("");
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button size="sm" onClick={()=>{const r=formatJSON(input);setOutput(r.startsWith("JSON格式错误")?"":r);setError(r.startsWith("JSON格式错误")?r:"")}}>格式化</Button>
        <Button size="sm" variant="outline" onClick={()=>{const r=minifyJSON(input);setOutput(r.startsWith("JSON格式错误")?"":r);setError(r.startsWith("JSON格式错误")?r:"")}}>压缩</Button>
        <Button size="sm" variant="outline" onClick={()=>{const v=validateJSON(input);setError(v.valid?"✅ JSON格式正确":`❌ ${v.error}`);setOutput("")}}>验证</Button>
      </div>
      <Textarea value={input} onChange={e=>{setInput(e.target.value);setError("")}} className="font-mono text-sm" rows={6} placeholder='粘贴 JSON 数据...' />
      {error && <div className={`p-3 rounded-xl text-sm ${error.startsWith("✅")?"bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400":"bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400"}`}>{error}</div>}
      {output && <div className="relative"><pre className="p-4 rounded-xl border border-border/50 bg-muted/50 text-sm font-mono whitespace-pre-wrap overflow-auto max-h-96">{output}</pre><button onClick={()=>navigator.clipboard.writeText(output)} className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-muted"><Copy className="h-3.5 w-3.5"/></button></div>}
    </div>
  );
}
