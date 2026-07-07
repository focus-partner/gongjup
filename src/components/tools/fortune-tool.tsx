"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Shuffle } from "lucide-react";

const fortunes = [
  {emoji:"🌟",text:"大吉",desc:"万事顺遂，好运连连"},
  {emoji:"☀️",text:"上吉",desc:"运势上升，事半功倍"},
  {emoji:"🍀",text:"中吉",desc:"平平淡淡才是真"},
  {emoji:"🌤️",text:"小吉",desc:"今天会有小惊喜"},
  {emoji:"🎯",text:"吉",desc:"心想事成，一箭中的"},
  {emoji:"💫",text:"末吉",desc:"虽然有波折，但结果不错"},
  {emoji:"🌈",text:"半吉",desc:"一半靠运气，一半靠努力"},
  {emoji:"🎪",text:"平",desc:"今天的主题是平和"},
];

export function FortuneTool() {
  const [result,setResult]=useState<typeof fortunes[0]|null>(null);
  const [count,setCount]=useState(0);
  const draw = () => { setResult(fortunes[Math.floor(Math.random()*fortunes.length)]); setCount(c=>c+1); };
  return (
    <div className="space-y-6 text-center">
      <div className="rounded-2xl border border-border/50 bg-card p-10 min-h-[300px] flex flex-col items-center justify-center">
        {result ? (
          <>
            <span className="text-7xl mb-4">{result.emoji}</span>
            <p className="text-3xl font-bold text-primary">{result.text}</p>
            <p className="text-muted-foreground mt-2">{result.desc}</p>
          </>
        ) : (
          <p className="text-muted-foreground">点击下方按钮抽取今日运势</p>
        )}
      </div>
      <Button onClick={draw} size="lg"><Shuffle className="h-4 w-4 mr-1.5"/>抽一签{count>0?` (第${count}次)`:" "}</Button>
    </div>
  );
}
