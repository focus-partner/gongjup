"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { encodeBase64, decodeBase64 } from "@/engines/base64";
import { Copy, ArrowRightLeft } from "lucide-react";

/** Base64 编解码工具 */
export function Base64Tool() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const handleConvert = () => {
    setError("");
    const res = mode === "encode" ? encodeBase64(input) : decodeBase64(input);
    if (res.success) {
      setOutput(res.result);
    } else {
      setOutput("");
      setError(res.error || "转换失败");
    }
  };

  const handleSwap = () => {
    setMode(mode === "encode" ? "decode" : "encode");
    setInput(output);
    setOutput("");
    setError("");
  };

  const copyOutput = async () => {
    if (output) {
      await navigator.clipboard.writeText(output);
    }
  };

  return (
    <div className="space-y-4">
      {/* 模式切换 */}
      <Tabs value={mode} onValueChange={(v) => { setMode(v as "encode" | "decode"); setOutput(""); setError(""); }}>
        <TabsList>
          <TabsTrigger value="encode">文本 → Base64 编码</TabsTrigger>
          <TabsTrigger value="decode">Base64 → 文本解码</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* 输入 */}
      <div>
        <label className="text-sm font-medium mb-1.5 block">
          {mode === "encode" ? "输入文本" : "输入 Base64"}
        </label>
        <Textarea
          placeholder={
            mode === "encode"
              ? "输入要编码的文本（支持中文、Emoji 等）..."
              : "粘贴 Base64 编码内容..."
          }
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={5}
          className="font-mono text-sm"
        />
      </div>

      {/* 操作按钮 */}
      <div className="flex items-center gap-2">
        <Button onClick={handleConvert} size="sm">
          {mode === "encode" ? "编码" : "解码"}
        </Button>
        <Button variant="outline" size="sm" onClick={handleSwap}>
          <ArrowRightLeft className="h-3.5 w-3.5 mr-1" />
          交换
        </Button>
      </div>

      {/* 错误 */}
      {error && (
        <p className="text-sm text-red-500 bg-red-50 dark:bg-red-950/20 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      {/* 输出 */}
      {output && (
        <div className="relative">
          <label className="text-sm font-medium mb-1.5 block">结果</label>
          <div className="relative">
            <Textarea
              value={output}
              readOnly
              rows={5}
              className="font-mono text-sm pr-10"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-7 w-7"
              onClick={copyOutput}
              title="复制"
            >
              <Copy className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
