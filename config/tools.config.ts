import type { ToolConfig } from "@/types/tool";

/**
 * 工具注册表 —— 全站唯一配置源
 * 首页导航、路由生成、sitemap、搜索均从此读取
 */
export const tools: ToolConfig[] = [
  // ============ A. 计算器类 ============
  {
    slug: "mortgage",
    name: "房贷计算器",
    description:
      "免费在线房贷计算器，支持等额本息与等额本金对比，商业贷款+公积金贷款+组合贷款全覆盖，2025年最新LPR利率",
    category: "calculator",
    icon: "🏠",
    keywords: [
      "房贷计算器",
      "房贷计算器2025",
      "房贷利率计算器",
      "等额本息计算器",
      "公积金贷款计算器",
      "组合贷款计算器",
      "房贷月供计算器",
    ],
    isPopular: true,
  },
  {
    slug: "tax",
    name: "个税计算器",
    description:
      "个人所得税计算器，支持工资薪金、年终奖、劳务报酬等多种收入类型，自动优化计税方式，更新至2025年最新税率表",
    category: "calculator",
    icon: "💰",
    keywords: [
      "个税计算器",
      "个人所得税计算器",
      "个税计算器2025",
      "年终奖个税计算器",
      "工资个税计算器",
      "劳务报酬个税计算",
    ],
    isPopular: true,
  },
  {
    slug: "social-insurance",
    name: "五险一金计算器",
    description:
      "全国各城市五险一金计算器，支持300+城市，实时更新各地社保公积金缴纳比例，轻松计算到手工资",
    category: "calculator",
    icon: "📋",
    keywords: [
      "五险一金计算器",
      "社保计算器",
      "公积金计算器",
      "五险一金比例",
      "北京五险一金",
      "上海五险一金",
    ],
    isNew: true,
  },
  {
    slug: "bmi",
    name: "BMI 计算器",
    description:
      "免费 BMI 身体质量指数计算器，输入身高体重自动计算，提供健康范围参考和体重管理建议",
    category: "calculator",
    icon: "⚖️",
    keywords: [
      "BMI计算器",
      "BMI指数计算",
      "身体质量指数",
      "体重指数计算",
      "标准体重计算",
      "BMI正常范围",
    ],
  },

  // ============ B. 文件处理类 ============
  {
    slug: "watermark-remover",
    name: "去水印工具",
    description:
      "免费在线图片去水印工具，涂抹水印区域即可智能去除，支持抖音/快手/小红书等平台水印，图片处理在本地浏览器完成，隐私安全",
    category: "file-processing",
    icon: "🧹",
    keywords: [
      "去水印",
      "图片去水印",
      "在线去水印",
      "抖音去水印",
      "快手去水印",
      "小红书去水印",
      "免费去水印工具",
      "图片水印去除",
    ],
    isPopular: true,
  },
  {
    slug: "pdf-to-word",
    name: "PDF 转 Word",
    description:
      "免费在线 PDF 转 Word 工具，提取 PDF 文本并导出为可编辑的 Word 文档或纯文本，文件在本地浏览器解析，不上传服务器，保护隐私",
    category: "file-processing",
    icon: "📑",
    keywords: [
      "PDF转Word",
      "PDF转Word在线",
      "PDF提取文字",
      "PDF转docx",
      "免费PDF转Word",
      "PDF文字提取工具",
    ],
    isPopular: true,
  },
  {
    slug: "image-compress",
    name: "图片压缩",
    description:
      "在线图片压缩工具，支持 JPG/PNG/WebP/AVIF 格式，可调压缩率，文件在本地浏览器处理，不上传服务器，隐私安全",
    category: "file-processing",
    icon: "🖼️",
    keywords: [
      "图片压缩",
      "在线图片压缩",
      "JPG压缩",
      "PNG压缩",
      "图片大小压缩",
      "批量图片压缩",
      "免上传图片压缩",
    ],
    isPopular: true,
  },
  {
    slug: "image-convert",
    name: "图片格式转换",
    description:
      "在线图片格式转换工具，支持 JPG、PNG、WebP、AVIF 等格式互转，本地处理，保护隐私",
    category: "file-processing",
    icon: "🔄",
    keywords: [
      "图片格式转换",
      "PNG转JPG",
      "JPG转PNG",
      "图片转WebP",
      "在线图片转换",
      "图片格式转换器",
    ],
  },
  {
    slug: "pdf-merge",
    name: "PDF 合并",
    description:
      "免费在线 PDF 合并工具，支持多个 PDF 文件合并为一个，页面可排序删除旋转，纯本地处理不上传，保护文件隐私",
    category: "file-processing",
    icon: "📄",
    keywords: [
      "PDF合并",
      "PDF在线合并",
      "PDF文件合并",
      "免费PDF合并",
      "PDF合并工具",
      "多个PDF合并",
    ],
    isNew: true,
  },
  {
    slug: "video-to-gif",
    name: "视频转 GIF",
    description:
      "在线视频转 GIF 动图，支持 MP4/WEBM 格式，自定义帧率尺寸时长，本地处理不消耗服务器资源",
    category: "file-processing",
    icon: "🎬",
    keywords: [
      "视频转GIF",
      "MP4转GIF",
      "视频转动图",
      "在线视频转GIF",
      "免费视频转GIF",
    ],
    isNew: true,
  },

  // ============ C. 文本工具类 ============
  {
    slug: "text-diff",
    name: "文本差异对比",
    description:
      "在线文本差异对比工具，支持文本/代码/JSON 三种模式，高亮显示增删改，适合代码审查和文档对比",
    category: "text-tools",
    icon: "📝",
    keywords: [
      "文本对比",
      "文本差异",
      "在线diff",
      "代码对比",
      "JSON对比",
      "文档对比工具",
    ],
  },
  {
    slug: "markdown",
    name: "Markdown 编辑器",
    description:
      "在线 Markdown 编辑器，实时预览，支持一键导出为 PDF 或图片，适合公众号排版和文档编写",
    category: "text-tools",
    icon: "✍️",
    keywords: [
      "Markdown编辑器",
      "在线Markdown",
      "Markdown转PDF",
      "Markdown排版",
      "公众号排版工具",
      "Markdown导出图片",
    ],
  },
  {
    slug: "word-count",
    name: "字数统计",
    description:
      "在线字数统计工具，支持中文/英文/标点分别统计，显示字符数、段落数、阅读时间估算",
    category: "text-tools",
    icon: "🔢",
    keywords: ["字数统计", "字数统计在线", "中文字数统计", "英文字数统计", "字符统计"],
  },

  // ============ D. 开发者工具类 ============
  {
    slug: "base64",
    name: "Base64 编解码",
    description:
      "在线 Base64 编码解码工具，支持文本与 Base64 互转，支持 Unicode，数据完全在本地处理",
    category: "developer",
    icon: "🔐",
    keywords: [
      "Base64编码",
      "Base64解码",
      "Base64在线",
      "Base64转文本",
      "文本转Base64",
      "Base64工具",
    ],
    isPopular: true,
  },
  {
    slug: "timestamp",
    name: "时间戳转换",
    description:
      "在线时间戳转换工具，支持 Unix 时间戳与日期时间双向转换，支持秒/毫秒级别，实时显示当前时间戳",
    category: "developer",
    icon: "⏰",
    keywords: [
      "时间戳转换",
      "Unix时间戳",
      "时间戳转日期",
      "日期转时间戳",
      "在线时间戳",
      "时间戳工具",
    ],
  },
  {
    slug: "uuid",
    name: "UUID 生成器",
    description:
      "在线 UUID 生成器，支持 UUID v4 标准格式，可批量生成，一键复制，适合开发调试和测试数据生成",
    category: "developer",
    icon: "🆔",
    keywords: [
      "UUID生成器",
      "UUID在线生成",
      "GUID生成器",
      "UUID v4",
      "批量生成UUID",
    ],
  },
  {
    slug: "code-formatter",
    name: "代码格式化",
    description:
      "在线代码格式化工具，支持 JavaScript、TypeScript、CSS、HTML、JSON、SQL 等多种语言，本地运行，代码不上传",
    category: "developer",
    icon: "💻",
    keywords: [
      "代码格式化",
      "JS格式化",
      "JSON格式化",
      "HTML格式化",
      "CSS格式化",
      "在线代码格式化",
    ],
    isNew: true,
  },

  // ============ E. 生活工具类 ============
  {
    slug: "currency",
    name: "汇率换算",
    description:
      "实时汇率换算工具，支持全球 100+ 种货币，汇率数据每日更新，操作简单即用即走",
    category: "life",
    icon: "💱",
    keywords: [
      "汇率换算",
      "汇率计算器",
      "美元兑人民币",
      "日元兑人民币",
      "欧元兑人民币",
      "实时汇率",
    ],
  },
  {
    slug: "unit-converter",
    name: "单位换算",
    description:
      "全能单位换算工具，涵盖长度、重量、温度、面积、体积、速度六大类别，支持一键切换和精度调整",
    category: "life",
    icon: "📏",
    keywords: [
      "单位换算",
      "长度换算",
      "重量换算",
      "温度换算",
      "面积换算",
      "单位换算器",
    ],
  },

  // ============ F. 安全工具类 ============
  {
    slug: "qr-generator",
    name: "二维码生成器",
    description:
      "免费在线二维码生成工具，支持自定义颜色、尺寸和纠错级别，可输入网址/文本/号码等内容，一键下载高清 PNG",
    category: "developer",
    icon: "📱",
    keywords: [
      "二维码生成器",
      "二维码在线生成",
      "QR码生成",
      "网址转二维码",
      "免费二维码制作",
      "二维码下载",
    ],
    isPopular: true,
  },
  {
    slug: "password-generator",
    name: "密码生成器",
    description:
      "在线随机密码生成工具，支持自定义长度和字符类型（大小写字母/数字/符号），一键生成高强度密码，数据纯本地处理",
    category: "developer",
    icon: "🔑",
    keywords: [
      "密码生成器",
      "随机密码生成",
      "强密码生成器",
      "在线密码生成",
      "密码生成工具",
      "高强度密码",
    ],
  },

  // ============ G. 病毒传播类 ============
  {
    slug: "wechat-chat",
    name: "微信聊天记录生成器",
    description:
      "微信聊天记录模拟生成器，可自定义头像、昵称、聊天内容、时间、红包和转账，适合制作搞笑截图和情景演示",
    category: "viral",
    icon: "💬",
    keywords: [
      "微信聊天生成器",
      "微信聊天记录生成",
      "微信聊天模拟器",
      "微信截图生成器",
      "聊天记录制作工具",
    ],
  },
  {
    slug: "year-summary",
    name: "AI 年终总结生成器",
    description:
      "AI 驱动的年终总结生成器，回答几个简单问题即可生成个性化年终总结，支持导出 PDF 和 Word 格式",
    category: "viral",
    icon: "🎯",
    keywords: [
      "年终总结生成器",
      "AI年终总结",
      "年终总结模板",
      "年度总结怎么写",
      "个人年终总结",
      "年终总结AI",
    ],
  },
];

/** 按类别分组 */
export const toolsByCategory = tools.reduce(
  (acc, tool) => {
    if (!acc[tool.category]) acc[tool.category] = [];
    acc[tool.category].push(tool);
    return acc;
  },
  {} as Record<string, ToolConfig[]>,
);

/** 根据 slug 查找工具 */
export function getToolBySlug(slug: string): ToolConfig | undefined {
  return tools.find((t) => t.slug === slug);
}
