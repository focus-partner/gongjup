"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input"; import { Label } from "@/components/ui/label"; import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const airlines=["中国国际航空 CA","中国东方航空 MU","中国南方航空 CZ","海南航空 HU","深圳航空 ZH","厦门航空 MF","四川航空 3U","春秋航空 9C"];
const cities=["北京(PEK)","上海(PVG)","广州(CAN)","深圳(SZX)","成都(CTU)","杭州(HGH)","西安(XIY)","重庆(CKG)","昆明(KMG)","三亚(SYX)"];
const classes=["经济舱","超级经济舱","商务舱","头等舱"];

export function FakeTicketTool() {
  const [name,setName]=useState("张三");
  const [from,setFrom]=useState(4); const [to,setTo]=useState(2);
  const [flight,setFlight]=useState(()=>"CA"+String(Math.floor(Math.random()*9000)+1000));
  const [airline,setAir]=useState(0);
  const [cls,setCls]=useState(0);
  const [date,setDate]=useState(()=>new Date(Date.now()+7*86400000).toISOString().slice(0,10));
  const gate="ABCDEFGH"[Math.floor(Math.random()*8)]+String(Math.floor(Math.random()*50)+1);
  const seat=String(Math.floor(Math.random()*50)+1)+"ABCDEF"[Math.floor(Math.random()*6)];
  const d=new Date(date); const etd=String(d.getHours()+7).padStart(2,"0")+":"+String(Math.floor(Math.random()*60)).padStart(2,"0");

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div><Label>乘客姓名</Label><Input value={name} onChange={e=>setName(e.target.value)} className="mt-1.5"/></div>
        <div><Label>航班号</Label><Input value={flight} onChange={e=>setFlight(e.target.value)} className="mt-1.5 font-mono"/></div>
        <div><Label>日期</Label><Input type="date" value={date} onChange={e=>setDate(e.target.value)} className="mt-1.5"/></div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div><Label>出发</Label><select value={from} onChange={e=>setFrom(Number(e.target.value))} className="w-full mt-1.5 rounded-lg border border-border/50 bg-background p-2 text-sm">{cities.map((c,i)=><option key={i} value={i}>{c}</option>)}</select></div>
        <div><Label>到达</Label><select value={to} onChange={e=>setTo(Number(e.target.value))} className="w-full mt-1.5 rounded-lg border border-border/50 bg-background p-2 text-sm">{cities.map((c,i)=><option key={i} value={i}>{c}</option>)}</select></div>
        <div><Label>舱位</Label><select value={cls} onChange={e=>setCls(Number(e.target.value))} className="w-full mt-1.5 rounded-lg border border-border/50 bg-background p-2 text-sm">{classes.map((c,i)=><option key={i} value={i}>{c}</option>)}</select></div>
      </div>
      <div className="rounded-2xl bg-gradient-to-b from-blue-600 to-blue-800 text-white p-6 max-w-md mx-auto shadow-lg">
        <div className="flex justify-between items-start mb-6"><div><p className="text-2xl font-bold">{airlines[airline]}</p><p className="text-xs text-blue-200 mt-1">BOARDING PASS</p></div><div className="text-right"><p className="text-lg font-mono font-bold">{flight}</p><p className="text-xs text-blue-200">{classes[cls]}</p></div></div>
        <div className="grid grid-cols-2 gap-4 mb-4"><div><p className="text-[10px] text-blue-200 uppercase">Passenger</p><p className="font-bold text-lg">{name}</p></div><div><p className="text-[10px] text-blue-200 uppercase">Date</p><p className="font-bold">{d.toLocaleDateString("zh-CN")}</p></div></div>
        <div className="grid grid-cols-3 gap-2 mb-4"><div><p className="text-[10px] text-blue-200">From</p><p className="font-bold text-sm">{cities[from]}</p></div><div className="text-center pt-4"><span className="text-2xl">✈</span></div><div><p className="text-[10px] text-blue-200">To</p><p className="font-bold text-sm">{cities[to]}</p></div></div>
        <div className="grid grid-cols-4 gap-2 pt-4 border-t border-blue-500"><div><p className="text-[10px] text-blue-200">Gate</p><p className="font-bold">{gate}</p></div><div><p className="text-[10px] text-blue-200">Seat</p><p className="font-bold">{seat}</p></div><div><p className="text-[10px] text-blue-200">ETD</p><p className="font-bold">{etd}</p></div><div><p className="text-[10px] text-blue-200">Class</p><p className="font-bold text-xs">{classes[cls]}</p></div></div>
      </div>
      <p className="text-xs text-muted-foreground text-center">✈️ 仅供娱乐整蛊，请勿用于非法用途</p>
    </div>
  );
}
