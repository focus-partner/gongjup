import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "关于本站",
  description: "了解工具派的创建初衷和团队信息",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8 sm:py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> 返回首页
      </Link>

      <h1 className="text-3xl font-bold mb-6">关于工具派</h1>

      <div className="prose max-w-none text-muted-foreground space-y-4">
        <p>
          工具派是一个免费在线工具集合网站，致力于为用户提供即用即走的实用工具。
          所有工具均为纯前端或客户端处理，保护您的隐私和数据安全。
        </p>

        <h2 className="text-xl font-semibold text-foreground mt-8">我们的承诺</h2>
        <ul className="space-y-2">
          <li>🔒 <strong>隐私优先</strong> — 文件处理类工具完全在本地浏览器完成，不上传到任何服务器</li>
          <li>🆓 <strong>永久免费</strong> — 基础功能永久免费，仅高级需求提供付费选项</li>
          <li>📱 <strong>全平台适配</strong> — 支持桌面端和移动端浏览器</li>
          <li>🚫 <strong>无需注册</strong> — 打开即用，无需账号登录</li>
        </ul>

        <h2 className="text-xl font-semibold text-foreground mt-8">联系方式</h2>
        <p>
          如有任何建议或反馈，欢迎通过以下方式联系我们：
          （上线后更新联系方式）
        </p>
      </div>
    </div>
  );
}
