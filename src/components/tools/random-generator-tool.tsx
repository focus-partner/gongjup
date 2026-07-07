"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input"; import { Label } from "@/components/ui/label"; import { Button } from "@/components/ui/button";
import { Copy, Shuffle } from "lucide-react";

export function RandomGeneratorTool() {
  const [min,setMin]=useState(1); const [max,setMax]=useState(100); const [count,setCount]=useState(1);
  const [result,setResult]=useState<number[]>([]);
  const [diceCount,setDiceCount]=useState(1); const [diceResult,setDiceResult]=useState<number[]>([]);
  const [pickFrom,setPickFrom]=useState(""); const [pickResult,setPickResult]=useState("");
  const generate = () => {
    const arr=[]; for(let i=0;i<count;i++) arr.push(Math.floor(Math.random()*(max-min+1))+min);
    setResult(arr);
  };
  const rollDice = () => { const a=[]; for(let i=0;i<diceCount;i++) a.push(Math.floor(Math.random()*6)+1); setDiceResult(a); };
  const pick = () => { const items=pickFrom.split(/[,，\n]/).map(s=>s.trim()).filter(Boolean); if(items.length)setPickResult(items[Math.floor(Math.random()*items.length)]); };
  return (
    <div className="space-y-8">
      {/* 随机数 */}
      <div className="rounded-2xl border border-border/50 bg-card p-6 space-y-4">
        <h3 className="font-medium">🎲 随机数生成</h3>
        <div className="grid grid-cols-3 gap-3">
          <div><Label>最小值</Label><Input type="number" value={min} onChange={e=>setMin(Number(e.target.value))} className="mt-1.5"/></div>
          <div><Label>最大值</Label><Input type="number" value={max} onChange={e=>setMax(Number(e.target.value))} className="mt-1.5"/></div>
          <div><Label>生成个数</Label><Input type="number" value={count} min={1} max={50} onChange={e=>setCount(Number(e.target.value))} className="mt-1.5"/></div>
        </div>
        <Button onClick={generate} size="sm"><Shuffle className="h-3.5 w-3.5 mr-1"/>生成</Button>
        {result.length>0 && <div className="flex flex-wrap gap-2">{result.map((n,i)=><span key={i} className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary font-mono font-bold text-sm">{n}</span>)}</div>}
      </div>
      {/* 骰子 */}
      <div className="rounded-2xl border border-border/50 bg-card p-6 space-y-4">
        <h3 className="font-medium">🎯 掷骰子</h3>
        <div className="flex items-center gap-3"><Label>骰子数量</Label><Input type="number" value={diceCount} min={1} max={10} onChange={e=>setDiceCount(Number(e.target.value))} className="w-20"/><Button onClick={rollDice} size="sm">掷</Button></div>
        {diceResult.length>0 && <div className="flex gap-3 text-4xl">{diceResult.map((n,i)=><span key={i}>{["","⚀","⚁","⚂","⚃","⚄","⚅"][n]}</span>)}</div>}
      </div>
      {/* 抽签 */}
      <div className="rounded-2xl border border-border/50 bg-card p-6 space-y-4">
        <h3 className="font-medium">🎴 随机抽取</h3>
        <div><Label>候选列表（逗号或换行分隔）</Label><Input value={pickFrom} onChange={e=>setPickFrom(e.target.value)} className="mt-1.5" placeholder="张三,李四,王五,赵六"/></div>
        <Button onClick={pick} size="sm">抽取</Button>
        {pickResult && <p className="text-2xl font-bold text-primary">🎉 {pickResult}</p>}
      </div>
    </div>
  );
}
