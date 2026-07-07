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

  // ============ A2. 计算器补充 ============
  {
    slug: "age-calculator",
    name: "年龄计算器",
    description: "在线年龄计算器，输入出生日期精确计算周岁、月龄、天数，同时显示生肖和下次生日倒计时",
    category: "calculator", icon: "🎂",
    keywords: ["年龄计算器","周岁计算","出生日期计算","在线年龄查询","生肖查询","年龄计算"],
    isPopular: true,
  },
  {
    slug: "date-calculator",
    name: "日期计算器",
    description: "在线日期计算器，支持日期加减天数、两个日期相差天数和工作日计算，快速得出结果",
    category: "calculator", icon: "📅",
    keywords: ["日期计算器","日期加减","天数计算","工作日计算","日期差","日期计算在线"],
  },

  // ============ D2. 开发者工具补充 ============
  {
    slug: "encode-decode",
    name: "编解码工具",
    description: "在线URL编码解码、Base64编码解码、HTML实体编解码工具，一键转换，开发调试常用",
    category: "developer", icon: "🔣",
    keywords: ["URL编码","URL解码","Base64编码","Base64解码","HTML实体","在线编解码"],
    isNew: true,
  },
  {
    slug: "hash-generator",
    name: "哈希生成器",
    description: "在线哈希值生成工具，支持MD5/SHA-1/SHA-256/SHA-384/SHA-512算法，数据纯本地处理",
    category: "developer", icon: "🔏",
    keywords: ["MD5加密","SHA256","哈希生成","在线哈希","MD5在线","SHA1"],
    isNew: true,
  },

  // ============ E2. 生活助手补充 ============
  {
    slug: "countdown",
    name: "倒数日",
    description: "在线倒数日计时器，设置目标日期即可实时显示剩余天数、小时、分钟和秒数，支持任意事件",
    category: "life", icon: "⏳",
    keywords: ["倒数日","倒计时","计时器","在线倒计时","天数倒计时","日期倒计时"],
    isPopular: true,
  },
  {
    slug: "random-generator",
    name: "随机数生成器",
    description: "在线随机数生成工具，支持随机数、掷骰子、随机抽取（抽签），适用于抽奖、分组、决策等场景",
    category: "life", icon: "🎲",
    keywords: ["随机数生成","在线随机数","掷骰子","抽签工具","随机抽取","在线抽奖"],
  },
  {
    slug: "id-parser",
    name: "身份证号码解析",
    description: "在线身份证号码解析工具，自动识别省份、出生日期、性别和生肖，号码解析在本地浏览器完成",
    category: "life", icon: "🪪",
    keywords: ["身份证查询","身份证号码解析","身份证号验证","身份证校验","身份证信息","身份证归属地"],
    isNew: true,
  },
  {
    slug: "kinship",
    name: "亲戚称呼计算器",
    description: "中国亲戚称呼大全，选择关系路径即可查询正确称呼，春节拜年再也不怕叫错人",
    category: "life", icon: "👨‍👩‍👧‍👦",
    keywords: ["亲戚称呼","亲戚计算器","中国亲戚称呼","亲戚关系","拜年称呼","亲戚怎么叫"],
    isPopular: true,
  },

  // ============ C2. 文本工具补充 ============
  {
    slug: "chinese-converter",
    name: "简繁转换",
    description: "在线中文简繁体转换工具，支持简体转繁体、繁体转简体，包含两岸常用词汇差异对照，一键复制",
    category: "text-tools", icon: "🈶",
    keywords: ["简繁转换","简体转繁体","繁体转简体","中文转换","简繁体转换","在线简繁转换"],
    isPopular: true,
  },

  // ============ D3. 开发者工具补充2 ============
  {
    slug: "json-formatter", name: "JSON格式化", description: "在线JSON格式化、压缩和验证工具，支持语法高亮错误提示，开发者常用", category: "developer", icon: "📋",
    keywords: ["JSON格式化","JSON在线格式化","JSON压缩","JSON验证","JSON美化","JSON工具"], isPopular: true,
  },
  {
    slug: "regex-tester", name: "正则表达式测试", description: "在线正则表达式测试工具，内置常用正则模板（手机号/邮箱/URL等），实时显示匹配结果", category: "developer", icon: "🔍",
    keywords: ["正则表达式","正则测试","在线正则","regex","正则表达式在线","正则工具"], isNew: true,
  },
  {
    slug: "color-converter", name: "颜色格式转换", description: "在线颜色格式转换工具，支持HEX/RGB/HSL格式互转，实时预览颜色效果", category: "developer", icon: "🎨",
    keywords: ["颜色转换","HEX转RGB","RGB转HEX","颜色代码","色值转换","HSL转换"],
  },
  {
    slug: "color-palette", name: "颜色调色板", description: "在线调色板生成工具，选择基色自动生成10级渐变配色，点击即复制颜色代码", category: "developer", icon: "🌈",
    keywords: ["调色板","配色工具","在线配色","颜色生成","色板","颜色搭配"],
  },

  // ============ B2. 文件处理补充 ============
  {
    slug: "image-crop", name: "图片裁剪", description: "在线图片裁剪工具，上传图片设置裁剪区域即可裁剪，处理在浏览器本地完成", category: "file-processing", icon: "✂️",
    keywords: ["图片裁剪","在线裁剪","裁剪图片","图片剪切","在线图片裁剪"], isNew: true,
  },
  {
    slug: "image-resize", name: "图片尺寸调整", description: "在线图片尺寸调整工具，设置最大宽高即可缩放图片，保持比例不变形", category: "file-processing", icon: "📐",
    keywords: ["图片尺寸调整","图片缩放","在线改尺寸","图片大小调整","调整像素"],
  },
  {
    slug: "image-rotate", name: "图片旋转", description: "在线图片旋转工具，支持90°/180°/270°旋转，上传即预览，一键下载", category: "file-processing", icon: "🔄",
    keywords: ["图片旋转","在线旋转图片","旋转90度","图片翻转","图片转向"],
  },

  // ============ C3. 文本工具补充 ============
  {
    slug: "text-dedup", name: "文本去重", description: "在线文本去重工具，自动去除重复行，显示去重前后行数对比，适用于数据清洗", category: "text-tools", icon: "🧹",
    keywords: ["文本去重","去重复行","文本去重复","数据去重","在线去重","文本清洗"],
  },
  {
    slug: "pinyin", name: "汉字转拼音", description: "在线中文汉字转拼音工具，支持无声调和带数字声调两种模式，一键复制结果", category: "text-tools", icon: "🔤",
    keywords: ["汉字转拼音","中文转拼音","拼音转换","在线拼音","汉字拼音","拼音查询"], isNew: true,
  },

  // ============ E3. 生活助手补充 ============
  {
    slug: "phone-lookup", name: "手机号归属地", description: "在线手机号码归属地查询工具，识别运营商（移动/联通/电信/广电）和号段信息", category: "life", icon: "📞",
    keywords: ["手机号归属地","手机号查询","号码查询","运营商查询","手机号段","来电查询"], isPopular: true,
  },

  // ============ D4. 开发者工具补充3 ============
  {
    slug: "ip-lookup", name: "IP地址查询", description: "在线IP地址归属地查询工具，支持任意IPv4/IPv6地址查询，默认显示当前IP信息", category: "developer", icon: "🌐",
    keywords: ["IP查询","IP地址查询","我的IP","IP归属地","IP定位","公网IP"], isNew: true,
  },

  // ============ E4. 生活助手补充2 ============
  {
    slug: "loan-calculator", name: "贷款计算器", description: "通用贷款月供计算器，输入金额、年利率和期限即可计算等额本息月供和总利息", category: "calculator", icon: "🏦",
    keywords: ["贷款计算器","月供计算","等额本息","贷款利息计算","还款计算","分期计算"], isPopular: true,
  },
  {
    slug: "due-date", name: "预产期计算器", description: "在线预产期计算器，输入末次月经日期即可估算预产期和当前孕周", category: "calculator", icon: "👶",
    keywords: ["预产期计算","怀孕计算器","孕期计算","预产期查询","孕妇计算器"], isNew: true,
  },
  {
    slug: "number-cn", name: "数字转大写", description: "在线数字大小写转换工具，支持中文小写和大写（财务用）两种格式，一键复制", category: "life", icon: "🔢",
    keywords: ["数字转大写","金额大写","中文大写","财务大写","数字中文","人民币大写"], isPopular: true,
  },
  {
    slug: "fortune", name: "每日一签", description: "趣味运势抽签工具，每天抽一签看看今日运势，大吉中吉小吉随机出，分享给朋友一起玩", category: "viral", icon: "🔮",
    keywords: ["每日一签","抽签","运势","今日运势","抽签工具","在线抽签"],
  },

  // ============ B3. 文件处理补充2 ============
  {
    slug: "image-text", name: "图片添加文字", description: "在线给图片添加文字工具，可自定义文字内容、字号和颜色，适合制作表情包和水印", category: "file-processing", icon: "🖊️",
    keywords: ["图片添加文字","图片加水印","表情包制作","图片文字","添加文字到图片"],
  },
  {
    slug: "image-merge", name: "图片拼接", description: "在线图片横向拼接工具，多张图片横向排列合并为一张长图，支持任意数量图片", category: "file-processing", icon: "🖼️",
    keywords: ["图片拼接","图片合并","多图拼接","长图拼接","拼图工具"],
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
