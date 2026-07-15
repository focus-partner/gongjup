"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input"; import { Label } from "@/components/ui/label";
import { toSlug } from "@/engines/file-converters";
import { Copy } from "lucide-react";

export function SlugTool() {
  const [input,setInput]=useState(""); const slug=toSlug(input);
  return (
    <div className="space-y-5">
      <div><Label>输入文本</Label><Input value={input} onChange={e=>setInput(e.target.value)} className="mt-1.5" placeholder="输入文章标题..."/></div>
      {slug&&<div className="flex items-center gap-2 p-3 rounded-xl border border-border/50 bg-muted/30"><code className="text-sm font-mono flex-1">{slug}</code><button onClick={()=>navigator.clipboard.writeText(slug)} className="p-1.5 rounded-lg hover:bg-muted"><Copy className="h-3.5 w-3.5"/></button></div>}
      <p className="text-xs text-muted-foreground">💡 URL Slug：用于网址中的文章标识，如 my-article-title</p>
    </div>
  );
}
