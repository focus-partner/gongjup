"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Search, Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { categoryLabels } from "@/types/tool";
import type { ToolCategory } from "@/types/tool";

// 导航栏分类快捷入口（只展示主要分类）
const navCategories: { slug: ToolCategory; label: string }[] = [
  { slug: "calculator", label: "计算器" },
  { slug: "file-processing", label: "文件处理" },
  { slug: "developer", label: "开发工具" },
  { slug: "text-tools", label: "文本工具" },
  { slug: "life", label: "生活助手" },
];

/**
 * 全局顶部导航栏
 * - Logo + 品牌名
 * - 分类快捷导航（桌面端）
 * - 搜索入口
 * - 主题切换
 * - 移动端汉堡菜单
 */
export function Header() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 glass-nav">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4 sm:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-lg shrink-0 hover:opacity-80 transition-opacity"
        >
          <span className="text-2xl">🧰</span>
          <span className="hidden sm:inline bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            工具派
          </span>
        </Link>

        {/* 桌面端分类导航 */}
        <nav className="hidden md:flex items-center gap-1 ml-2">
          {navCategories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                pathname === `/category/${cat.slug}`
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {cat.label}
            </Link>
          ))}
        </nav>

        {/* 右侧操作区 */}
        <div className="flex items-center gap-2 ml-auto">
          {/* 搜索栏（桌面端常驻） */}
          <div className="hidden sm:flex items-center">
            {searchOpen ? (
              <Input
                placeholder="搜索工具..."
                className="w-48 h-8 text-sm"
                autoFocus
                onBlur={() => setSearchOpen(false)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") setSearchOpen(false);
                }}
              />
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                onClick={() => setSearchOpen(true)}
                aria-label="搜索工具"
              >
                <Search className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* 主题切换 */}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="切换主题"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          {/* 移动端菜单 */}
          <Sheet>
            <SheetTrigger>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 md:hidden"
                aria-label="菜单"
              >
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 pt-12">
              <nav className="flex flex-col gap-2">
                <p className="text-sm font-medium text-muted-foreground mb-2 px-2">
                  工具分类
                </p>
                {navCategories.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/category/${cat.slug}`}
                    className="px-3 py-2 rounded-lg text-base font-medium hover:bg-muted transition-colors"
                  >
                    {cat.label}
                  </Link>
                ))}
                <hr className="my-4" />
                <p className="text-sm font-medium text-muted-foreground mb-2 px-2">
                  其他
                </p>
                <Link
                  href="/blog"
                  className="px-3 py-2 rounded-lg text-base hover:bg-muted transition-colors"
                >
                  📝 实用指南
                </Link>
                <Link
                  href="/about"
                  className="px-3 py-2 rounded-lg text-base hover:bg-muted transition-colors"
                >
                  ℹ️ 关于本站
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
