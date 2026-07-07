"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input"; import { Label } from "@/components/ui/label";
import { lookupPhone } from "@/engines/phone-lookup";

export function PhoneLookupTool() {
  const [phone,setPhone]=useState(""); const r=lookupPhone(phone);
  return (
    <div className="space-y-6">
      <div><Label>输入手机号码</Label><Input value={phone} onChange={e=>setPhone(e.target.value)} className="mt-1.5 font-mono" placeholder="13800138000" maxLength={11}/></div>
      {phone.length===11 && (
        r.valid ? (
          <div className="grid grid-cols-2 gap-3">
            {[{l:"运营商",v:r.carrierName},{l:"号段",v:phone.slice(0,3)},{l:"号码",v:phone.slice(3)}].map(({l,v})=>(
              <div key={l} className="rounded-xl border border-border/50 bg-card p-3 text-center"><p className="text-xs text-muted-foreground">{l}</p><p className="text-lg font-bold">{v}</p></div>
            ))}
          </div>
        ) : <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{r.error}</div>
      )}
      <p className="text-xs text-muted-foreground">💡 查询在本地浏览器完成，不会记录您的号码</p>
    </div>
  );
}
