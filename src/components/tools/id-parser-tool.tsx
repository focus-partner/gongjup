"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input"; import { Label } from "@/components/ui/label";
import { parseIDNumber } from "@/engines/id-parser";

export function IDParserTool() {
  const [id,setId]=useState(""); const r=parseIDNumber(id);
  return (
    <div className="space-y-6">
      <div><Label>输入18位身份证号码</Label><Input value={id} onChange={e=>setId(e.target.value)} className="mt-1.5 font-mono" placeholder="110101199001011234" maxLength={18}/></div>
      {id.length===18 && (
        r.valid ? (
          <div className="grid grid-cols-2 gap-3">
            {[{l:"省份",v:r.province},{l:"出生日期",v:r.birthDate},{l:"年龄",v:r.age+"岁"},{l:"性别",v:r.gender},{l:"生肖",v:r.zodiac}].map(({l,v})=>(
              <div key={l} className="rounded-xl border border-border/50 bg-card p-3"><p className="text-xs text-muted-foreground">{l}</p><p className="text-lg font-bold">{v}</p></div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">{r.error}</div>
        )
      )}
      <p className="text-xs text-muted-foreground">💡 号码仅在浏览器本地解析，不会上传服务器</p>
    </div>
  );
}
