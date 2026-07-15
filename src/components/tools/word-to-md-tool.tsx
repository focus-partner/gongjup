"use client";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { wordToMarkdown } from "@/engines/file-converters";
import { FileUp, Download, Loader2 } from "lucide-react";

export function WordToMDTool() {
  const [status,setStatus]=useState<"idle"|"loading"|"done"|"error">("idle");
  const [md,setMd]=useState(""); const [fileName,setFileName]=useState(""); const [error,setError]=useState("");
  const fileRef=useRef<HTMLInputElement>(null);

  const handleFile=async(f:File)=>{
    setFileName(f.name); setStatus("loading"); setError(""); setMd("");
    try{const r=await wordToMarkdown(f);setMd(r);setStatus("done")}
    catch(err){setError(err instanceof Error?err.message:"解析失败");setStatus("error")}
  };

  const download=()=>{const blob=new Blob([md],{type:"text/markdown"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=fileName.replace(/\.docx?$/i,"")+".md";a.click();URL.revokeObjectURL(url)};

  return (
    <div className="space-y-5">
      <div className={`rounded-2xl border-2 border-dashed p-8 text-center cursor-pointer transition-colors ${status==="loading"?"border-primary/30 bg-primary/[0.02]":"border-border/50 hover:border-primary/30 hover:bg-muted/50"}`}
        onClick={()=>fileRef.current?.click()} onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();const f=e.dataTransfer.files[0];if(f?.name.match(/\.docx?$/i))handleFile(f)}}>
        <input ref={fileRef} type="file" accept=".docx,.doc" className="hidden" onChange={e=>{const f=e.target.files?.[0];if(f)handleFile(f)}}/>
        {status==="loading"?(<div className="space-y-3"><Loader2 className="h-10 w-10 mx-auto animate-spin text-primary"/><p className="text-sm font-medium">正在解析文档...</p></div>)
        :(<><FileUp className="h-10 w-10 mx-auto mb-3 text-muted-foreground"/><p className="text-sm font-medium">上传 Word 文档 → 转 Markdown</p><p className="text-xs text-muted-foreground mt-1">支持 .docx，处理在本地浏览器完成</p></>)}
      </div>
      {status==="error"&&<div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}
      {status==="done"&&md&&<>
        <Button onClick={download} size="sm"><Download className="h-3.5 w-3.5 mr-1"/>下载 .md</Button>
        <div className="rounded-xl border border-border/50 bg-muted/30 p-4 max-h-80 overflow-y-auto"><pre className="text-xs leading-relaxed whitespace-pre-wrap font-sans">{md.slice(0,3000)}{md.length>3000&&"\n\n... 更多内容请下载查看"}</pre></div>
      </>}
    </div>
  );
}
