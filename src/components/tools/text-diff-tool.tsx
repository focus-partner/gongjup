"use client";

import { useState, useMemo } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { diffLines, diffJSON, getDiffStats, type DiffMode } from "@/engines/text-diff";
import { ArrowRightLeft } from "lucide-react";

/** 文本差异对比工具 */
export function TextDiffTool() {
  const [mode, setMode] = useState<DiffMode>("text");
  const [textA, setTextA] = useState("");
  const [textB, setTextB] = useState("");

  const lines = useMemo(() => {
    if (!textA && !textB) return [];
    if (mode === "json") return diffJSON(textA, textB);
    return diffLines(textA, textB);
  }, [textA, textB, mode]);

  const stats = useMemo(() => getDiffStats(lines), [lines]);

  const swap = () => {
    const tmp = textA;
    setTextA(textB);
    setTextB(tmp);
  };

  return (
    <div className="space-y-4">
      {/* 模式选择 */}
      <Tabs value={mode} onValueChange={(v) => setMode(v as DiffMode)}>
        <TabsList>
          <TabsTrigger value="text">文本对比</TabsTrigger>
          <TabsTrigger value="json">JSON 对比</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* 双输入框 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium mb-1.5 block text-red-600 dark:text-red-400">
            原始文本（旧）
          </label>
          <Textarea
            value={textA}
            onChange={(e) => setTextA(e.target.value)}
            placeholder="粘贴原始文本..."
            rows={8}
            className="font-mono text-xs leading-relaxed"
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-1.5 block text-green-600 dark:text-green-400">
            修改文本（新）
          </label>
          <Textarea
            value={textB}
            onChange={(e) => setTextB(e.target.value)}
            placeholder="粘贴修改后文本..."
            rows={8}
            className="font-mono text-xs leading-relaxed"
          />
        </div>
      </div>

      {/* 统计 + 交换 */}
      {lines.length > 0 && (
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm text-green-600">+{stats.added} 新增</span>
          <span className="text-sm text-red-600">-{stats.removed} 删除</span>
          <span className="text-sm text-muted-foreground">{stats.unchanged} 不变</span>
          <button
            onClick={swap}
            className="ml-auto inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <ArrowRightLeft className="h-3 w-3" />
            交换
          </button>
        </div>
      )}

      {/* Diff 结果 */}
      {lines.length > 0 && (
        <div className="rounded-xl border border-border/50 overflow-hidden">
          <div className="bg-muted/50 px-3 py-2 border-b border-border/50">
            <span className="text-xs font-medium">对比结果</span>
          </div>
          <div className="max-h-96 overflow-auto font-mono text-xs">
            {lines.map((line, i) => (
              <div
                key={i}
                className={`flex px-3 py-0.5 leading-relaxed ${
                  line.type === "added"
                    ? "bg-green-50 dark:bg-green-950/10 text-green-800 dark:text-green-300"
                    : line.type === "removed"
                    ? "bg-red-50 dark:bg-red-950/10 text-red-800 dark:text-red-300"
                    : ""
                }`}
              >
                <span className="w-8 shrink-0 text-muted-foreground select-none text-right mr-2">
                  {line.type === "added" ? "+" : line.type === "removed" ? "-" : " "}
                </span>
                <span className="whitespace-pre-wrap break-all">{line.content}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
