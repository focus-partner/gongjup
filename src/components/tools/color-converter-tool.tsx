"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input"; import { Label } from "@/components/ui/label"; import { Copy } from "lucide-react";

function hexToRgb(hex:string):string{const r=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);return r?`rgb(${parseInt(r[1],16)}, ${parseInt(r[2],16)}, ${parseInt(r[3],16)})`:"格式错误"}
function rgbToHex(rgb:string):string{const m=rgb.match(/\d+/g);if(!m||m.length<3)return"格式错误";return"#"+m.slice(0,3).map(x=>parseInt(x).toString(16).padStart(2,"0")).join("")}
function rgbToHsl(r:number,g:number,b:number):string{r/=255;g/=255;b/=255;const max=Math.max(r,g,b),min=Math.min(r,g,b);let h=0,s=0;const l=(max+min)/2;if(max!==min){const d=max-min;s=l>0.5?d/(2-max-min):d/(max+min);if(max===r)h=((g-b)/d+(g<b?6:0))/6;else if(max===g)h=((b-r)/d+2)/6;else h=((r-g)/d+4)/6}return`hsl(${Math.round(h*360)}, ${Math.round(s*100)}%, ${Math.round(l*100)}%)`}

export function ColorConverterTool() {
  const [hex,setHex]=useState("#3B82F6"); const [rgb,setRgb]=useState(""); const [hsl,setHsl]=useState("");
  const convertFromHex=()=>{const r=hexToRgb(hex);setRgb(r);if(!r.startsWith("格式")){const m=r.match(/\d+/g);if(m)setHsl(rgbToHsl(+m[0],+m[1],+m[2]))}};
  const convertFromRgb=()=>{setHex(rgbToHex(rgb));const m=rgb.match(/\d+/g);if(m)setHsl(rgbToHsl(+m[0],+m[1],+m[2]))};
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 rounded-2xl border border-border/50 shadow-sm" style={{background:hex.startsWith("#")||hex.startsWith("rgb")?hex:"#3B82F6"}}/>
        <div className="flex-1 grid grid-cols-1 gap-3">
          <div className="flex items-center gap-2"><Label className="w-10 text-xs">HEX</Label><Input value={hex} onChange={e=>setHex(e.target.value)} className="font-mono text-sm" onBlur={convertFromHex}/><button onClick={()=>navigator.clipboard.writeText(hex)} className="p-1"><Copy className="h-3 w-3"/></button></div>
          <div className="flex items-center gap-2"><Label className="w-10 text-xs">RGB</Label><Input value={rgb} onChange={e=>{setRgb(e.target.value);convertFromRgb()}} className="font-mono text-sm"/><button onClick={()=>navigator.clipboard.writeText(rgb)} className="p-1"><Copy className="h-3 w-3"/></button></div>
          <div className="flex items-center gap-2"><Label className="w-10 text-xs">HSL</Label><Input value={hsl} readOnly className="font-mono text-sm bg-muted/50"/><button onClick={()=>navigator.clipboard.writeText(hsl)} className="p-1"><Copy className="h-3 w-3"/></button></div>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">💡 输入HEX或RGB值，自动转换。点击HEX右侧色块可打开取色器</p>
    </div>
  );
}
