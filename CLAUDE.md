# 工具派 (gongjup.com) — 中国的 TinyWow

## 🎯 产品定位
做"中国的 TinyWow"——一个现代设计、免费优先、隐私安全的在线工具集合。
参考对象：TinyWow（海外，月访问 2000 万+）、ILovePDF、Tool.lu

**核心差异**：国内工具站 99% 长得像 2010 年的产物。我们的壁垒不是技术，是审美和产品体验。

## 🎨 设计铁律（TinyWow 级别标准）

### 配色
- 主色：蓝靛系 `--primary: oklch(0.48 0.18 262)` — 专业、可信赖
- 背景：暖白 `oklch(0.985 0.005 95)` — 不是惨白，有温度
- 卡片：纯白 + 微阴影 — 干净、层次分明
- 暗色模式：必须支持，自动跟随系统

### 间距和排版
- 所有间距为 4 的倍数：8px / 12px / 16px / 24px / 32px
- 容器内边距：p-6 (24px) 或 p-8 (32px)
- 圆角统一：rounded-2xl (16px) 用于卡片，rounded-xl (12px) 用于输入框
- 字体：Geist Sans，标题 tracking-tight

### 组件标准
- 输入框：border + focus:ring-2 + focus:border-primary，过渡动画 200ms
- 按钮：rounded-xl + px-4 py-2 + transition-all + hover:shadow-md
- 卡片：bg-card + border border-border/50 + rounded-2xl + shadow-sm
- 工具结果区：大数字用 text-5xl font-bold，单位用 text-sm text-muted-foreground

### 移动端优先
- 所有工具页面必须在 375px 宽度下完美显示
- 表单元素宽度 ≥ 44px（iOS 可点击最小尺寸）
- 卡片在移动端变为单列布局

## 🏗️ 工程铁律

### 修改协议（强制执行）
任何修改代码前，必须先输出：
```
【改动清单】文件 + 修改点 + 原因
【波及分析】直接影响的功能、可能受影响的数据流
【验证要点】操作 → 预期结果
```
人工回复"批准"后才能开始写代码。

### 工具开发规范
- 业务逻辑放在 `src/engines/[tool-name].ts`，纯函数，可测试
- UI 组件放在 `src/components/tools/[tool-name]-tool.tsx`，客户端组件
- 注册：在 `config/tools.config.ts` 添加工具元数据
- 路由：在 `src/app/tools/[slug]/page.tsx` 的 `toolComponents` 中注册
- 每个工具必须支持暗色模式
- 所有文案使用中文

### 隐私优先原则
- 能在浏览器本地处理的，绝不传服务器
- 图片/文件处理使用 Canvas API / Web Workers
- 如需上传（现阶段尽量避免），必须明确告知用户并展示上传进度

### SEO 要求
- 每个工具页：独立 title + description + FAQ + 结构化数据
- 关键词覆盖：工具名 + "在线" + "免费" + 核心动词
- 新工具上线后同步更新 sitemap

## 📦 技术栈
- Next.js 16 + React 19 + TypeScript
- Tailwind CSS 4 + shadcn/ui
- Drizzle ORM + SQLite（仅博客/AI内容）
- 部署：Vercel（推荐）或 Docker + Nginx

## 🔑 环境变量
- `SITE_URL`：网站完整 URL（用于 sitemap 和百度推送）
- `BAIDU_PUSH_TOKEN`：百度站长平台 token
- `INDEXNOW_KEY`：Bing IndexNow key
- `DATABASE_URL`：SQLite 数据库路径
