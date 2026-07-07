"use client";
import { useState, useRef } from "react";
import { Input } from "@/components/ui/input"; import { Label } from "@/components/ui/label"; import { Button } from "@/components/ui/button";
import { loadImage, downloadCanvas } from "@/engines/image-edit";
import { FileUp, Download } from "lucide-react";

export function ImageTextTool() {
  const [img,setImg]=useState<HTMLImageElement|null>(null);
  const [text,setText]=useState(""); const [color,setColor]=useState("#ffffff"); const [size,setSize]=useState(48);
  const canvasRef=useRef<HTMLCanvasElement>(null);

  const handleFile=async (f:File)=>{const r=await loadImage(f);setImg(r.img);setTimeout(()=>drawPreview(r.img),100)};
  const drawPreview=(imgEl:HTMLImageElement)=>{const c=canvasRef.current;if(!c)return;c.width=imgEl.naturalWidth;c.height=imgEl.naturalHeight;const ctx=c.getContext("2d")!;ctx.drawImage(imgEl,0,0);if(text){ctx.fillStyle=color;ctx.font=`bold ${size}px sans-serif`;ctx.textAlign="center";ctx.fillText(text,c.width/2,c.height-size/4)}}
  const download=()=>{if(canvasRef.current)downloadCanvas(canvasRef.current,"text-image.png")};

  return (
    <div className="space-y-5">
      {!img ? (
        <div className="rounded-2xl border-2 border-dashed border-border/50 p-10 text-center cursor-pointer hover:border-primary/30 transition-colors" onClick={()=>{const i=document.createElement("input");i.type="file";i.accept="image/*";i.onchange=e=>{const f=(e.target as HTMLInputElement).files?.[0];if(f)handleFile(f)};i.click()}}><FileUp className="h-10 w-10 mx-auto mb-3 text-muted-foreground"/><p className="text-sm font-medium">点击上传图片</p><p className="text-xs text-muted-foreground mt-1">给图片添加文字，制作表情包</p></div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div><Label>文字</Label><Input value={text} onChange={e=>{setText(e.target.value);if(img)drawPreview(img)}} className="mt-1.5" placeholder="输入文字..."/></div>
            <div><Label>字号</Label><Input type="number" value={size} onChange={e=>{setSize(Number(e.target.value));if(img)drawPreview(img)}} className="mt-1.5"/></div>
            <div><Label>颜色</Label><input type="color" value={color} onChange={e=>{setColor(e.target.value);if(img)drawPreview(img)}} className="mt-2 h-9 w-9 rounded-lg border cursor-pointer"/></div>
          </div>
          <canvas ref={canvasRef} className="max-w-full rounded-xl border"/>
          <Button size="sm" onClick={download}><Download className="h-3.5 w-3.5 mr-1"/>下载</Button>
        </>
      )}
    </div>
  );
}
