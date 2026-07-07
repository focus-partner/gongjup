"use client";
import { useEffect, useState } from "react";
import { Copy } from "lucide-react";

interface Info { label: string; value: string; }

export function DeviceInfoTool() {
  const [info,setInfo]=useState<Info[]>([]);
  useEffect(()=>{
    const data: Info[] = [
      {label:"屏幕分辨率",value:`${window.screen.width}×${window.screen.height}`},
      {label:"可用分辨率",value:`${window.screen.availWidth}×${window.screen.availHeight}`},
      {label:"设备像素比",value:`${window.devicePixelRatio}x`},
      {label:"浏览器",value:navigator.userAgentData?.platform||navigator.platform},
      {label:"语言",value:navigator.language},
      {label:"Cookie",value:navigator.cookieEnabled?"已启用":"已禁用"},
      {label:"在线状态",value:navigator.onLine?"在线":"离线"},
      {label:"颜色深度",value:`${window.screen.colorDepth}位`},
      {label:"User Agent",value:navigator.userAgent},
    ];
    setInfo(data);
  },[]);
  return (
    <div className="space-y-4">
      {info.map(({label,value})=>(
        <div key={label} className="flex items-start justify-between gap-3 p-3 rounded-xl border border-border/50 bg-card">
          <span className="text-xs text-muted-foreground shrink-0">{label}</span>
          <span className="text-xs font-mono text-right break-all">{value}</span>
          <button onClick={()=>navigator.clipboard.writeText(value)} className="shrink-0 p-0.5 rounded hover:bg-muted"><Copy className="h-3 w-3"/></button>
        </div>
      ))}
    </div>
  );
}
