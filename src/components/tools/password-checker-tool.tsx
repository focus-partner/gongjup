"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input"; import { Label } from "@/components/ui/label";
import { checkPasswordStrength } from "@/engines/file-converters";

export function PasswordCheckerTool() {
  const [pw,setPw]=useState(""); const r=checkPasswordStrength(pw);
  return (
    <div className="space-y-5">
      <div><Label>输入要检测的密码</Label><Input type="password" value={pw} onChange={e=>setPw(e.target.value)} className="mt-1.5 font-mono text-lg" placeholder="输入密码..."/></div>
      {pw&&<>
        <div className="flex items-center gap-3"><div className="flex-1 h-3 rounded-full bg-muted overflow-hidden"><div className={`h-full rounded-full transition-all ${r.color.replace("text","bg")}`} style={{width:`${(r.score/6)*100}%`}}/></div><span className={`text-sm font-bold ${r.color}`}>{r.label}</span></div>
        <div className="grid grid-cols-2 gap-1.5">{r.checks.map(c=><div key={c.label} className={`flex items-center gap-1.5 p-2 rounded-lg text-xs ${c.pass?"bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400":"bg-muted text-muted-foreground"}`}><span>{c.pass?"✅":"❌"}</span>{c.label}</div>)}</div>
      </>}
      <p className="text-xs text-muted-foreground">🔒 密码在浏览器本地检测，不会上传服务器</p>
    </div>
  );
}
