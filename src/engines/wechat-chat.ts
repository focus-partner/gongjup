/**
 * 微信聊天记录生成器引擎
 * 纯数据结构，UI 负责渲染
 */

export interface WechatMessage {
  id: string;
  sender: "me" | "other";
  content: string;
  time: string;
}

export interface WechatUser {
  name: string;
  avatar: string; // 可传预设头像 ID 或 URL
}

export interface WechatChatConfig {
  myName: string;
  otherName: string;
  myAvatar: string;
  otherAvatar: string;
  messages: WechatMessage[];
  showTime: boolean; // 是否显示时间
  showHeader: boolean; // 是否显示顶部标题栏
}

/** 默认头像选项（Emoji 风格） */
export const AVATAR_OPTIONS = [
  "😀", "😎", "🤓", "🧑‍💻", "👩", "👨", "👩‍💻", "🦊",
  "🐱", "🐶", "🐼", "🐨", "🦁", "🐰", "🦄", "🐙",
  "👑", "🎩", "🤡", "👻", "💀", "🎃", "🤖", "👽",
];

/** 预设的消息模板 */
export const MESSAGE_TEMPLATES = [
  { title: "日常聊天", messages: [
    { sender: "other" as const, content: "在吗？", time: "10:30" },
    { sender: "me" as const, content: "在的，什么事？", time: "10:31" },
    { sender: "other" as const, content: "周末有空吗？一起吃饭", time: "10:32" },
    { sender: "me" as const, content: "好啊，去哪里？", time: "10:33" },
    { sender: "other" as const, content: "新开的那家火锅店怎么样", time: "10:34" },
    { sender: "me" as const, content: "可以！听说评价不错", time: "10:35" },
  ]},
  { title: "搞笑段子", messages: [
    { sender: "other" as const, content: "我今天学会了一个新技能", time: "14:20" },
    { sender: "me" as const, content: "什么技能？", time: "14:21" },
    { sender: "other" as const, content: "我学会了如何在开会的时候睁着眼睛睡觉", time: "14:22" },
    { sender: "me" as const, content: "😂😂😂 这算什么技能", time: "14:22" },
    { sender: "other" as const, content: "这样老板走到面前我就能秒醒！亲测有效", time: "14:23" },
  ]},
  { title: "情侣对话", messages: [
    { sender: "other" as const, content: "你猜我今天看到什么了", time: "18:30" },
    { sender: "me" as const, content: "看到什么了？", time: "18:31" },
    { sender: "other" as const, content: "看到一对情侣在吵架，然后女生说「你变了」", time: "18:31" },
    { sender: "me" as const, content: "然后呢？", time: "18:32" },
    { sender: "other" as const, content: "男生说「我变了是因为我更爱你了」当场和好", time: "18:32" },
    { sender: "me" as const, content: "学到了学到了 📝", time: "18:33" },
  ]},
];

/** 生成消息 ID */
let msgId = 0;
export function genMsgId(): string {
  return `msg_${++msgId}_${Date.now()}`;
}

/** 创建空聊天 */
export function createEmptyChat(): WechatChatConfig {
  msgId = 0;
  return {
    myName: "我",
    otherName: "好友",
    myAvatar: AVATAR_OPTIONS[0],
    otherAvatar: AVATAR_OPTIONS[1],
    messages: [{ id: genMsgId(), sender: "other", content: "你好！", time: "10:30" }],
    showTime: true,
    showHeader: true,
  };
}

/** 加载模板 */
export function loadTemplate(templateIndex: number, myName: string, otherName: string): WechatChatConfig {
  msgId = 0;
  const tmpl = MESSAGE_TEMPLATES[templateIndex] || MESSAGE_TEMPLATES[0];
  return {
    myName,
    otherName,
    myAvatar: AVATAR_OPTIONS[0],
    otherAvatar: AVATAR_OPTIONS[1],
    messages: tmpl.messages.map((m) => ({
      ...m,
      id: genMsgId(),
    })),
    showTime: true,
    showHeader: true,
  };
}
