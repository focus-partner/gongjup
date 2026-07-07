import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ThemeProvider } from "@/components/layout/theme-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 全局 SEO 元数据 — 所有页面共享的默认值
export const metadata: Metadata = {
  title: {
    default: "工具派 — 免费在线工具，工作生活好帮手",
    template: "%s — 工具派",
  },
  description:
    "免费在线工具集合：房贷计算器、个税计算器、图片压缩、PDF合并、Base64编解码等实用工具，无需下载安装，即用即走",
  keywords: [
    "在线工具",
    "免费工具",
    "房贷计算器",
    "个税计算器",
    "图片压缩",
    "PDF合并",
    "Base64",
  ],
  authors: [{ name: "工具派" }],
  robots: { index: true, follow: true },
  verification: {
    other: {
      "baidu-site-verification": "codeva-EYPFwQ9ke0",
    },
  },
  openGraph: {
    type: "website",
    siteName: "工具派",
    title: "工具派 — 免费在线工具，工作生活好帮手",
    description: "免费在线工具集合，20+实用工具覆盖计算、文件处理、文本编辑等场景",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <TooltipProvider delay={300}>
            {/* 顶部导航 */}
            <Header />
            {/* 主内容区 */}
            <main className="flex-1">{children}</main>
            {/* 底部信息 */}
            <Footer />
            {/* Toast 通知 */}
            <Toaster richColors position="top-center" />
            {/* 百度统计 */}
            <Script id="baidu-tongji" strategy="afterInteractive">
              {`var _hmt=_hmt||[];(function(){var hm=document.createElement("script");hm.src="https://hm.baidu.com/hm.js?71700a49bee232559bdab68fdb064b83";var s=document.getElementsByTagName("script")[0];s.parentNode.insertBefore(hm,s)})()`}
            </Script>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
