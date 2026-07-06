"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { generateUUID, generateUUIDs } from "@/engines/uuid";
import { Copy, RefreshCw } from "lucide-react";

/** UUID 生成器 */
export function UUIDTool() {
  const [count, setCount] = useState(1);
  const [uuids, setUuids] = useState<string[]>([generateUUID()]);

  const regenerate = useCallback(() => {
    setUuids(generateUUIDs(count));
  }, [count]);

  const copyAll = async () => {
    await navigator.clipboard.writeText(uuids.join("\n"));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <label className="text-sm font-medium mb-1.5 block">生成数量</label>
          <Input
            type="number"
            min={1}
            max={100}
            value={count}
            onChange={(e) => setCount(Math.min(100, Math.max(1, Number(e.target.value) || 1)))}
            className="w-24"
          />
        </div>
        <div className="flex gap-2 mt-6">
          <Button onClick={regenerate} size="sm">
            <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
            生成
          </Button>
          <Button variant="outline" size="sm" onClick={copyAll}>
            <Copy className="h-3.5 w-3.5 mr-1.5" />
            一键复制
          </Button>
        </div>
      </div>

      <div className="space-y-1.5 font-mono text-sm">
        {uuids.map((uuid, i) => (
          <div
            key={i}
            className="flex items-center justify-between px-3 py-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors group"
          >
            <span className="text-xs select-all">{uuid}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 opacity-0 group-hover:opacity-100 shrink-0"
              onClick={() => navigator.clipboard.writeText(uuid)}
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
