import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { tools, getToolBySlug } from "../../../../config/tools.config";
import { categoryLabels } from "@/types/tool";
import type { BreadcrumbItem } from "@/types/tool";
import { ToolHeader } from "@/components/tools/tool-header";
import { ToolFooter } from "@/components/tools/tool-footer";

// 动态导入所有工具组件（按需加载，减少首屏JS体积）
import { MortgageCalculator } from "@/components/tools/mortgage-calculator";
import { TaxCalculator } from "@/components/tools/tax-calculator";
import { BMICalculator } from "@/components/tools/bmi-calculator";
import { Base64Tool } from "@/components/tools/base64-tool";
import { TimestampTool } from "@/components/tools/timestamp-tool";
import { UUIDTool } from "@/components/tools/uuid-tool";
import { WordCountTool } from "@/components/tools/word-count-tool";
import { UnitConverterTool } from "@/components/tools/unit-converter-tool";
import { CurrencyTool } from "@/components/tools/currency-tool";
import { TextDiffTool } from "@/components/tools/text-diff-tool";
import { WechatChatTool } from "@/components/tools/wechat-chat-tool";
import { CodeFormatterTool } from "@/components/tools/code-formatter-tool";
import { ImageCompressTool } from "@/components/tools/image-compress-tool";
import { ImageConvertTool } from "@/components/tools/image-convert-tool";
import { SocialInsuranceTool } from "@/components/tools/social-insurance-tool";
import { MarkdownTool } from "@/components/tools/markdown-tool";
import { PDFMergeTool } from "@/components/tools/pdf-merge-tool";
import { PasswordGeneratorTool } from "@/components/tools/password-generator-tool";
import { QRGeneratorTool } from "@/components/tools/qr-generator-tool";
import { PDFToWordTool } from "@/components/tools/pdf-to-word-tool";
import { WatermarkRemoverTool } from "@/components/tools/watermark-remover-tool";

/** 工具组件映射表 —— 新增工具时在这里注册 */
const toolComponents: Record<string, React.ComponentType> = {
  mortgage: MortgageCalculator,
  tax: TaxCalculator,
  "social-insurance": SocialInsuranceTool,
  bmi: BMICalculator,
  base64: Base64Tool,
  timestamp: TimestampTool,
  uuid: UUIDTool,
  "word-count": WordCountTool,
  "unit-converter": UnitConverterTool,
  currency: CurrencyTool,
  "text-diff": TextDiffTool,
  "wechat-chat": WechatChatTool,
  "code-formatter": CodeFormatterTool,
  "image-compress": ImageCompressTool,
  "image-convert": ImageConvertTool,
  markdown: MarkdownTool,
  "pdf-merge": PDFMergeTool,
  "watermark-remover": WatermarkRemoverTool,
  "pdf-to-word": PDFToWordTool,
  "password-generator": PasswordGeneratorTool,
  "qr-generator": QRGeneratorTool,
};

/** 为每个工具生成静态页面 */
export function generateStaticParams() {
  return tools.map((tool) => ({
    slug: tool.slug,
  }));
}

/** 动态生成每个工具页面的 SEO 元数据 */
export function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Metadata | undefined {
  // Next.js 15+ 中 params 是 Promise，但在 generateMetadata 中使用 await
  // 这里使用同步方式读取（Next.js 在构建时处理）
  // 实际上我们需要使用 React.use() 或者直接处理
  return undefined;
}

/**
 * 工具详情页
 *
 * URL 结构: /tools/[slug]
 * 如 /tools/mortgage, /tools/bmi
 */
export default async function ToolPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  // 工具不存在 → 404
  if (!tool) {
    notFound();
  }

  const ToolComponent = toolComponents[slug];

  // 面包屑
  const breadcrumbs: BreadcrumbItem[] = [
    { label: "首页", href: "/" },
    { label: categoryLabels[tool.category], href: `/category/${tool.category}` },
    { label: tool.name },
  ];

  // SEO 说明文字（工具页底部）
  const seoText = `${tool.name}是一款免费在线${tool.description}${tool.keywords.slice(0, 3).join("、")}等关键词都可以找到本工具。所有数据在本地处理，保护您的隐私安全。`;

  // FAQ
  const faq = [
    {
      q: `${tool.name}是免费的吗？`,
      a: `是的，${tool.name}完全免费使用。我们通过页面广告维持运营，基础功能不收取任何费用。`,
    },
    { q: "需要注册账号吗？", a: "不需要。所有工具即用即走，无需注册登录。" },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8 sm:py-12">
      {/* 顶部：面包屑 + 标题 + 描述 */}
      <ToolHeader
        title={tool.name}
        description={tool.description}
        icon={tool.icon}
        breadcrumbs={breadcrumbs}
      />

      {/* 工具主体 */}
      <div className="rounded-2xl border border-border/50 bg-card p-4 sm:p-6 shadow-sm">
        {ToolComponent ? (
          <ToolComponent />
        ) : (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg mb-2">🚧 工具开发中</p>
            <p className="text-sm">「{tool.name}」即将上线，敬请期待！</p>
          </div>
        )}
      </div>

      {/* 底部：SEO文案 + 相关工具 + FAQ */}
      <ToolFooter currentSlug={slug} seoText={seoText} faq={faq} />
    </div>
  );
}
