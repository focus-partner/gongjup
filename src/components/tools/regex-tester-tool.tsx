"use client";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea"; import { Input } from "@/components/ui/input"; import { Label } from "@/components/ui/label"; import { Button } from "@/components/ui/button";
import { regexTest } from "@/engines/formatters";

const COMMON = [
  {name:"手机号",pat:"1[3-9]\\d{9}"},{name:"邮箱",pat:"[\\w.-]+@[\\w.-]+\\.\\w+"},
  {name:"身份证",pat:"\\d{17}[\\dXx]"},{name:"URL",pat:"https?://[\\w./-]+"},
  {name:"中文",pat:"[\\u4e00-\\u9fa5]+"},{name:"IP地址",pat:"\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}"},
];

export function RegexTesterTool() {
  const [pattern,setPattern]=useState(""); const [flags,setFlags]=useState("g"); const [text,setText]=useState("");
  const [result,setResult]=useState<ReturnType<typeof regexTest>|null>(null);
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2"><Label>正则表达式</Label><Input value={pattern} onChange={e=>setPattern(e.target.value)} className="mt-1.5 font-mono" placeholder="如 \\d{3}" /></div>
        <div><Label>标志</Label><Input value={flags} onChange={e=>setFlags(e.target.value)} className="mt-1.5 font-mono" placeholder="g, i, m" /></div>
      </div>
      <div className="flex gap-1.5 flex-wrap">{COMMON.map(c=><button key={c.name} onClick={()=>setPattern(c.pat)} className="px-2 py-1 rounded-lg text-[11px] bg-muted hover:bg-primary/10 transition-colors">{c.name}</button>)}</div>
      <Textarea value={text} onChange={e=>setText(e.target.value)} className="font-mono text-sm" rows={5} placeholder="输入测试文本..." />
      <Button size="sm" onClick={()=>setResult(regexTest(pattern,flags,text))}>测试</Button>
      {result && (
        result.error ? <div className="p-3 rounded-xl bg-red-50 text-red-700 text-sm">{result.error}</div> :
        <div className="space-y-2">
          <p className="text-sm">找到 <span className="font-bold text-primary">{result.count}</span> 个匹配</p>
          <div className="flex flex-wrap gap-1.5">{result.matches.map((m,i)=><code key={i} className="px-2 py-1 rounded-lg bg-primary/10 text-primary text-xs font-mono">{m}</code>)}</div>
        </div>
      )}
    </div>
  );
}
