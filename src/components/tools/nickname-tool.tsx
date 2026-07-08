"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { generateNickname } from "@/engines/template-generators";
import { Shuffle, Copy, Heart } from "lucide-react";

const styles=[{id:"cute"as const,label:"😊 可爱风"},{id:"cool"as const,label:"😎 高冷风"},{id:"funny"as const,label:"🤪 沙雕风"},{id:"random"as const,label:"🎲 随机"}];

export function NicknameTool() {
  const [style,setStyle]=useState<"cute"|"cool"|"funny"|"random">("random");
  const [names,setNames]=useState<string[]>([]);
  const gen=()=>{
    const batch=[]; for(let i=0;i<12;i++) batch.push(generateNickname(style)); setNames(batch);
  };
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">{styles.map(s=><Button key={s.id} variant={style===s.id?"default":"outline"} size="sm" onClick={()=>setStyle(s.id)}>{s.label}</Button>)}</div>
      <Button onClick={gen}><Shuffle className="h-4 w-4 mr-1"/>生成网名</Button>
      {names.length>0 && <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">{names.map((n,i)=><button key={i} onClick={()=>navigator.clipboard.writeText(n)} className="p-3 rounded-xl border border-border/50 bg-card hover:bg-primary/5 hover:border-primary/30 transition-all text-sm text-center cursor-pointer">{n}</button>)}</div>}
      <p className="text-xs text-muted-foreground">💡 点击网名直接复制，不满意重新生成</p>
    </div>
  );
}
