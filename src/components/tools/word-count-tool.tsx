"use client";

import { useState, useMemo } from "react";
import { Textarea } from "@/components/ui/textarea";
import { countWords } from "@/engines/word-count";

/** 字数统计工具 */
export function WordCountTool() {
  const [text, setText] = useState("");
  const stats = useMemo(() => countWords(text), [text]);

  const items = [
    { label: "总字符数", value: stats.totalChars },
    { label: "中文字符", value: stats.chineseChars },
    { label: "英文单词", value: stats.englishWords },
    { label: "数字个数", value: stats.numbers },
    { label: "标点符号", value: stats.punctuation },
    { label: "行数", value: stats.lines },
    { label: "段落数", value: stats.paragraphs },
    { label: "中文阅读时间", value: `${stats.readingTimeMin} 分钟` },
    { label: "英文阅读时间", value: `${stats.readingTimeEn} 分钟` },
  ];

  return (
    <div className="space-y-4">
      <Textarea
        placeholder="输入或粘贴文本，自动统计字数..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={8}
        className="text-sm"
      />

      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
        {items.map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-border/50 bg-muted/30 p-3 text-center"
          >
            <p className="text-2xl font-bold text-foreground">{item.value}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
