import Link from "next/link";
import { categoryLabels } from "@/types/tool";
import type { ToolCategory } from "@/types/tool";

const footerCategories: { slug: ToolCategory; label: string }[] = [
  { slug: "calculator", label: "计算器" },
  { slug: "file-processing", label: "文件处理" },
  { slug: "text-tools", label: "文本工具" },
  { slug: "developer", label: "开发者工具" },
  { slug: "life", label: "生活助手" },
];

/**
 * 全局页脚
 * - 工具分类链接
 * - 友情链接位（SEO 外链）
 * - 版权信息 + ICP备案号占位
 */
export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8">
          {/* 品牌 */}
          <div className="col-span-2 sm:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-semibold text-lg mb-2">
              <span className="text-xl">🧰</span>
              <span>工具派</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              免费在线工具集合
              <br />
              即用即走，无需下载
              <br />
              文件不上传，隐私安全
            </p>
          </div>

          {/* 分类链接 */}
          {footerCategories.map((cat) => (
            <div key={cat.slug}>
              <h4 className="font-medium text-sm mb-3">
                <Link
                  href={`/category/${cat.slug}`}
                  className="hover:text-primary transition-colors"
                >
                  {cat.label}
                </Link>
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {/* 每个分类下展示2-3个代表工具链接（SEO内链） */}
                <li>
                  <Link href={`/tools/${cat.slug}`} className="hover:text-foreground transition-colors">
                    全部{cat.label}
                  </Link>
                </li>
              </ul>
            </div>
          ))}
        </div>

        {/* 底部信息栏 */}
        <div className="mt-10 pt-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} 工具派 (gongjup.com) — 版权所有</p>
          <div className="flex items-center gap-4">
            <Link href="/blog" className="hover:text-foreground transition-colors">
              实用指南
            </Link>
            <Link href="/about" className="hover:text-foreground transition-colors">
              关于本站
            </Link>
            {/* ICP备案号 — 上线后替换为实际备案号 */}
            <span className="hidden sm:inline">京ICP备XXXXXXXX号-1</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
