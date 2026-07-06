/**
 * 字数统计引擎
 * 分别统计中文、英文单词、数字、标点等
 */

export interface WordCountResult {
  totalChars: number; // 总字符数（含空格）
  charsNoSpaces: number; // 字符数（不含空格）
  chineseChars: number; // 中文字符数
  englishWords: number; // 英文单词数
  numbers: number; // 数字个数
  punctuation: number; // 标点符号数
  lines: number; // 行数
  paragraphs: number; // 段落数
  readingTimeMin: number; // 中文阅读时间（分钟）
  readingTimeEn: number; // 英文阅读时间（分钟）
}

export function countWords(text: string): WordCountResult {
  if (!text.trim()) {
    return {
      totalChars: 0, charsNoSpaces: 0, chineseChars: 0,
      englishWords: 0, numbers: 0, punctuation: 0,
      lines: 0, paragraphs: 0, readingTimeMin: 0, readingTimeEn: 0,
    };
  }

  // 中文字符
  const chineseChars = (text.match(/[一-鿿㐀-䶿]/g) || []).length;

  // 英文单词（中文字符间的连续字母算作单词）
  const englishWords = (text.match(/[a-zA-Z]+/g) || []).length;

  // 数字
  const numbers = (text.match(/\d+/g) || []).length;

  // 标点符号（中英文标点）
  const punctuation = (
    text.match(/[，。！？；：""''【】《》（）—…,\.!\?;:"'\[\]{}()\-–—]/g) || []
  ).length;

  // 行与段落
  const lines = text.split("\n").length;
  const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim()).length;

  // 不含空格字符数
  const charsNoSpaces = text.replace(/\s/g, "").length;

  // 阅读时间估算（中文约 400 字/分钟，英文约 200 词/分钟）
  const readingTimeMin = Math.ceil(chineseChars / 400);
  const readingTimeEn = Math.ceil(englishWords / 200);

  return {
    totalChars: text.length,
    charsNoSpaces,
    chineseChars,
    englishWords,
    numbers,
    punctuation,
    lines,
    paragraphs: paragraphs || (text.trim() ? 1 : 0),
    readingTimeMin,
    readingTimeEn,
  };
}
