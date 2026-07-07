"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input"; import { Label } from "@/components/ui/label"; import { Button } from "@/components/ui/button";
import { resizeImage, loadImage, downloadCanvas } from "@/engines/image-edit";
import { FileUp, Download } from "lucide-react";

export function ImageResizeTool() {
  const [img,setImg]=useState<HTMLImageElement|null>(null);
  const [maxW,setMaxW]=useState(800); const [maxH,setMaxH]=useState(600);
  const [result,setResult]=useState<{w:number;h:number;dataUrl:string}|null>(null);

  const handleFile=async (f:File)=>{const r=await loadImage(f);setImg(r.img);setMaxW(r.width);setMaxH(r.height)};
  const resize=()=>{if(!img)return;const c=resizeImage(img,maxW,maxH);setResult({w:c.width,h:c.height,dataUrl:c.toDataURL()})};

  return (
    <div className="space-y-5">
      {!img ? (
        <div className="rounded-2xl border-2 border-dashed border-border/50 p-10 text-center cursor-pointer hover:border-primary/30 transition-colors" onClick={()=>{const i=document.createElement("input");i.type="file";i.accept="image/*";i.onchange=e=>{const f=(e.target as HTMLInputElement).files?.[0];if(f)handleFile(f)};i.click()}}><FileUp className="h-10 w-10 mx-auto mb-3 text-muted-foreground"/><p className="text-sm font-medium">点击上传图片</p><p className="text-xs text-muted-foreground mt-1">处理在浏览器本地完成</p></div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>最大宽度(px)</Label><Input type="number" value={maxW} onChange={e=>setMaxW(Number(e.target.value))} className="mt-1.5"/></div>
            <div><Label>最大高度(px)</Label><Input type="number" value={maxH} onChange={e=>setMaxH(Number(e.target.value))} className="mt-1.5"/></div>
          </div>
          <Button size="sm" onClick={resize}>调整尺寸</Button>
          {result && <div className="text-center"><p className="text-sm text-muted-foreground mb-2">调整后：{result.w}×{result.h}px</p><img src={result.dataUrl} alt="预览" className="max-h-60 mx-auto rounded-xl border"/><Button size="sm" className="mt-3" onClick={()=>{const c=document.createElement("canvas");c.width=result.w;c.height=result.h;const ctx=c.getContext("2d");const i=new Image();i.onload=()=>{ctx!.drawImage(i,0,0);downloadCanvas(c,"resized.png")};i.src=result.dataUrl}}><Download className="h-3.5 w-3.5 mr-1"/>下载</Button></div>}
        </>
      )}
    </div>
  );
}
