import Link from "next/link";
import { ArrowRight, Shield, Sparkles, Zap } from "lucide-react";
import { ToolGrid } from "@/components/home/tool-grid";

/**
 * 首页 —— 工具派 gongjup.com
 *
 * 设计思路：
 * 1. Hero 区：搜索为主，CTA为辅
 * 2. 信任条：隐私安全 / 完全免费 / 无需下载
 * 3. ToolGrid（客户端）：搜索 + 快速入口 + 新上线 + 热门 + 分类
 */

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* ===== Hero ===== */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-primary/5 to-transparent rounded-full blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-12 sm:pt-20 pb-8 sm:pb-12 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            发现实用
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              在线工具
            </span>
          </h1>
          <p className="mt-3 text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            50+ 款免费在线工具，涵盖计算、文件处理、文本编辑、趣味生成等场景。
            <br className="hidden sm:block" />
            无需下载安装，即用即走，隐私安全有保障。
          </p>
        </div>
      </section>

      {/* ===== 信任条 ===== */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6 rounded-2xl bg-card border border-border/50">
          <TrustItem icon={<Shield className="h-5 w-5" />} title="隐私安全" desc="文件处理全在本地浏览器完成，不上传服务器" />
          <TrustItem icon={<Sparkles className="h-5 w-5" />} title="完全免费" desc="所有工具永久免费，即用即走无需注册" />
          <TrustItem icon={<Zap className="h-5 w-5" />} title="即用即走" desc="打开网页就能用，用完就走，无需登录" />
        </div>
      </section>

      {/* ===== 工具展示（客户端搜索+交互） ===== */}
      <ToolGrid />
    </div>
  );
}

function TrustItem({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-3 p-3">
      <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary/10 text-primary shrink-0">{icon}</div>
      <div><h3 className="font-semibold text-sm">{title}</h3><p className="text-xs text-muted-foreground mt-0.5">{desc}</p></div>
    </div>
  );
}
