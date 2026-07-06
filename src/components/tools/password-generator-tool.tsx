"use client";

import { useState, useCallback, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  generatePassword,
  passwordStrength,
  type PasswordOptions,
} from "@/engines/password";
import { Copy, RefreshCw } from "lucide-react";

/** 自定义拨动开关（无 shadcn/ui 依赖） */
function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
        checked ? "bg-primary" : "bg-muted-foreground/30"
      }`}
    >
      <span
        className={`pointer-events-none block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
          checked ? "translate-x-4" : "translate-x-0"
        }`}
      />
    </button>
  );
}

/** 密码生成器 —— 组件负责 UI，引擎负责逻辑 */
export function PasswordGeneratorTool() {
  const [options, setOptions] = useState<PasswordOptions>({
    length: 16,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
    excludeAmbiguous: false,
  });
  const [password, setPassword] = useState("");

  // 客户端初始化密码（SSR 时 crypto 不可用）
  useEffect(() => {
    setPassword(generatePassword(options));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [copied, setCopied] = useState(false);

  const strength = passwordStrength(password);

  /** 切换选项并重新生成 */
  const updateOption = useCallback(
    (key: keyof PasswordOptions, value: boolean | number) => {
      const next = { ...options, [key]: value };
      setOptions(next);
      setPassword(generatePassword(next));
    },
    [options],
  );

  /** 重新生成密码 */
  const regenerate = useCallback(() => {
    setPassword(generatePassword(options));
    setCopied(false);
  }, [options]);

  /** 复制到剪贴板 */
  const copyPassword = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // 降级方案：使用传统 execCommand
      const textarea = document.createElement("textarea");
      textarea.value = password;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [password]);

  const toggleOptions = [
    { key: "lowercase" as const, label: "小写字母 (a-z)" },
    { key: "uppercase" as const, label: "大写字母 (A-Z)" },
    { key: "numbers" as const, label: "数字 (0-9)" },
    { key: "symbols" as const, label: "特殊符号 (!@#$...)" },
  ];

  return (
    <div className="space-y-6">
      {/* ===== 密码展示区 ===== */}
      <div className="rounded-2xl border border-border/50 bg-muted/50 p-6 sm:p-8">
        <div
          className="relative cursor-pointer group"
          onClick={copyPassword}
          title="点击复制密码"
        >
          <p className="text-center text-2xl sm:text-3xl font-mono font-bold tracking-wider break-all select-all">
            {password}
          </p>
          <span className="absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Copy className="h-5 w-5 text-muted-foreground" />
          </span>
        </div>

        {/* 强度指示器 */}
        <div className="mt-4 flex items-center gap-3">
          <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${strength.color.replace("text", "bg")}`}
              style={{ width: `${strength.percentage}%` }}
            />
          </div>
          <span className={`text-xs font-medium ${strength.color}`}>
            {strength.label}
          </span>
        </div>

        {/* 操作按钮 */}
        <div className="mt-4 flex gap-2">
          <Button
            onClick={regenerate}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            <RefreshCw className="h-4 w-4 mr-1.5" />
            重新生成
          </Button>
          <Button onClick={copyPassword} size="sm" className="flex-1">
            <Copy className="h-4 w-4 mr-1.5" />
            {copied ? "已复制 ✓" : "复制密码"}
          </Button>
        </div>
      </div>

      {/* ===== 配置区 ===== */}
      <div className="rounded-2xl border border-border/50 bg-card p-6 space-y-5">
        {/* 长度滑块 — 使用原生 range input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label>密码长度</Label>
            <span className="text-sm font-mono font-bold text-primary">
              {options.length}
            </span>
          </div>
          <input
            type="range"
            min={4}
            max={64}
            step={1}
            value={options.length}
            onChange={(e) => updateOption("length", Number(e.target.value))}
            className="w-full h-2 rounded-full bg-muted appearance-none cursor-pointer accent-primary [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
            <span>4</span>
            <span>64</span>
          </div>
        </div>

        {/* 字符类型开关 */}
        <div className="space-y-3">
          <Label>包含字符类型</Label>
          {toggleOptions.map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between py-1">
              <span className="text-sm text-muted-foreground">{label}</span>
              <Toggle
                checked={options[key]}
                onChange={(v) => updateOption(key, v)}
              />
            </div>
          ))}
        </div>

        {/* 易混淆字符 */}
        <div className="flex items-center justify-between border-t border-border/50 pt-4">
          <div>
            <span className="text-sm font-medium">排除易混淆字符</span>
            <p className="text-xs text-muted-foreground mt-0.5">
              移除 I、l、1、O、0 等容易看错的字符
            </p>
          </div>
          <Toggle
            checked={options.excludeAmbiguous}
            onChange={(v) => updateOption("excludeAmbiguous", v)}
          />
        </div>
      </div>
    </div>
  );
}
