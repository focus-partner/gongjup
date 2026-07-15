"use client";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { extractPDFText, type PDFExtractResult } from "@/engines/pdf-to-word";
import { toMarkdown, downloadMarkdown } from "@/engines/pdf-to-md";
import { FileUp, Download, Loader2 } from "lucide-react";

export function PDFToMDTool() {
  const [status,setStatus]=useState<"idle"|"loading"|"done"|"error">("idle");
  const [progress,setProgress]=useState(0); const [result,setResult]=useState<PDFExtractResult|null>(null);
  const [md,setMd]=useState(""); const [fileName,setFileName]=useState("");
  const [errorMsg,setErrorMsg]=useState("");
  const fileRef=useRef<HTMLInputElement>(null);

  const handleFile=async(f:File)=>{
    setFileName(f.name); setStatus("loading"); setProgress(0); setErrorMsg(""); setResult(null); setMd("");
    try{const r=await extractPDFText(f,setProgress);setResult(r);const markdown=toMarkdown(r);setMd(markdown);setStatus("done")}
    catch(err){setErrorMsg(err instanceof Error?err.message:"解析失败");setStatus("error")}
  };

  return (
    <div className="space-y-5">
      <div className={`rounded-2xl border-2 border-dashed p-8 text-center cursor-pointer transition-colors ${status==="loading"?"border-primary/30 bg-primary/[0.02]":"border-border/50 hover:border-primary/30 hover:bg-muted/50"}`}
        onClick={()=>fileRef.current?.click()} onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();const f=e.dataTransfer.files[0];if(f?.type==="application/pdf")handleFile(f)}}>
        <input ref={fileRef} type="file" accept="application/pdf" className="hidden" onChange={e=>{const f=e.target.files?.[0];if(f)handleFile(f)}}/>
        {status==="loading"?(<div className="space-y-3"><Loader2 className="h-10 w-10 mx-auto animate-spin text-primary"/><p className="text-sm font-medium">正在解析 PDF...</p><div className="mx-auto max-w-xs h-2 rounded-full bg-muted overflow-hidden"><div className="h-full rounded-full bg-primary transition-all" style={{width:`${progress}%`}}/></div><p className="text-xs text-muted-foreground">{progress}%</p></div>)
        :(<><FileUp className="h-10 w-10 mx-auto mb-3 text-muted-foreground"/><p className="text-sm font-medium">上传 PDF → 转 Markdown</p><p className="text-xs text-muted-foreground mt-1">提取文字并转为MD格式，适合喂给AI大模型</p></>)}
      </div>
      {status==="error"&&<div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">{errorMsg}</div>}
      {status==="done"&&md&&<>
        <div className="flex gap-2"><Button onClick={()=>downloadMarkdown(md,fileName||"document.pdf")} size="sm"><Download className="h-3.5 w-3.5 mr-1"/>下载 .md</Button></div>
        <div className="rounded-xl border border-border/50 bg-muted/30 p-4 max-h-80 overflow-y-auto"><pre className="text-xs leading-relaxed whitespace-pre-wrap font-mono">{md.slice(0,3000)}{md.length>3000&&"\n\n... 更多内容请下载查看"}</pre></div>
      </>}
    </div>
  );
}
