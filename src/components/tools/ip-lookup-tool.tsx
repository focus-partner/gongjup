"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input"; import { Label } from "@/components/ui/label"; import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export function IPLookupTool() {
  const [ip,setIp]=useState(""); const [result,setResult]=useState<Record<string,string>|null>(null); const [loading,setLoading]=useState(false);
  const lookup=async()=>{
    setLoading(true); try{
      const res=await fetch(`https://api.ip.sb/geoip/${ip||""}`,{headers:{Accept:"application/json"}});
      const data=await res.json(); setResult(data);
    }catch{setResult({error:"查询失败"})}finally{setLoading(false)}
  };
  return (
    <div className="space-y-5">
      <div className="flex items-end gap-3">
        <div className="flex-1"><Label>IP地址（留空查自己的IP）</Label><Input value={ip} onChange={e=>setIp(e.target.value)} className="mt-1.5 font-mono" placeholder="如 8.8.8.8"/></div>
        <Button onClick={lookup} disabled={loading}>{loading?<Loader2 className="h-4 w-4 animate-spin"/>:"查询"}</Button>
      </div>
      {result && !result.error && <div className="grid grid-cols-2 gap-3">{Object.entries(result).filter(([,v])=>typeof v==="string").map(([k,v])=><div key={k} className="rounded-xl border border-border/50 bg-card p-3"><p className="text-[10px] text-muted-foreground uppercase">{k}</p><p className="text-sm font-medium truncate">{v}</p></div>)}</div>}
      {result?.error && <div className="p-3 rounded-xl bg-red-50 text-red-700 text-sm">{result.error}</div>}
    </div>
  );
}
