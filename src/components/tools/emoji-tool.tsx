"use client";
import { useState } from "react";
import { emojiData } from "@/engines/quick-tools";
import { Copy, Search } from "lucide-react";

export function EmojiTool() {
  const [search,setSearch]=useState("");
  const filtered=search?emojiData.map(c=>({...c,items:c.items.filter(i=>i.name.includes(search))})).filter(c=>c.items.length):emojiData;
  return (
    <div className="space-y-5">
      <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/><input value={search} onChange={e=>setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 rounded-xl border border-border/50 bg-background text-sm" placeholder="搜索Emoji..." /></div>
      {filtered.map(c=>(<div key={c.category}><p className="text-xs text-muted-foreground mb-2">{c.category}</p><div className="grid grid-cols-6 sm:grid-cols-8 gap-1.5">{c.items.map(i=><button key={i.emoji} onClick={()=>navigator.clipboard.writeText(i.emoji)} className="p-2 rounded-lg hover:bg-muted text-xl text-center transition-colors" title={i.name}>{i.emoji}</button>)}</div></div>))}
      <p className="text-xs text-muted-foreground">💡 点击 emoji 直接复制</p>
    </div>
  );
}
