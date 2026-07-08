"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input"; import { Label } from "@/components/ui/label"; import { Button } from "@/components/ui/button";
import { generateResignation } from "@/engines/template-generators";
import { Copy, RefreshCw } from "lucide-react";

export function ResignationTool() {
  const [name,setName]=useState(""); const [company,setCompany]=useState(""); const [years,setYears]=useState(3);
  const [result,setResult]=useState("");
  const gen=()=>{if(name&&company)setResult(generateResignation(name,company,years))};
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div><Label>你的名字</Label><Input value={name} onChange={e=>setName(e.target.value)} className="mt-1.5" placeholder="张三"/></div>
        <div><Label>公司名称</Label><Input value={company} onChange={e=>setCompany(e.target.value)} className="mt-1.5" placeholder="XX科技有限公司"/></div>
        <div><Label>工作年限</Label><Input type="number" value={years} onChange={e=>setYears(Number(e.target.value))} className="mt-1.5"/></div>
      </div>
      <Button onClick={gen} size="sm">📝 生成辞职信</Button>
      {result && <div className="relative"><pre className="p-6 rounded-xl border border-border/50 bg-muted/30 text-sm leading-relaxed whitespace-pre-wrap font-sans">{result}</pre>
        <div className="absolute top-3 right-3 flex gap-1"><button onClick={gen} className="p-1.5 rounded-lg hover:bg-muted" title="重新生成"><RefreshCw className="h-3.5 w-3.5"/></button><button onClick={()=>navigator.clipboard.writeText(result)} className="p-1.5 rounded-lg hover:bg-muted" title="复制"><Copy className="h-3.5 w-3.5"/></button></div>
      </div>}
      <p className="text-xs text-muted-foreground">💡 辞职信内容随机组合生成，仅供娱乐参考。真的要辞职请慎重考虑哦！</p>
    </div>
  );
}
