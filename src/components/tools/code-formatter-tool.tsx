"use client";

"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Sparkles } from "lucide-react";

type Lang = "javascript" | "typescript" | "json" | "css" | "html";

const LANG_OPTIONS: { key: Lang; label: string; parser: string }[] = [
  { key: "javascript", label: "JavaScript", parser: "babel" },
  { key: "typescript", label: "TypeScript", parser: "typescript" },
  { key: "json", label: "JSON", parser: "json" },
  { key: "css", label: "CSS", parser: "css" },
  { key: "html", label: "HTML", parser: "html" },
];

/**
 * 代码格式化工具
 * 使用 Prettier standalone 在浏览器端格式化，代码不离开浏览器
 * SQL 格式暂不支持（Prettier 无内置 SQL parser）
 */
export function CodeFormatterTool() {
  const [lang, setLang] = useState<Lang>("javascript");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const format = useCallback(async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError("");

    try {
      // 动态导入 Prettier（首次点击时加载，减少首屏体积）
      const [prettierMod, babelMod, estreeMod, tsMod, cssMod, htmlMod] = await Promise.all([
        import("prettier/standalone"),
        import("prettier/plugins/babel"),
        import("prettier/plugins/estree"),
        import("prettier/plugins/typescript"),
        import("prettier/plugins/postcss"),
        import("prettier/plugins/html"),
      ]);

      const prettier = prettierMod.default || prettierMod;
      const babel = babelMod.default || babelMod;
      const estree = estreeMod.default || estreeMod;
      const typescript = tsMod.default || tsMod;
      const postcss = cssMod.default || cssMod;
      const html = htmlMod.default || htmlMod;

      const option = LANG_OPTIONS.find((l) => l.key === lang)!;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const plugins: any[] = [];
      let parser: string;

      switch (option.parser) {
        case "babel":
          parser = "babel";
          plugins.push(babel, estree);
          break;
        case "typescript":
          parser = "typescript";
          plugins.push(typescript, estree);
          break;
        case "json":
          parser = "json";
          plugins.push(babel, estree);
          break;
        case "css":
          parser = "css";
          plugins.push(postcss);
          break;
        case "html":
          parser = "html";
          plugins.push(html);
          break;
        default:
          parser = "babel";
          plugins.push(babel, estree);
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const formatted = await (prettier as any).format(input, {
        parser,
        plugins,
        tabWidth: 2,
        semi: true,
        singleQuote: false,
        printWidth: 100,
      });

      setOutput(formatted);
    } catch (e) {
      setError(
        `格式化失败: ${e instanceof Error ? e.message : "未知错误"}。请检查代码语法是否正确。`,
      );
      setOutput("");
    } finally {
      setLoading(false);
    }
  }, [input, lang]);

  const copy = async () => {
    if (output) await navigator.clipboard.writeText(output);
  };

  return (
    <div className="space-y-4">
      {/* 语言选择 */}
      <Tabs value={lang} onValueChange={(v) => { setLang(v as Lang); setOutput(""); setError(""); }}>
        <TabsList className="flex-wrap">
          {LANG_OPTIONS.map((l) => (
            <TabsTrigger key={l.key} value={l.key} className="text-xs">
              {l.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* 输入 */}
      <div>
        <label className="text-sm font-medium mb-1.5 block">输入代码</label>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`粘贴 ${LANG_OPTIONS.find((l) => l.key === lang)?.label} 代码...`}
          rows={8}
          className="font-mono text-xs"
        />
      </div>

      {/* 格式化按钮 */}
      <Button onClick={format} disabled={loading || !input.trim()}>
        <Sparkles className="h-3.5 w-3.5 mr-1.5" />
        {loading ? "格式化中..." : "格式化"}
      </Button>

      {/* 错误 */}
      {error && (
        <p className="text-sm text-red-500 bg-red-50 dark:bg-red-950/20 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      {/* 输出 */}
      {output && (
        <div className="relative">
          <label className="text-sm font-medium mb-1.5 block">格式化结果</label>
          <div className="relative">
            <Textarea
              value={output}
              readOnly
              rows={10}
              className="font-mono text-xs pr-10"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-7 w-7"
              onClick={copy}
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
