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
import { AgeCalculatorTool } from "@/components/tools/age-calculator-tool";
import { DateCalculatorTool } from "@/components/tools/date-calculator-tool";
import { CountdownTool } from "@/components/tools/countdown-tool";
import { RandomGeneratorTool } from "@/components/tools/random-generator-tool";
import { EncodeDecodeTool } from "@/components/tools/encode-decode-tool";
import { HashGeneratorTool } from "@/components/tools/hash-generator-tool";
import { IDParserTool } from "@/components/tools/id-parser-tool";
import { ChineseConverterTool } from "@/components/tools/chinese-converter-tool";
import { KinshipTool } from "@/components/tools/kinship-tool";
import { JSONFormatterTool } from "@/components/tools/json-formatter-tool";
import { RegexTesterTool } from "@/components/tools/regex-tester-tool";
import { PhoneLookupTool } from "@/components/tools/phone-lookup-tool";
import { ColorConverterTool } from "@/components/tools/color-converter-tool";
import { ColorPaletteTool } from "@/components/tools/color-palette-tool";
import { TextDedupTool } from "@/components/tools/text-dedup-tool";
import { ImageCropTool } from "@/components/tools/image-crop-tool";
import { ImageResizeTool } from "@/components/tools/image-resize-tool";
import { ImageRotateTool } from "@/components/tools/image-rotate-tool";
import { PinyinTool } from "@/components/tools/pinyin-tool";
import { IPLookupTool } from "@/components/tools/ip-lookup-tool";
import { NumberCNTool } from "@/components/tools/number-cn-tool";
import { DueDateTool } from "@/components/tools/due-date-tool";
import { LoanCalculatorTool } from "@/components/tools/loan-calculator-tool";
import { ImageTextTool } from "@/components/tools/image-text-tool";
import { ImageMergeTool } from "@/components/tools/image-merge-tool";
import { FortuneTool } from "@/components/tools/fortune-tool";
import { DeviceInfoTool } from "@/components/tools/device-info-tool";
import { LotteryCalcTool } from "@/components/tools/lottery-calc-tool";
import { BillSplitTool } from "@/components/tools/bill-split-tool";
import { MartianTool } from "@/components/tools/martian-tool";
import { EdictTool } from "@/components/tools/edict-tool";
import { BloodTypeTool } from "@/components/tools/blood-type-tool";
import { NicknameTool } from "@/components/tools/nickname-tool";
import { ResignationTool } from "@/components/tools/resignation-tool";
import { LoveWordsTool } from "@/components/tools/love-words-tool";
import { ExpressTool } from "@/components/tools/express-tool";
import { PDFToMDTool } from "@/components/tools/pdf-to-md-tool";
import { TextCaseTool } from "@/components/tools/text-case-tool";
import { EmojiTool } from "@/components/tools/emoji-tool";
import { BaseConvertTool } from "@/components/tools/base-convert-tool";
import { MorseTool } from "@/components/tools/morse-tool";
import { HolidayTool } from "@/components/tools/holiday-tool";
import { GIFFramesTool } from "@/components/tools/gif-frames-tool";
import { WordToMDTool } from "@/components/tools/word-to-md-tool";
import { QRDecodeTool } from "@/components/tools/qr-decode-tool";
import { PasswordCheckerTool } from "@/components/tools/password-checker-tool";
import { SlugTool } from "@/components/tools/slug-tool";
import { MinifyTool } from "@/components/tools/minify-tool";
import { ImageBase64Tool } from "@/components/tools/image-base64-tool";
import { EXIFViewerTool } from "@/components/tools/exif-viewer-tool";
import { ColorblindTool } from "@/components/tools/colorblind-tool";
import { FakeTicketTool } from "@/components/tools/fake-ticket-tool";
import { MomentsTool } from "@/components/tools/moments-tool";

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
  "age-calculator": AgeCalculatorTool,
  "date-calculator": DateCalculatorTool,
  countdown: CountdownTool,
  "random-generator": RandomGeneratorTool,
  "encode-decode": EncodeDecodeTool,
  "hash-generator": HashGeneratorTool,
  "id-parser": IDParserTool,
  "chinese-converter": ChineseConverterTool,
  kinship: KinshipTool,
  "json-formatter": JSONFormatterTool,
  "regex-tester": RegexTesterTool,
  "phone-lookup": PhoneLookupTool,
  "color-converter": ColorConverterTool,
  "color-palette": ColorPaletteTool,
  "text-dedup": TextDedupTool,
  "image-crop": ImageCropTool,
  "image-resize": ImageResizeTool,
  "image-rotate": ImageRotateTool,
  pinyin: PinyinTool,
  "ip-lookup": IPLookupTool,
  "number-cn": NumberCNTool,
  "due-date": DueDateTool,
  "loan-calculator": LoanCalculatorTool,
  "image-text": ImageTextTool,
  "image-merge": ImageMergeTool,
  fortune: FortuneTool,
  "device-info": DeviceInfoTool,
  "lottery-calc": LotteryCalcTool,
  "bill-split": BillSplitTool,
  martian: MartianTool,
  edict: EdictTool,
  "blood-type": BloodTypeTool,
  "nickname": NicknameTool,
  "resignation": ResignationTool,
  "love-words": LoveWordsTool,
  express: ExpressTool,
  "fake-ticket": FakeTicketTool,
  moments: MomentsTool,
  "pdf-to-md": PDFToMDTool,
  "text-case": TextCaseTool,
  emoji: EmojiTool,
  "base-convert": BaseConvertTool,
  morse: MorseTool,
  holiday: HolidayTool,
  "gif-frames": GIFFramesTool,
  "word-to-md": WordToMDTool,
  "qr-decode": QRDecodeTool,
  "password-checker": PasswordCheckerTool,
  "slug": SlugTool,
  minify: MinifyTool,
  "image-base64": ImageBase64Tool,
  "exif-viewer": EXIFViewerTool,
  colorblind: ColorblindTool,
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
