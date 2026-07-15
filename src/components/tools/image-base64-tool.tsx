"use client";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { FileUp, Copy } from "lucide-react";

export function ImageBase64Tool() {
  const [dataUrl,setDataUrl]=useState(""); const [size,setSize]=useState("");
  const fileRef=useRef<HTMLInputElement>(null);

  const handleFile=(f:File)=>{
    setSize(`${(f.size/1024).toFixed(1)} KB`);
    const reader=new FileReader(); reader.onload=()=>setDataUrl(reader.result as string); reader.readAsDataURL(f);
  };

  return (
    <div className="space-y-5">
      {!dataUrl?(
        <div className="rounded-2xl border-2 border-dashed border-border/50 p-10 text-center cursor-pointer hover:border-primary/30 transition-colors" onClick={()=>fileRef.current?.click()}>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e=>{const f=e.target.files?.[0];if(f)handleFile(f)}}/>
          <FileUp className="h-10 w-10 mx-auto mb-3 text-muted-foreground"/><p className="text-sm font-medium">上传图片 → 转 Base64</p><p className="text-xs text-muted-foreground mt-1">生成 Data URL，适合内嵌网页或CSS</p>
        </div>
      ):(
        <>
          <img src={dataUrl} alt="预览" className="max-h-48 mx-auto rounded-xl border"/>
          <p className="text-xs text-muted-foreground text-center">原图：{size} | Base64：{(dataUrl.length/1024).toFixed(1)} KB</p>
          <div className="relative"><textarea readOnly value={dataUrl} className="w-full p-3 rounded-xl border border-border/50 bg-muted/50 text-[10px] font-mono h-24 resize-none"/><button onClick={()=>navigator.clipboard.writeText(dataUrl)} className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-muted"><Copy className="h-3.5 w-3.5"/></button></div>
        </>
      )}
    </div>
  );
}
