"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input"; import { Label } from "@/components/ui/label"; import { Button } from "@/components/ui/button";
import { splitBill, type BillItem } from "@/engines/bill-split";
import { Plus, Trash2 } from "lucide-react";

export function BillSplitTool() {
  const [count,setCount]=useState(4);
  const [items,setItems]=useState<BillItem[]>([{name:"餐费",amount:300,paidBy:0}]);
  const [result,setResult]=useState<ReturnType<typeof splitBill>|null>(null);
  const addItem=()=>setItems([...items,{name:"",amount:0,paidBy:0}]);
  const updateItem=(i:number,f:Partial<BillItem>)=>{const n=[...items];n[i]={...n[i],...f};setItems(n)};
  const removeItem=(i:number)=>setItems(items.filter((_,idx)=>idx!==i));
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3"><Label>参与人数</Label><Input type="number" min={2} max={20} value={count} onChange={e=>setCount(Number(e.target.value))} className="w-20"/></div>
      <div className="space-y-2">
        {items.map((item,i)=><div key={i} className="flex items-center gap-2 p-2 rounded-xl border border-border/50 bg-card"><Input value={item.name} onChange={e=>updateItem(i,{name:e.target.value})} className="flex-1" placeholder="项目"/><Input type="number" value={item.amount} onChange={e=>updateItem(i,{amount:Number(e.target.value)})} className="w-24" placeholder="金额"/><select value={item.paidBy} onChange={e=>updateItem(i,{paidBy:Number(e.target.value)})} className="w-14 text-xs rounded-lg border border-border/50 bg-background p-1.5">{Array.from({length:count},(_,j)=><option key={j} value={j}>{j+1}号</option>)}</select><button onClick={()=>removeItem(i)} className="p-1 text-red-400"><Trash2 className="h-3.5 w-3.5"/></button></div>)}
        <button onClick={addItem} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground p-1"><Plus className="h-3 w-3"/>添加费用</button>
      </div>
      <Button size="sm" onClick={()=>setResult(splitBill(items,count))}>计算分账</Button>
      {result && <div className="space-y-3">
        <div className="grid grid-cols-3 gap-2">{[{l:"总金额",v:"¥"+result.total},{l:"人均",v:"¥"+result.perPerson},{l:"结算笔数",v:result.settlements.length+"笔"}].map(({l,v})=><div key={l} className="rounded-xl border border-border/50 bg-card p-3 text-center"><p className="text-[10px] text-muted-foreground">{l}</p><p className="text-lg font-bold text-primary">{v}</p></div>)}</div>
        {result.settlements.length>0 && <div className="rounded-xl border border-border/50 bg-green-50/50 p-4 dark:bg-green-950/20"><p className="text-xs font-medium mb-2">💸 结算方案</p>{result.settlements.map((s,i)=><p key={i} className="text-sm">{s.from+1}号 → {s.to+1}号：<span className="font-bold text-green-700 dark:text-green-400">¥{s.amount}</span></p>)}</div>}
      </div>}
    </div>
  );
}
