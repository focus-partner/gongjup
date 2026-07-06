"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { timestampToDate, dateToTimestamp, getCurrentTimestamp } from "@/engines/timestamp";
import { Copy, Clock } from "lucide-react";

/** 时间戳转换工具 */
export function TimestampTool() {
  const [mode, setMode] = useState<"ts-to-date" | "date-to-ts">("ts-to-date");
  const [input, setInput] = useState("");
  const [result, setResult] = useState<ReturnType<typeof getCurrentTimestamp> | null>(null);
  const [error, setError] = useState("");
  const [currentTs, setCurrentTs] = useState(getCurrentTimestamp());

  // 实时更新当前时间戳
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTs(getCurrentTimestamp());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleConvert = () => {
    setError("");
    const res = mode === "ts-to-date" ? timestampToDate(input) : dateToTimestamp(input);
    if (res.success) {
      setResult(res);
    } else {
      setResult(null);
      setError(res.error || "转换失败");
    }
  };

  const copyText = async (text: string | number) => {
    await navigator.clipboard.writeText(String(text));
  };

  return (
    <div className="space-y-6">
      {/* 实时当前时间戳 */}
      <div className="rounded-2xl border border-border/50 bg-card p-5">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">当前时间</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <ClickableStat
            label="北京时间"
            value={currentTs.datetime || ""}
            onCopy={() => copyText(currentTs.datetime || "")}
          />
          <ClickableStat
            label="秒级时间戳（10位）"
            value={String(currentTs.timestampSeconds || "")}
            onCopy={() => copyText(currentTs.timestampSeconds || "")}
          />
          <ClickableStat
            label="毫秒级时间戳（13位）"
            value={String(currentTs.timestampMillis || "")}
            onCopy={() => copyText(currentTs.timestampMillis || "")}
          />
        </div>
      </div>

      {/* 转换区 */}
      <Tabs value={mode} onValueChange={(v) => { setMode(v as typeof mode); setResult(null); setError(""); }}>
        <TabsList>
          <TabsTrigger value="ts-to-date">时间戳 → 日期</TabsTrigger>
          <TabsTrigger value="date-to-ts">日期 → 时间戳</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex gap-2">
        <Input
          placeholder={
            mode === "ts-to-date"
              ? "输入时间戳，如 1718000000（秒）或 1718000000000（毫秒）"
              : "输入日期时间，如 2025-06-12 15:30:00"
          }
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="font-mono"
          onKeyDown={(e) => e.key === "Enter" && handleConvert()}
        />
        <Button onClick={handleConvert}>转换</Button>
      </div>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 dark:bg-red-950/20 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      {result && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {result.datetime && (
            <ClickableStat
              label="日期时间"
              value={`${result.datetime} ${result.dayOfWeek || ""}`}
              onCopy={() => copyText(result.datetime || "")}
            />
          )}
          {result.timestampSeconds && (
            <ClickableStat
              label="秒级时间戳"
              value={String(result.timestampSeconds)}
              onCopy={() => copyText(result.timestampSeconds || "")}
            />
          )}
          {result.timestampMillis && (
            <ClickableStat
              label="毫秒级时间戳"
              value={String(result.timestampMillis)}
              onCopy={() => copyText(result.timestampMillis || "")}
            />
          )}
        </div>
      )}
    </div>
  );
}

function ClickableStat({
  label,
  value,
  onCopy,
}: {
  label: string;
  value: string;
  onCopy: () => void;
}) {
  return (
    <div
      className="rounded-xl border border-border/50 bg-muted/30 p-3 cursor-pointer hover:bg-muted transition-colors group"
      onClick={onCopy}
    >
      <p className="text-[11px] text-muted-foreground mb-1">{label}</p>
      <div className="flex items-center justify-between">
        <p className="font-mono text-sm font-medium truncate">{value}</p>
        <Copy className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2" />
      </div>
    </div>
  );
}
