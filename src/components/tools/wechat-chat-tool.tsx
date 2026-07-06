"use client";

import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select } from "@/components/ui/select";
import { createEmptyChat, loadTemplate, genMsgId, AVATAR_OPTIONS, MESSAGE_TEMPLATES } from "@/engines/wechat-chat";
import type { WechatChatConfig, WechatMessage } from "@/engines/wechat-chat";
import { Plus, Trash2 } from "lucide-react";

/**
 * 微信聊天记录生成器
 * 视觉还原微信界面，支持截图导出
 */
export function WechatChatTool() {
  const [chat, setChat] = useState<WechatChatConfig>(() => createEmptyChat());
  const [newMsg, setNewMsg] = useState("");
  const [newSender, setNewSender] = useState<"me" | "other">("me");

  // 更新配置
  const update = useCallback((partial: Partial<WechatChatConfig>) => {
    setChat((prev) => ({ ...prev, ...partial }));
  }, []);

  // 添加消息
  const addMessage = useCallback(() => {
    if (!newMsg.trim()) return;
    const msg: WechatMessage = {
      id: genMsgId(),
      sender: newSender,
      content: newMsg,
      time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }),
    };
    setChat((prev) => ({ ...prev, messages: [...prev.messages, msg] }));
    setNewMsg("");
  }, [newMsg, newSender]);

  // 删除消息
  const removeMsg = (id: string) => {
    setChat((prev) => ({
      ...prev,
      messages: prev.messages.filter((m) => m.id !== id),
    }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 左侧：编辑区 */}
      <div className="space-y-4">
        {/* 模板选择 */}
        <div>
          <label className="text-sm font-medium mb-1.5 block">快捷模板</label>
          <select
            onChange={(e) => {
              const idx = Number(e.target.value);
              if (idx >= 0) setChat(loadTemplate(idx, chat.myName, chat.otherName));
            }}
            defaultValue={-1}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
          >
            <option value={-1}>自定义聊天</option>
            {MESSAGE_TEMPLATES.map((t, i) => (
              <option key={i} value={i}>{t.title}</option>
            ))}
          </select>
        </div>

        {/* 头像 + 昵称设置 */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium mb-1.5 block">我的昵称</label>
            <Input
              value={chat.myName}
              onChange={(e) => update({ myName: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">对方昵称</label>
            <Input
              value={chat.otherName}
              onChange={(e) => update({ otherName: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">我的头像</label>
            <div className="flex flex-wrap gap-1 mt-1.5">
              {AVATAR_OPTIONS.slice(0, 12).map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => update({ myAvatar: emoji })}
                  className={`text-lg w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                    chat.myAvatar === emoji ? "bg-primary/20 ring-1 ring-primary" : "hover:bg-muted"
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">对方头像</label>
            <div className="flex flex-wrap gap-1 mt-1.5">
              {AVATAR_OPTIONS.slice(0, 12).map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => update({ otherAvatar: emoji })}
                  className={`text-lg w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                    chat.otherAvatar === emoji ? "bg-primary/20 ring-1 ring-primary" : "hover:bg-muted"
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 添加消息 */}
        <div>
          <label className="text-sm font-medium mb-1.5 block">添加消息</label>
          <div className="flex gap-2 mb-2">
            <Button
              size="sm"
              variant={newSender === "me" ? "default" : "outline"}
              onClick={() => setNewSender("me")}
            >
              我
            </Button>
            <Button
              size="sm"
              variant={newSender === "other" ? "default" : "outline"}
              onClick={() => setNewSender("other")}
            >
              {chat.otherName}
            </Button>
          </div>
          <div className="flex gap-2">
            <Textarea
              value={newMsg}
              onChange={(e) => setNewMsg(e.target.value)}
              placeholder="输入消息内容..."
              rows={2}
              className="text-sm"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  addMessage();
                }
              }}
            />
            <Button onClick={addMessage} size="icon" className="shrink-0 h-auto">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* 消息列表（可删除） */}
        <div className="max-h-64 overflow-auto space-y-1">
          {chat.messages.map((msg) => (
            <div
              key={msg.id}
              className="flex items-center gap-2 text-xs py-1 px-2 rounded hover:bg-muted/50 group"
            >
              <span className="w-12 text-muted-foreground">
                {msg.sender === "me" ? chat.myName : chat.otherName}
              </span>
              <span className="flex-1 truncate">{msg.content}</span>
              <span className="text-muted-foreground shrink-0">{msg.time}</span>
              <button
                onClick={() => removeMsg(msg.id)}
                className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-600 shrink-0"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 右侧：微信模拟界面 */}
      <div className="flex flex-col items-center">
        <p className="text-xs text-muted-foreground mb-2">📱 预览效果</p>
        <WechatPreview config={chat} />
        <p className="text-[10px] text-muted-foreground mt-3 text-center">
          在手机上截图效果最佳
        </p>
      </div>
    </div>
  );
}

/** 微信聊天界面 Preview */
function WechatPreview({ config }: { config: WechatChatConfig }) {
  return (
    <div className="w-[280px] sm:w-[320px] rounded-2xl overflow-hidden border border-border/50 shadow-xl bg-[#EDEDED] dark:bg-[#111]">
      {/* 状态栏模拟 */}
      {config.showHeader && (
        <div className="bg-[#EDEDED] dark:bg-[#1a1a1a] px-3 py-2 border-b border-black/5 dark:border-white/5">
          <div className="flex items-center justify-between text-[10px] text-black/60 dark:text-white/60">
            <span>中国移动</span>
            <span>12:00</span>
            <span>100% 🔋</span>
          </div>
          <div className="flex items-center justify-center mt-1.5">
            <span className="text-sm font-medium text-black/80 dark:text-white/80">
              {config.otherName}
            </span>
          </div>
        </div>
      )}

      {/* 消息区 */}
      <div className="p-3 space-y-3 min-h-[300px] max-h-[400px] overflow-auto">
        {config.messages.map((msg) => {
          const isMe = msg.sender === "me";
          return (
            <div
              key={msg.id}
              className={`flex gap-2 ${isMe ? "flex-row-reverse" : "flex-row"}`}
            >
              {/* 头像 */}
              <div className="w-8 h-8 rounded-md bg-white dark:bg-[#2a2a2a] flex items-center justify-center text-sm shrink-0 shadow-sm">
                {isMe ? config.myAvatar : config.otherAvatar}
              </div>
              {/* 气泡 */}
              <div className="max-w-[75%]">
                <div
                  className={`relative px-3 py-2 rounded-lg text-sm leading-relaxed ${
                    isMe
                      ? "bg-[#95EC69] dark:bg-[#2B5A1E] text-black dark:text-white"
                      : "bg-white dark:bg-[#2a2a2a] text-black dark:text-white"
                  }`}
                >
                  {msg.content}
                  {/* 气泡小尾巴 */}
                  <div
                    className={`absolute top-3 w-2 h-2 rotate-45 ${
                      isMe
                        ? "-right-1 bg-[#95EC69] dark:bg-[#2B5A1E]"
                        : "-left-1 bg-white dark:bg-[#2a2a2a]"
                    }`}
                  />
                </div>
                {config.showTime && (
                  <p className={`text-[10px] text-gray-400 mt-0.5 ${isMe ? "text-right" : "text-left"}`}>
                    {msg.time}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 底部输入栏 */}
      <div className="bg-[#F7F7F7] dark:bg-[#1a1a1a] px-3 py-2 flex items-center gap-2 border-t border-black/5 dark:border-white/5">
        <span className="text-xs">✚</span>
        <span className="flex-1 text-xs text-gray-400 bg-white dark:bg-[#2a2a2a] rounded-md px-2 py-1">
          输入消息...
        </span>
        <span className="text-xs">😊</span>
      </div>
    </div>
  );
}
