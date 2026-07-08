"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input"; import { Label } from "@/components/ui/label"; import { Textarea } from "@/components/ui/textarea"; import { Button } from "@/components/ui/button";
import { generateEdict } from "@/engines/fun-generators";
import { Copy, Download } from "lucide-react";

const presets: {title:string;recipient:string;content:string;emperor:string}[] = [
  {title:"催饭诏书",recipient:"饭友",content:"朕已饥饿难耐，着尔速速起身觅食，不得有误！火锅烧烤皆可，AA制亦可。若再拖延，罚洗碗一周！",emperor:"干饭皇帝"},
  {title:"早睡诏书",recipient:"熬夜的自己",content:"朕深知熬夜伤身，特颁此诏命尔即日起每日23时前就寝。违者次日罚站一小时，并请全组喝奶茶！",emperor:"养生大帝"},
  {title:"摸鱼诏书",recipient:"全体同事",content:"今日宜摸鱼、宜发呆、宜刷朋友圈。发现有人认真工作，立即举报至朕处，重赏！",emperor:"带薪摸鱼王"},
];

export function EdictTool() {
  const [opts,setOpts]=useState({title:"",recipient:"",content:"",emperor:""});
  const [result,setResult]=useState("");
  const gen=()=>{setResult(generateEdict({title:opts.title||"圣旨",recipient:opts.recipient||"爱卿",content:opts.content||"钦此",emperor:opts.emperor||"朕"}))};
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">{presets.map(p=><button key={p.title} onClick={()=>{setOpts(p);setTimeout(()=>setResult(generateEdict(p)),50)}} className="px-3 py-1.5 rounded-lg text-xs bg-muted hover:bg-primary/10 transition-colors">{p.title}</button>)}</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div><Label>诏书标题</Label><Input value={opts.title} onChange={e=>setOpts({...opts,title:e.target.value})} className="mt-1.5" placeholder="如：吃饭诏书"/></div>
        <div><Label>颁发给谁</Label><Input value={opts.recipient} onChange={e=>setOpts({...opts,recipient:e.target.value})} className="mt-1.5" placeholder="如：爱卿张三"/></div>
        <div className="sm:col-span-2"><Label>诏书内容</Label><Textarea value={opts.content} onChange={e=>setOpts({...opts,content:e.target.value})} className="mt-1.5" rows={3} placeholder="爱卿接旨..."/></div>
        <div><Label>朕的名字</Label><Input value={opts.emperor} onChange={e=>setOpts({...opts,emperor:e.target.value})} className="mt-1.5" placeholder="如：吃货皇帝"/></div>
      </div>
      <Button size="sm" onClick={gen}>📜 生成诏书</Button>
      {result && <div className="relative"><pre className="p-6 rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800 text-sm leading-relaxed whitespace-pre-wrap font-serif">{result}</pre><button onClick={()=>navigator.clipboard.writeText(result)} className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-muted"><Copy className="h-3.5 w-3.5"/></button></div>}
    </div>
  );
}
