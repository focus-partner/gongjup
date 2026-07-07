"use client";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { cropImage, loadImage, downloadCanvas } from "@/engines/image-edit";
import { FileUp, Download } from "lucide-react";

export function ImageCropTool() {
  const [src,setSrc]=useState<string|null>(null);
  const [img,setImg]=useState<HTMLImageElement|null>(null);
  const [crop,setCrop]=useState({x:0,y:0,w:200,h:200});
  const canvasRef=useRef<HTMLCanvasElement>(null);
  const previewRef=useRef<HTMLCanvasElement>(null);

  const handleFile=async (f:File)=>{const r=await loadImage(f);setImg(r.img);setSrc(r.img.src);setCrop({x:0,y:0,w:Math.min(200,r.width),h:Math.min(200,r.height)});};

  const updateCrop=(key:string,val:number)=>{const next={...crop,[key]:Math.max(1,Math.round(val))};setCrop(next);if(img&&previewRef.current){const c=cropImage(img,next.x,next.y,next.w,next.h);const ctx=previewRef.current.getContext("2d")!;previewRef.current.width=next.w;previewRef.current.height=next.h;ctx.drawImage(c,0,0);}};

  return (
    <div className="space-y-5">
      {!src ? (
        <div className="rounded-2xl border-2 border-dashed border-border/50 p-10 text-center cursor-pointer hover:border-primary/30 hover:bg-muted/50 transition-colors" onClick={()=>{const i=document.createElement("input");i.type="file";i.accept="image/*";i.onchange=e=>{const f=(e.target as HTMLInputElement).files?.[0];if(f)handleFile(f)};i.click()}}><FileUp className="h-10 w-10 mx-auto mb-3 text-muted-foreground"/><p className="text-sm font-medium">点击上传图片</p></div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-border/50 overflow-hidden"><canvas ref={canvasRef} className="hidden"/><img src={src} alt="原图" className="w-full h-auto"/></div>
            <div><p className="text-sm font-medium mb-2">裁剪预览</p><canvas ref={previewRef} width={crop.w} height={crop.h} className="rounded-xl border border-border/50 max-w-full"/></div>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[{l:"X",k:"x"},{l:"Y",k:"y"},{l:"宽",k:"w"},{l:"高",k:"h"}].map(({l,k})=><div key={k}><label className="text-[10px] text-muted-foreground">{l}</label><input type="number" value={crop[k as keyof typeof crop]} onChange={e=>updateCrop(k,Number(e.target.value))} className="w-full mt-0.5 px-2 py-1 rounded-lg border border-border/50 text-xs font-mono"/></div>)}
          </div>
          <Button size="sm" onClick={()=>{if(img){const c=cropImage(img,crop.x,crop.y,crop.w,crop.h);downloadCanvas(c,"cropped.png")}}}><Download className="h-3.5 w-3.5 mr-1"/>下载裁剪结果</Button>
        </>
      )}
    </div>
  );
}
