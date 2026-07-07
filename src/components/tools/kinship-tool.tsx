"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { getKinship } from "@/engines/kinship";

const steps = [
  { q:"关系从谁开始？", opts:["爸爸","妈妈","自己"] },
  { q:"是TA的什么人？", opts:["哥哥","弟弟","姐姐","妹妹","爸爸","妈妈"] },
  { q:"需要加配偶吗？", opts:["不加","的妻子","的丈夫"] },
];

export function KinshipTool() {
  const [path,setPath]=useState<string[]>([]);
  const [step,setStep]=useState(0);
  const select = (opt:string) => {
    const next=[...path,opt]; setPath(next);
    const result = getKinship(next);
    if(result){setStep(-1)}else if(step<steps.length-1){setStep(step+1)}else{setStep(-1)}
  };
  const reset = () => {setPath([]);setStep(0);};
  const result = getKinship(path);
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border/50 bg-card p-6">
        <p className="text-sm text-muted-foreground mb-4">
          {path.length===0?"选择你和亲戚的关系路径":`已选：${path.join(" → ")}`}
        </p>
        {result ? (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">称呼</p>
            <p className="text-4xl font-bold text-primary mt-2">{result.call}</p>
            <p className="text-sm text-muted-foreground mt-2">{result.explain}</p>
            <Button variant="outline" size="sm" className="mt-6" onClick={reset}>重新查询</Button>
          </div>
        ) : step>=0 && step<steps.length ? (
          <div>
            <p className="font-medium mb-3">{steps[step].q}</p>
            <div className="flex flex-wrap gap-2">
              {steps[step].opts.map(o=><Button key={o} variant="outline" size="sm" onClick={()=>select(o)}>{o}</Button>)}
            </div>
          </div>
        ) : (
          <div className="text-center py-8"><p className="text-muted-foreground mb-4">没找到对应称呼，试试不同路径</p><Button variant="outline" size="sm" onClick={reset}>重新开始</Button></div>
        )}
      </div>
      <p className="text-xs text-muted-foreground text-center">💡 中国亲戚称呼大全——再也不用担心叫错人</p>
    </div>
  );
}
