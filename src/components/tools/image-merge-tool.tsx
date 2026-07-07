"use client";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { loadImage, downloadCanvas } from "@/engines/image-edit";
import { FileUp, Download, Plus } from "lucide-react";

export function ImageMergeTool() {
  const [imgs,setImgs]=useState<HTMLImageElement[]>([]);
  const canvasRef=useRef<HTMLCanvasElement>(null);

  const addFile=async (f:File)=>{const r=await loadImage(f);const next=[...imgs,r.img];setImgs(next);setTimeout(()=>renderMerge(next),50)};
  const renderMerge=(list:HTMLImageElement[])=>{
    const c=canvasRef.current;if(!c||!list.length)return;
    const gap=4; const totalW=list.reduce((s,i)=>s+i.naturalWidth,0)+gap*(list.length-1);
    const maxH=Math.max(...list.map(i=>i.naturalHeight));
    c.width=totalW;c.height=maxH;const ctx=c.getContext("2d")!;
    ctx.fillStyle="#ffffff";ctx.fillRect(0,0,c.width,c.height);
    let x=0; for(const img of list){ctx.drawImage(img,x,(maxH-img.naturalHeight)/2);x+=img.naturalWidth+gap}
  };
  const remove=(i:number)=>{const next=imgs.filter((_,idx)=>idx!==i);setImgs(next);setTimeout(()=>renderMerge(next),50)};
  return (
    <div className="space-y-5">
      <div className="flex gap-2 flex-wrap">{imgs.map((img,i)=><div key={i} className="relative group"><img src={img.src} className="h-20 rounded-lg border"/><button onClick={()=>remove(i)} className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-red-500 text-white text-xs opacity-0 group-hover:opacity-100">×</button></div>)}
        <button onClick={()=>{const i=document.createElement("input");i.type="file";i.accept="image/*";i.onchange=e=>{const f=(e.target as HTMLInputElement).files?.[0];if(f)addFile(f)};i.click()}} className="h-20 w-20 rounded-lg border-2 border-dashed border-border/50 flex items-center justify-center hover:border-primary/30 transition-colors"><Plus className="h-6 w-6 text-muted-foreground"/></button>
      </div>
      {imgs.length>0 && <><canvas ref={canvasRef} className="max-w-full rounded-xl border"/><Button size="sm" onClick={()=>{if(canvasRef.current)downloadCanvas(canvasRef.current,"merged.png")}}><Download className="h-3.5 w-3.5 mr-1"/>下载拼接图</Button></>}
    </div>
  );
}
