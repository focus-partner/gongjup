"use client";
import { useState } from "react";
import { Label } from "@/components/ui/label"; import { Copy } from "lucide-react";

function generatePalette(baseHex: string, count:number=8): string[] {
  const hex=baseHex.replace("#","");const r=parseInt(hex.slice(0,2),16),g=parseInt(hex.slice(2,4),16),b=parseInt(hex.slice(4,6),16);
  const colors:string[]=[];
  for(let i=0;i<count;i++){const t=i/(count-1);const l=0.1+t*0.8;const nr=Math.round(r*l),ng=Math.round(g*l),nb=Math.round(b*l);colors.push(`#${nr.toString(16).padStart(2,"0")}${ng.toString(16).padStart(2,"0")}${nb.toString(16).padStart(2,"0")}`)}
  return colors;
}

export function ColorPaletteTool() {
  const [base,setBase]=useState("#3B82F6"); const palette=generatePalette(base,10);
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3"><Label>基色</Label><input type="color" value={base} onChange={e=>setBase(e.target.value)} className="h-9 w-9 rounded-lg border cursor-pointer"/><span className="text-sm font-mono">{base}</span></div>
      <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
        {palette.map((c,i)=><button key={i} onClick={()=>navigator.clipboard.writeText(c)} className="group relative aspect-square rounded-xl border border-border/50 transition-transform hover:scale-110 cursor-pointer" style={{background:c}} title={c}><span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Copy className="h-3.5 w-3.5 text-white drop-shadow"/></span></button>)}
      </div>
      <div className="grid grid-cols-5 sm:grid-cols-10 gap-1">{palette.map((c,i)=><code key={i} className="text-[10px] text-center text-muted-foreground font-mono">{c}</code>)}</div>
      <p className="text-xs text-muted-foreground">💡 点击色块复制颜色代码</p>
    </div>
  );
}
