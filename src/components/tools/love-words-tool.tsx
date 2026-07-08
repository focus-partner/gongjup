"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { generateLoveLine } from "@/engines/template-generators";
import { Heart, Copy, RefreshCw } from "lucide-react";

export function LoveWordsTool() {
  const [lines,setLines]=useState<string[]>([]);
  const gen=()=>{const b=[];for(let i=0;i<8;i++)b.push(generateLoveLine());setLines(b)};
  return (
    <div className="space-y-5">
      <Button onClick={gen} size="lg" className="w-full bg-pink-500 hover:bg-pink-600"><Heart className="h-4 w-4 mr-1.5"/>生成情话</Button>
      {lines.length>0 && <div className="space-y-2">
        {lines.map((l,i)=><div key={i} className="flex items-center justify-between p-4 rounded-xl border border-pink-100 bg-pink-50/50 dark:bg-pink-950/10 dark:border-pink-900 hover:border-pink-300 transition-colors"><p className="text-sm">{l}</p><button onClick={()=>navigator.clipboard.writeText(l)} className="shrink-0 ml-2 p-1.5 rounded-lg hover:bg-pink-100 dark:hover:bg-pink-900"><Copy className="h-3.5 w-3.5 text-pink-500"/></button></div>)}
        <Button variant="outline" size="sm" onClick={gen} className="w-full"><RefreshCw className="h-3.5 w-3.5 mr-1"/>换一批</Button>
      </div>}
    </div>
  );
}
