"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input"; import { Label } from "@/components/ui/label"; import { Textarea } from "@/components/ui/textarea"; import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";

const avatars=["🐱","🐶","🐰","🐼","🦊","🐸","🐵","🦄","🐲","🐳","🌸","🍀"];

export function MomentsTool() {
  const [name,setName]=useState("小明");
  const [av,setAv]=useState(0);
  const [content,setContent]=useState("今天天气真好！🌞");
  const [time,setTime]=useState("5分钟前");
  const [likes,setLikes]=useState("小红, 张三, 李四, 王五");
  const [comment1,setC1]=useState({name:"小红",text:"哇好漂亮！"});
  const [comment2,setC2]=useState({name:"张三",text:"下次带我一个"});
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div><Label>昵称</Label><Input value={name} onChange={e=>setName(e.target.value)} className="mt-1.5"/></div>
        <div><Label>发布时间</Label><Input value={time} onChange={e=>setTime(e.target.value)} className="mt-1.5"/></div>
        <div className="sm:col-span-2"><Label>朋友圈内容</Label><Textarea value={content} onChange={e=>setContent(e.target.value)} className="mt-1.5" rows={3}/></div>
        <div><Label>点赞人（逗号分隔）</Label><Input value={likes} onChange={e=>setLikes(e.target.value)} className="mt-1.5"/></div>
        <div><Label>头像</Label><div className="flex gap-1 mt-1.5 flex-wrap">{avatars.map((a,i)=><button key={i} onClick={()=>setAv(i)} className={`text-xl p-1 rounded-lg ${i===av?"bg-primary/20 border border-primary/50":"hover:bg-muted"}`}>{a}</button>)}</div></div>
      </div>
      {/* 预览 */}
      <div className="max-w-sm mx-auto bg-white dark:bg-gray-900 rounded-xl border border-border/50 p-4 space-y-3">
        <div className="flex items-center gap-2"><span className="text-2xl">{avatars[av]}</span><div><p className="text-sm font-medium">{name}</p><p className="text-[10px] text-muted-foreground">{time}</p></div></div>
        <p className="text-sm leading-relaxed">{content}</p>
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/30">
          <span>❤️ {likes.split(",").length}人赞过</span>
          <span>💬 2条评论</span>
        </div>
        <div className="text-xs space-y-1 bg-muted/30 p-2 rounded-lg">
          <p><span className="font-medium text-primary">{comment1.name}</span>：{comment1.text}</p>
          <p><span className="font-medium text-primary">{comment2.name}</span>：{comment2.text}</p>
        </div>
      </div>
      <p className="text-xs text-muted-foreground text-center">📱 仅供娱乐整蛊</p>
    </div>
  );
}
