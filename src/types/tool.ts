/** 工具类别 */
export type ToolCategory =
  | "calculator"
  | "file-processing"
  | "text-tools"
  | "developer"
  | "life"
  | "viral";

/** 工具类别中文名 */
export const categoryLabels: Record<ToolCategory, string> = {
  calculator: "计算器",
  "file-processing": "文件处理",
  "text-tools": "文本工具",
  developer: "开发者工具",
  life: "生活助手",
  viral: "趣味工具",
};

/** 类别描述（用于 SEO） */
export const categoryDescriptions: Record<ToolCategory, string> = {
  calculator:
    "免费在线计算器，房贷计算、个税计算、五险一金计算，数据准确更新及时",
  "file-processing": "在线文件处理工具，无需下载安装，隐私安全不上传服务器",
  "text-tools": "文本处理工具集合，差异对比、Markdown 编辑排版、字数统计",
  developer: "开发者常用工具，Base64编解码、时间戳转换、代码格式化",
  life: "日常生活实用工具，汇率换算、单位转换、BMI计算",
  viral: "创意趣味工具，轻松制作微信聊天截图、AI生成年终总结",
};

/** 工具配置 */
export interface ToolConfig {
  slug: string;
  name: string;
  description: string;
  category: ToolCategory;
  icon: string; // Emoji 图标
  keywords: string[]; // 目标 SEO 关键词
  isNew?: boolean;
  isPopular?: boolean;
  component?: string; // 懒加载组件名
}

/** 面包屑 */
export interface BreadcrumbItem {
  label: string;
  href?: string;
}
