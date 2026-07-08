"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";

type Blood = "A"|"B"|"AB"|"O";
const all: Blood[] = ["A","B","AB","O"];

const compat: Record<string,{love:string;friend:string;work:string;memo:string}> = {
  "A,A":{love:"⭐⭐⭐⭐ 默契满分",friend:"⭐⭐⭐⭐⭐ 最佳密友",work:"⭐⭐⭐⭐ 高效搭档",memo:"两个A型人在一起，计划周密，生活井井有条。偶尔会因为谁做决定而争执，但最终都能达成共识。"},
  "A,B":{love:"⭐⭐⭐ 互补型",friend:"⭐⭐⭐ 互相欣赏",work:"⭐⭐⭐⭐ B的创意+A的执行",memo:"A型的稳重与B型的活泼形成互补。需要注意A型不要太苛责B型的随性。"},
  "A,AB":{love:"⭐⭐⭐⭐ 理解万岁",friend:"⭐⭐⭐⭐⭐ 灵魂伴侣型朋友",work:"⭐⭐⭐ 需要磨合",memo:"AB型最理解A型的敏感，A型最欣赏AB型的理性。两人的关系通常很稳定。"},
  "A,O":{love:"⭐⭐⭐⭐⭐ 经典配对",friend:"⭐⭐⭐⭐ 互相照顾",work:"⭐⭐⭐⭐⭐ 最佳拍档",memo:"O型的包容与A型的认真是天作之合。O型能给A型安全感，A型给O型稳定感。"},
  "B,B":{love:"⭐⭐⭐⭐ 自由恋爱",friend:"⭐⭐⭐⭐⭐ 臭味相投",work:"⭐⭐ 容易一起拖延",memo:"两个B型在一起，自由自在不受拘束。但都太随性，生活可能缺一个做决定的人。"},
  "B,AB":{love:"⭐⭐⭐⭐ 理性之恋",friend:"⭐⭐⭐ 性格互补",work:"⭐⭐⭐⭐ AB的领导+B的执行",memo:"AB型的冷静与B型的热情平衡得恰到好处。"},
  "B,O":{love:"⭐⭐⭐⭐ 活力组合",friend:"⭐⭐⭐⭐⭐ 玩伴型",work:"⭐⭐⭐ 需明确分工",memo:"O型的领导欲与B型的随和搭配得不错，但O型可能会觉得B型不够认真。"},
  "AB,AB":{love:"⭐⭐⭐ 两个大脑",friend:"⭐⭐⭐ 君子之交",work:"⭐⭐⭐⭐⭐ 智商碾压",memo:"都是理性派，沟通高效但缺乏激情。建议多安排一些浪漫的活动增加感情。"},
  "AB,O":{love:"⭐⭐⭐⭐ 强强联手",friend:"⭐⭐⭐⭐ 互相尊重",work:"⭐⭐⭐⭐⭐ 战略大师+执行高手",memo:"O型的行动力配AB型的分析力，无敌组合。但双方都很强势，需要学会退让。"},
  "O,O":{love:"⭐⭐⭐ 两个领导",friend:"⭐⭐⭐⭐ 意气相投",work:"⭐⭐ 容易冲突",memo:"两个O型都是领导型人格，在一起要么神仙打架要么神仙眷侣。学会轮流当领导是关键。"},
};

export function BloodTypeTool() {
  const [a,setA]=useState<Blood|"">(""); const [b,setB]=useState<Blood|"">("");
  const key = a&&b ? `${a},${b}` : "";
  const result = key ? (compat[key]||compat[Object.entries(compat).find(([k])=>k===`${b},${a}`)?.[0]||""]) : null;
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div><p className="text-sm font-medium mb-2">你的血型</p><div className="grid grid-cols-4 gap-2">{all.map(t=><button key={t} onClick={()=>setA(t)} className={`py-3 rounded-xl font-bold text-lg border transition-all ${a===t?"border-red-500 bg-red-50 text-red-600 dark:bg-red-950":"border-border/50 hover:border-red-200"}`}>{t}型</button>)}</div></div>
        <div><p className="text-sm font-medium mb-2">TA的血型</p><div className="grid grid-cols-4 gap-2">{all.map(t=><button key={t} onClick={()=>setB(t)} className={`py-3 rounded-xl font-bold text-lg border transition-all ${b===t?"border-red-500 bg-red-50 text-red-600 dark:bg-red-950":"border-border/50 hover:border-red-200"}`}>{t}型</button>)}</div></div>
      </div>
      {result && <div className="rounded-2xl border border-red-100 bg-red-50/50 dark:bg-red-950/10 p-6 space-y-3">
        {[{l:"💕 恋爱",v:result.love},{l:"🤝 友情",v:result.friend},{l:"💼 工作",v:result.work}].map(({l,v})=><div key={l} className="flex justify-between items-center"><span className="text-sm font-medium">{l}</span><span className="text-sm">{v}</span></div>)}
        <p className="text-sm text-muted-foreground pt-3 border-t border-red-100 dark:border-red-900">{result.memo}</p>
      </div>}
    </div>
  );
}
