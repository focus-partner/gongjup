"use client";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { FileUp } from "lucide-react";

let _ExifReader: typeof import("exifreader") | null = null;
async function getExif() { if(!_ExifReader){_ExifReader=await import("exifreader")} return _ExifReader }

export function EXIFViewerTool() {
  const [tags,setTags]=useState<{label:string;value:string}[]>([]); const [preview,setPreview]=useState("");
  const fileRef=useRef<HTMLInputElement>(null);

  const handleFile=async(f:File)=>{
    const url=URL.createObjectURL(f); setPreview(url);
    try{const ExifReader=await getExif();const tags_=await ExifReader.load(f);const result:typeof tags=[];
      const map:Record<string,string>={"Make":"相机制造商","Model":"相机型号","DateTimeOriginal":"拍摄时间","ImageWidth":"宽度","ImageHeight":"高度","FNumber":"光圈","ISOSpeedRatings":"ISO","ExposureTime":"曝光时间","FocalLength":"焦距","Flash":"闪光灯","GPSLatitude":"GPS纬度","GPSLongitude":"GPS经度","Software":"软件","Copyright":"版权"};
      for(const[k,v]of Object.entries(map)){const val=tags_[k];if(val&&val.description)result.push({label:v,value:String(val.description)})}
      if(result.length===0)result.push({label:"提示",value:"该图片不含EXIF元数据（可能被社交平台压缩过）"});
      setTags(result);
    }catch{setTags([{label:"错误",value:"读取EXIF失败"}])}
  };

  return (
    <div className="space-y-5">
      {!preview?(
        <div className="rounded-2xl border-2 border-dashed border-border/50 p-10 text-center cursor-pointer hover:border-primary/30 transition-colors" onClick={()=>fileRef.current?.click()}>
          <input ref={fileRef} type="file" accept="image/*,.heic" className="hidden" onChange={e=>{const f=e.target.files?.[0];if(f)handleFile(f)}}/>
          <FileUp className="h-10 w-10 mx-auto mb-3 text-muted-foreground"/><p className="text-sm font-medium">上传照片查看EXIF信息</p><p className="text-xs text-muted-foreground mt-1">查相机型号、拍摄参数、GPS位置</p>
        </div>
      ):(
        <><img src={preview} alt="预览" className="max-h-48 mx-auto rounded-xl border"/>
        <div className="grid grid-cols-2 gap-2">{tags.map(({label,value})=><div key={label} className="p-3 rounded-xl border border-border/50 bg-card"><p className="text-[10px] text-muted-foreground">{label}</p><p className="text-xs font-mono font-medium break-all">{value}</p></div>)}</div></>
      )}
      <p className="text-xs text-muted-foreground">📷 照片信息在本地浏览器读取，不会上传</p>
    </div>
  );
}
