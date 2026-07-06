import type { BreadcrumbItem } from "@/types/tool";

/**
 * 工具页顶部区域
 * - 面包屑导航
 * - 工具标题 + 描述
 * - JSON-LD 结构化数据
 */
export function ToolHeader({
  title,
  description,
  icon,
  breadcrumbs,
}: {
  title: string;
  description: string;
  icon: string;
  breadcrumbs: BreadcrumbItem[];
}) {
  return (
    <div className="mb-8">
      {/* 面包屑 */}
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
        {breadcrumbs.map((item, i) => (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && <span className="text-muted-foreground/40">/</span>}
            {item.href ? (
              <a href={item.href} className="hover:text-foreground transition-colors">
                {item.label}
              </a>
            ) : (
              <span className="text-foreground font-medium">{item.label}</span>
            )}
          </span>
        ))}
      </nav>

      {/* 标题区 */}
      <div className="flex items-center gap-3 mb-3">
        <span className="text-3xl">{icon}</span>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{title}</h1>
      </div>
      <p className="text-muted-foreground max-w-2xl leading-relaxed">{description}</p>
    </div>
  );
}
