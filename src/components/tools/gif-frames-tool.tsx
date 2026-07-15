"use client";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { FileUp, Download } from "lucide-react";

export function GIFFramesTool() {
  const [frames,setFrames]=useState<{dataUrl:string;index:number}[]>([]);
  const [fileName,setFileName]=useState("");
  const canvasRef=useRef<HTMLCanvasElement>(null);

  const handleFile=async(f:File)=>{
    setFileName(f.name); const arrBuf=await f.arrayBuffer(); const bytes=new Uint8Array(arrBuf);
    const blob=new Blob([bytes]); const img=new Image(); const url=URL.createObjectURL(blob);
    img.onload=()=>{
      const frameCount=1; // 简化版：提取第一帧，完整gif解码需要专业库
      const canvas=canvasRef.current!; canvas.width=img.naturalWidth; canvas.height=img.naturalHeight;
      canvas.getContext("2d")!.drawImage(img,0,0);
      setFrames([{dataUrl:canvas.toDataURL(),index:0}]);
      URL.revokeObjectURL(url);
    };
    img.src=url;
  };

  return (
    <div className="space-y-5">
      {frames.length===0?(
        <div className="rounded-2xl border-2 border-dashed border-border/50 p-10 text-center cursor-pointer hover:border-primary/30 transition-colors" onClick={()=>{const i=document.createElement("input");i.type="file";i.accept="image/gif";i.onchange=e=>{const f=(e.target as HTMLInputElement).files?.[0];if(f)handleFile(f)};i.click()}}><FileUp className="h-10 w-10 mx-auto mb-3 text-muted-foreground"/><p className="text-sm font-medium">上传GIF动图</p><p className="text-xs text-muted-foreground mt-1">提取GIF首帧为PNG图片</p></div>
      ):(
        <>
          <canvas ref={canvasRef} className="hidden"/>
          {frames.map((fr,i)=><div key={i}><img src={fr.dataUrl} alt={`帧${i+1}`} className="max-w-full rounded-xl border"/><Button size="sm" className="mt-2" onClick={()=>{const a=document.createElement("a");a.download=`frame-${i+1}.png`;a.href=fr.dataUrl;a.click()}}><Download className="h-3.5 w-3.5 mr-1"/>下载 PNG</Button></div>)}
        </>
      )}
      <p className="text-xs text-muted-foreground">💡 支持提取GIF首帧为PNG。完整帧分解功能需要专业GIF解析库，后续版本将支持。</p>
    </div>
  );
}
