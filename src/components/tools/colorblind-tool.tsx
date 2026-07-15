"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input"; import { Label } from "@/components/ui/label";

function simulateColorblind(hex: string, type: "protanopia"|"deuteranopia"|"tritanopia"): string {
  const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);
  // 简化模拟矩阵
  const matrices = {
    protanopia: [0.567,0.433,0, 0.558,0.442,0, 0,0.242,0.758],
    deuteranopia: [0.625,0.375,0, 0.7,0.3,0, 0,0.3,0.7],
    tritanopia: [0.95,0.05,0, 0,0.433,0.567, 0,0.475,0.525],
  };
  const m=matrices[type];
  const nr=Math.min(255,Math.round(r*m[0]+g*m[1]+b*m[2]));
  const ng=Math.min(255,Math.round(r*m[3]+g*m[4]+b*m[5]));
  const nb=Math.min(255,Math.round(r*m[6]+g*m[7]+b*m[8]));
  return `#${nr.toString(16).padStart(2,"0")}${ng.toString(16).padStart(2,"0")}${nb.toString(16).padStart(2,"0")}`;
}

const types:[string,string,"protanopia"|"deuteranopia"|"tritanopia"][] = [
  ["红色盲","Protanopia","protanopia"],["绿色盲","Deuteranopia","deuteranopia"],["蓝色盲","Tritanopia","tritanopia"],
];

export function ColorblindTool() {
  const [hex,setHex]=useState("#3B82F6");
  const simulated=types.map(([name,en,type])=>({name,en,color:simulateColorblind(hex,type)}));
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3"><Label>选择颜色</Label><input type="color" value={hex} onChange={e=>setHex(e.target.value)} className="h-9 w-9 rounded-lg border cursor-pointer"/><code className="text-sm font-mono">{hex}</code></div>
      <div className="space-y-3">
        <div className="flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-card"><span className="text-xs font-medium w-24">原始颜色</span><div className="h-8 w-8 rounded-lg border" style={{background:hex}}/><code className="text-xs">{hex}</code></div>
        {simulated.map(({name,en,color})=><div key={name} className="flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-card"><span className="text-xs font-medium w-24">{name}<br/><span className="text-[10px] text-muted-foreground">{en}</span></span><div className="h-8 w-8 rounded-lg border" style={{background:color}}/><code className="text-xs">{color}</code></div>)}
      </div>
      <p className="text-xs text-muted-foreground">👁️ 模拟红绿色盲等视觉障碍看到的颜色效果，帮助设计无障碍配色</p>
    </div>
  );
}
