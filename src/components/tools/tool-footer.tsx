import Link from "next/link";
import { tools } from "../../../config/tools.config";
import type { ToolConfig } from "@/types/tool";

/**
 * 工具页底部区域
 * - SEO 说明文字（可折叠）
 * - 相关工具推荐
 * - 常见问题 FAQ
 */
export function ToolFooter({
  currentSlug,
  seoText,
  faq,
}: {
  currentSlug: string;
  seoText?: string;
  faq?: { q: string; a: string }[];
}) {
  // 推荐同类别其他工具（排除当前工具，最多4个）
  const currentTool = tools.find((t) => t.slug === currentSlug);
  const relatedTools = currentTool
    ? tools
        .filter((t) => t.category === currentTool.category && t.slug !== currentSlug)
        .slice(0, 4)
    : [];

  return (
    <div className="mt-12 pt-8 border-t border-border/50">
      {/* SEO 文案 */}
      {seoText && (
        <div className="mb-8">
          <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed">
            {seoText}
          </div>
        </div>
      )}

      {/* 相关工具 */}
      {relatedTools.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">相关工具</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {relatedTools.map((tool) => (
              <RelatedToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </div>
      )}

      {/* FAQ */}
      {faq && faq.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">常见问题</h3>
          <div className="space-y-3">
            {faq.map((item, i) => (
              <details
                key={i}
                className="group rounded-xl border border-border/50 bg-card overflow-hidden"
              >
                <summary className="flex items-center justify-between px-4 py-3 cursor-pointer text-sm font-medium hover:bg-muted/50 transition-colors">
                  {item.q}
                  <span className="text-muted-foreground group-open:rotate-180 transition-transform">
                    ▼
                  </span>
                </summary>
                <p className="px-4 pb-3 text-sm text-muted-foreground leading-relaxed">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/** 相关工具迷你卡片 */
function RelatedToolCard({ tool }: { tool: ToolConfig }) {
  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="flex items-center gap-2.5 p-3 rounded-xl border border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all"
    >
      <span className="text-xl">{tool.icon}</span>
      <div>
        <span className="text-sm font-medium">{tool.name}</span>
        <p className="text-[11px] text-muted-foreground line-clamp-1">
          {tool.description}
        </p>
      </div>
    </Link>
  );
}
