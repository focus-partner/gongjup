/**
 * 密码生成器引擎
 * —— 纯函数，客户端零依赖
 */

export interface PasswordOptions {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
  excludeAmbiguous: boolean; // 排除易混淆字符（I/l/1/O/0）
}

const CHAR_SETS = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
};

const AMBIGUOUS: Record<string, string> = {
  uppercase: "IO",
  lowercase: "l",
  numbers: "01",
  symbols: "",
};

/**
 * 生成随机密码
 */
export function generatePassword(opts: PasswordOptions): string {
  // 1. 构建字符池
  let pool = "";
  const selectedTypes = ["lowercase", "uppercase", "numbers", "symbols"].filter(
    (type) => opts[type as keyof PasswordOptions]
  );

  // 如果没有选中任何类型，默认使用小写字母
  if (selectedTypes.length === 0) {
    pool = CHAR_SETS.lowercase;
  } else {
    for (const type of selectedTypes) {
      pool += CHAR_SETS[type as keyof typeof CHAR_SETS];
    }
  }

  // 2. 移除易混淆字符
  if (opts.excludeAmbiguous) {
    for (const type of selectedTypes) {
      const ambiguous = AMBIGUOUS[type] || "";
      for (const ch of ambiguous) {
        pool = pool.replaceAll(ch, "");
      }
    }
  }

  if (pool.length === 0) {
    pool = CHAR_SETS.lowercase;
  }

  // 3. 使用 crypto API 生成密码（比 Math.random 更安全）
  // SSR 兼容：服务端渲染时降级为 Math.random
  const array = new Uint32Array(opts.length);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(array);
  } else {
    // 服务端降级方案
    for (let i = 0; i < opts.length; i++) {
      array[i] = Math.floor(Math.random() * 4294967296);
    }
  }

  let password = "";
  for (let i = 0; i < opts.length; i++) {
    password += pool[array[i] % pool.length];
  }

  // 4. 确保每种选中类型至少包含一个字符
  return ensureMinimumRequirements(password, opts, selectedTypes, pool);
}

/**
 * 确保生成的密码包含所有要求类型的字符
 * 如果不包含，替换首尾字符直到满足
 */
function ensureMinimumRequirements(
  password: string,
  opts: PasswordOptions,
  selectedTypes: string[],
  pool: string,
): string {
  const chars = password.split("");
  const array = new Uint32Array(4);
  crypto.getRandomValues(array);

  for (const type of selectedTypes) {
    const typeChars =
      CHAR_SETS[type as keyof typeof CHAR_SETS];
    if (!typeChars) continue;

    // 检查是否已有该类型字符
    const hasType = chars.some((c) => typeChars.includes(c));
    if (!hasType) {
      // 随机替换一个位置
      const pos = array[selectedTypes.indexOf(type)] % chars.length;
      const filtered =
        opts.excludeAmbiguous
          ? typeChars
              .split("")
              .filter((c) => !(AMBIGUOUS[type] || "").includes(c))
              .join("")
          : typeChars;
      if (filtered.length > 0) {
        chars[pos] = filtered[array[type.length % 4] % filtered.length];
      }
    }
  }

  return chars.join("");
}

/**
 * 评估密码强度
 * 返回 0-4 的评分和对应的中文标签
 */
export function passwordStrength(password: string): {
  score: number; // 0-4
  label: string;
  color: string; // Tailwind 颜色类名
  percentage: number; // 0-100
} {
  if (!password) return { score: 0, label: "无", color: "text-muted-foreground", percentage: 0 };

  let score = 0;

  // 长度评分
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (password.length >= 16) score++;

  // 复杂度评分
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  // 归一化到 0-4
  const normalized = Math.min(4, Math.floor(score / 1.5));

  const levels = [
    { label: "弱", color: "text-red-500", percentage: 25 },
    { label: "一般", color: "text-amber-500", percentage: 50 },
    { label: "强", color: "text-green-500", percentage: 75 },
    { label: "非常强", color: "text-emerald-500", percentage: 100 },
  ];

  return { ...levels[normalized], score: normalized + 1 };
}
