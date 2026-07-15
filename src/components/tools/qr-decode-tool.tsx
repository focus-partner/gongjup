"use client";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { FileUp, Copy } from "lucide-react";

let _jsQR: typeof import("jsqr").default | null = null;
async function getJsQR() { if(!_jsQR){const m=await import("jsqr");_jsQR=m.default} return _jsQR }

export function QRDecodeTool() {
  const [result,setResult]=useState(""); const [preview,setPreview]=useState(""); const [error,setError]=useState("");
  const fileRef=useRef<HTMLInputElement>(null);

  const handleFile=async(f:File)=>{
    setError(""); setResult(""); const url=URL.createObjectURL(f); setPreview(url);
    const img=new Image(); img.onload=async()=>{
      const canvas=document.createElement("canvas"); canvas.width=img.naturalWidth; canvas.height=img.naturalHeight;
      const ctx=canvas.getContext("2d")!; ctx.drawImage(img,0,0);
      const imageData=ctx.getImageData(0,0,canvas.width,canvas.height);
      try{const jsQR=await getJsQR();const code=jsQR(imageData.data,canvas.width,canvas.height);
        if(code)setResult(code.data); else setError("未识别到二维码")}catch{setError("识别失败")}
      URL.revokeObjectURL(url);
    };
    img.src=url;
  };

  return (
    <div className="space-y-5">
      {!preview?(
        <div className="rounded-2xl border-2 border-dashed border-border/50 p-10 text-center cursor-pointer hover:border-primary/30 transition-colors" onClick={()=>fileRef.current?.click()}>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e=>{const f=e.target.files?.[0];if(f)handleFile(f)}}/>
          <FileUp className="h-10 w-10 mx-auto mb-3 text-muted-foreground"/><p className="text-sm font-medium">上传含二维码的图片</p><p className="text-xs text-muted-foreground mt-1">自动识别并解码二维码内容</p>
        </div>
      ):(
        <><img src={preview} alt="预览" className="max-h-60 mx-auto rounded-xl border"/>
        {error&&<div className="p-3 rounded-xl bg-red-50 text-red-700 text-sm text-center">{error}</div>}
        {result&&<div className="relative"><pre className="p-4 rounded-xl border border-border/50 bg-muted/50 text-sm font-mono whitespace-pre-wrap break-all">{result}</pre><button onClick={()=>navigator.clipboard.writeText(result)} className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-muted"><Copy className="h-3.5 w-3.5"/></button></div>}</>
      )}
    </div>
  );
}
