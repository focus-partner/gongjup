"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { rotateImage, loadImage, downloadCanvas } from "@/engines/image-edit";
import { FileUp, Download, RotateCw } from "lucide-react";

export function ImageRotateTool() {
  const [img,setImg]=useState<HTMLImageElement|null>(null);
  const [dataUrl,setDataUrl]=useState<string|null>(null);
  const [rotation,setRotation]=useState(0);

  const handleFile=async (f:File)=>{const r=await loadImage(f);setImg(r.img);setDataUrl(r.img.src);setRotation(0)};
  const rotate=(deg:90|180|270)=>{if(!img)return;const c=rotateImage(img,deg);setDataUrl(c.toDataURL());setRotation((rotation+deg)%360)};
  const download=()=>{if(dataUrl){const c=document.createElement("canvas");const i=new Image();i.onload=()=>{c.width=i.naturalWidth;c.height=i.naturalHeight;c.getContext("2d")!.drawImage(i,0,0);downloadCanvas(c,"rotated.png")};i.src=dataUrl}};

  return (
    <div className="space-y-5">
      {!img ? (
        <div className="rounded-2xl border-2 border-dashed border-border/50 p-10 text-center cursor-pointer hover:border-primary/30 transition-colors" onClick={()=>{const inp=document.createElement("input");inp.type="file";inp.accept="image/*";inp.onchange=e=>{const f=(e.target as HTMLInputElement).files?.[0];if(f)handleFile(f)};inp.click()}}><FileUp className="h-10 w-10 mx-auto mb-3 text-muted-foreground"/><p className="text-sm font-medium">点击上传图片</p></div>
      ) : (
        <>
          <div className="flex gap-2">{([90,180,270] as const).map(d=><Button key={d} variant="outline" size="sm" onClick={()=>rotate(d)}><RotateCw className="h-3.5 w-3.5 mr-1"/>旋转 {d}°</Button>)}<span className="text-xs text-muted-foreground self-center ml-2">当前: {rotation}°</span></div>
          <img src={dataUrl||""} alt="预览" className="max-h-80 mx-auto rounded-xl border"/>
          <Button size="sm" onClick={download}><Download className="h-3.5 w-3.5 mr-1"/>下载</Button>
        </>
      )}
    </div>
  );
}
