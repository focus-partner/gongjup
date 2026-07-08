"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input"; import { Label } from "@/components/ui/label";
import { calcChasingBet } from "@/engines/lottery-bet";

export function LotteryCalcTool() {
  const [base,setBase]=useState(10); const [odds,setOdds]=useState(2.0); const [mult,setMult]=useState(2); const [rounds,setRounds]=useState(8);
  const r=calcChasingBet(base,odds,mult,rounds);
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div><Label>起投(元)</Label><Input type="number" value={base} onChange={e=>setBase(Number(e.target.value))} className="mt-1.5"/></div>
        <div><Label>赔率</Label><Input type="number" step="0.1" value={odds} onChange={e=>setOdds(Number(e.target.value))} className="mt-1.5"/></div>
        <div><Label>倍投倍数</Label><Input type="number" value={mult} onChange={e=>setMult(Number(e.target.value))} className="mt-1.5"/></div>
        <div><Label>最大轮次</Label><Input type="number" value={rounds} onChange={e=>setRounds(Number(e.target.value))} className="mt-1.5"/></div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[{l:"累积投注",v:"¥"+r.totalBet.toLocaleString()},{l:"单次中奖回报",v:"¥"+r.rounds[r.rounds.length-1].ifWin.toLocaleString()},{l:"净利润",v:(r.netProfit>=0?"+":"")+"¥"+r.netProfit.toLocaleString()}].map(({l,v})=><div key={l} className="rounded-xl border border-border/50 bg-card p-4 text-center"><p className="text-xs text-muted-foreground">{l}</p><p className={`text-lg font-bold mt-1 ${l==="净利润"?r.netProfit>=0?"text-green-600":"text-red-500":"text-primary"}`}>{v}</p></div>)}
      </div>
      <div className="overflow-auto rounded-xl border border-border/50">
        <table className="w-full text-xs"><thead><tr className="bg-muted/50">{["轮次","本轮投注","累积投入","若中奖回报","净利润"].map(h=><th key={h} className="p-2 text-left font-medium">{h}</th>)}</tr></thead>
          <tbody>{r.rounds.map(rr=><tr key={rr.round} className="border-t border-border/30 hover:bg-muted/30"><td className="p-2">{rr.round}</td><td className="p-2 font-mono">¥{rr.betAmount.toLocaleString()}</td><td className="p-2 font-mono">¥{rr.accumulated.toLocaleString()}</td><td className="p-2 font-mono">¥{rr.ifWin.toLocaleString()}</td><td className={`p-2 font-mono font-bold ${rr.netProfit>=0?"text-green-600":"text-red-500"}`}>{rr.netProfit>=0?"+":""}¥{rr.netProfit.toLocaleString()}</td></tr>)}</tbody></table>
      </div>
      <p className="text-xs text-muted-foreground text-red-500">⚠️ 倍投风险极大，连黑时资金压力成倍增长。仅供研究，理性购彩。</p>
    </div>
  );
}
