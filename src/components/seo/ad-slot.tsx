/**
 * 广告位组件
 *
 * 策略：目前预留广告位，接入 AdSense 后自动展示
 * 支持三种尺寸：
 * - banner: 横向横幅（工具页顶部/底部）
 * - sidebar: 侧边栏矩形
 * - in-content: 内容中嵌入
 *
 * 使用方法：<AdSlot slot="banner" />
 *
 * 后续接入步骤：
 * 1. 注册 Google AdSense (adsense.google.com)
 * 2. 在 layout.tsx 添加 AdSense 验证代码
 * 3. 将 data-ad-client 替换为你的发布商 ID
 * 4. 删除 isPlaceholder 相关代码
 */

interface AdSlotProps {
  slot: "banner" | "sidebar" | "in-content";
  className?: string;
}

const AD_CLIENT = "ca-pub-XXXXXXXXXXXXXXXX"; // TODO: 替换为你的 AdSense 发布商 ID

const slotStyles: Record<string, { w: number; h: number; label: string }> = {
  banner: { w: 728, h: 90, label: "横幅广告 (728×90)" },
  sidebar: { w: 300, h: 250, label: "矩形广告 (300×250)" },
  "in-content": { w: 336, h: 280, label: "内容广告 (336×280)" },
};

export function AdSlot({ slot, className = "" }: AdSlotProps) {
  const { w, h, label } = slotStyles[slot];
  const isPlaceholder = AD_CLIENT.includes("XXXX"); // 未配置真实 ID 时显示占位

  if (isPlaceholder) {
    return (
      <div
        className={`mx-auto my-4 flex items-center justify-center rounded-xl border border-dashed border-border/80 bg-muted/30 text-xs text-muted-foreground ${className}`}
        style={{ maxWidth: w, height: Math.min(h, 120) }}
      >
        <span className="opacity-40">{label}</span>
      </div>
    );
  }

  return (
    <div className={`mx-auto my-4 flex justify-center overflow-hidden ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: "block", width: w, height: h }}
        data-ad-client={AD_CLIENT}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
