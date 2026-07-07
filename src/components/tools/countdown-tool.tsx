"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input"; import { Label } from "@/components/ui/label"; import { Button } from "@/components/ui/button";

export function CountdownTool() {
  const [title,setTitle]=useState(""); const [target,setTarget]=useState("");
  const [now,setNow]=useState(Date.now());
  useEffect(()=>{const t=setInterval(()=>setNow(Date.now()),1000);return ()=>clearInterval(t)},[]);
  const diff = target ? new Date(target).getTime() - now : 0;
  const days=Math.floor(diff/86400000); const hours=Math.floor((diff%86400000)/3600000);
  const mins=Math.floor((diff%3600000)/60000); const secs=Math.floor((diff%60000)/1000);
  const past = diff < 0;
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div><Label>事件名称</Label><Input value={title} onChange={e=>setTitle(e.target.value)} className="mt-1.5" placeholder="如：春节、生日、项目上线"/></div>
        <div><Label>目标日期时间</Label><Input type="datetime-local" value={target} onChange={e=>setTarget(e.target.value)} className="mt-1.5"/></div>
      </div>
      {target && (
        <div className="rounded-2xl border border-border/50 bg-card p-8 text-center">
          <p className="text-sm text-muted-foreground mb-2">{title||"目标事件"} {past?"已过去":"倒计时"}</p>
          <div className="flex items-center justify-center gap-3 sm:gap-5">
            {[{v:Math.abs(days),l:"天"},{v:hours,l:"时"},{v:mins,l:"分"},{v:secs,l:"秒"}].map(({v,l})=>(
              <div key={l} className="text-center"><span className="text-4xl sm:text-5xl font-bold font-mono text-primary">{String(v).padStart(2,"0")}</span><span className="block text-xs text-muted-foreground mt-1">{l}</span></div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-4">{past?"已过去":"距离"} {new Date(target).toLocaleDateString("zh-CN",{year:"numeric",month:"long",day:"numeric",weekday:"long"})}</p>
        </div>
      )}
    </div>
  );
}
