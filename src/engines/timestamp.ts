/**
 * 时间戳转换引擎
 *
 * 支持：
 * - Unix 时间戳（秒级 10 位 / 毫秒级 13 位）
 * - 日期时间字符串互相转换
 * - 实时当前时间戳
 */

export interface TimestampResult {
  success: boolean;
  datetime?: string; // YYYY-MM-DD HH:mm:ss
  timestampSeconds?: number; // 10 位秒级时间戳
  timestampMillis?: number; // 13 位毫秒级时间戳
  dayOfWeek?: string; // 星期几（中文）
  error?: string;
}

const WEEKDAYS = [
  "星期日",
  "星期一",
  "星期二",
  "星期三",
  "星期四",
  "星期五",
  "星期六",
];

/** 时间戳 → 日期时间 */
export function timestampToDate(input: string): TimestampResult {
  try {
    const trimmed = input.trim();
    if (!trimmed) {
      return { success: false, error: "请输入时间戳" };
    }

    let ts = parseInt(trimmed, 10);
    if (isNaN(ts)) {
      return { success: false, error: "时间戳格式不正确，请输入纯数字" };
    }

    // 自动识别秒级（10位）还是毫秒级（13位）
    if (trimmed.length <= 10) {
      ts = ts * 1000;
    }

    const date = new Date(ts);
    if (isNaN(date.getTime())) {
      return { success: false, error: "无法解析此时间戳" };
    }

    return formatDateResult(date);
  } catch (e) {
    return {
      success: false,
      error: `转换失败: ${e instanceof Error ? e.message : "未知错误"}`,
    };
  }
}

/** 日期时间 → 时间戳 */
export function dateToTimestamp(datetime: string): TimestampResult {
  try {
    const trimmed = datetime.trim();
    if (!trimmed) {
      return { success: false, error: "请输入日期时间" };
    }

    // 支持多种格式
    const date = new Date(trimmed.replace(/\//g, "-"));
    if (isNaN(date.getTime())) {
      return {
        success: false,
        error: "日期格式不正确，请使用 YYYY-MM-DD HH:mm:ss 格式",
      };
    }

    return formatDateResult(date);
  } catch (e) {
    return {
      success: false,
      error: `转换失败: ${e instanceof Error ? e.message : "未知错误"}`,
    };
  }
}

/** 获取当前时间戳 */
export function getCurrentTimestamp(): TimestampResult {
  return formatDateResult(new Date());
}

function formatDateResult(date: Date): TimestampResult {
  const pad = (n: number) => String(n).padStart(2, "0");

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  return {
    success: true,
    datetime: `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`,
    timestampSeconds: Math.floor(date.getTime() / 1000),
    timestampMillis: date.getTime(),
    dayOfWeek: WEEKDAYS[date.getDay()],
  };
}
