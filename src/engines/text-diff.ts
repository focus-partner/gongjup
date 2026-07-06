/**
 * 文本差异对比引擎
 *
 * 基于 LCS (最长公共子序列) 算法的简单 Diff
 * 支持三种模式：文本行对比、字符对比、JSON 对比
 */

export type DiffMode = "text" | "char" | "json";

export interface DiffLine {
  type: "added" | "removed" | "unchanged";
  content: string;
  lineNumA?: number;
  lineNumB?: number;
}

/** 执行 Diff（按行模式） */
export function diffLines(textA: string, textB: string): DiffLine[] {
  const linesA = textA.split("\n");
  const linesB = textB.split("\n");
  const result: DiffLine[] = [];

  // LCS 回溯
  const lcs = computeLCS(linesA, linesB);
  let i = 0, j = 0, k = 0;

  while (i < linesA.length || j < linesB.length) {
    if (k < lcs.length && i < linesA.length && j < linesB.length && linesA[i] === lcs[k] && linesB[j] === lcs[k]) {
      result.push({ type: "unchanged", content: linesA[i], lineNumA: i + 1, lineNumB: j + 1 });
      i++; j++; k++;
    } else if (i < linesA.length && (k >= lcs.length || linesA[i] !== lcs[k])) {
      result.push({ type: "removed", content: linesA[i], lineNumA: i + 1 });
      i++;
    } else if (j < linesB.length && (k >= lcs.length || linesB[j] !== lcs[k])) {
      result.push({ type: "added", content: linesB[j], lineNumB: j + 1 });
      j++;
    }
  }

  return result;
}

/** 计算 LCS（最长公共子序列） */
function computeLCS(a: string[], b: string[]): string[] {
  const m = a.length, n = b.length;
  // 使用一维数组优化空间
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // 回溯构建 LCS
  const result: string[] = [];
  let i = m, j = n;
  while (i > 0 && j > 0) {
    if (a[i - 1] === b[j - 1]) {
      result.unshift(a[i - 1]);
      i--; j--;
    } else if (dp[i - 1][j] > dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }

  return result;
}

/** 字符级 Diff（用于短文本精确对比） */
export function diffChars(textA: string, textB: string): DiffLine[] {
  // 将字符串按字符拆分（中文按字，英文按词边界）
  const splitChars = (s: string) => s.match(/[一-鿿]|[^一-鿿]+/g) || [];
  const charsA = splitChars(textA);
  const charsB = splitChars(textB);

  // 简化的逐词对比
  return diffLines(charsA.join("\n"), charsB.join("\n"));
}

/** JSON 对比（格式化后按行 Diff） */
export function diffJSON(jsonA: string, jsonB: string): DiffLine[] {
  try {
    const objA = JSON.parse(jsonA);
    const objB = JSON.parse(jsonB);
    const formattedA = JSON.stringify(objA, null, 2);
    const formattedB = JSON.stringify(objB, null, 2);
    return diffLines(formattedA, formattedB);
  } catch {
    return [{ type: "unchanged", content: "JSON 解析失败，请检查输入格式" }];
  }
}

/** 获取 Diff 统计 */
export function getDiffStats(lines: DiffLine[]) {
  return {
    added: lines.filter((l) => l.type === "added").length,
    removed: lines.filter((l) => l.type === "removed").length,
    unchanged: lines.filter((l) => l.type === "unchanged").length,
    total: lines.length,
  };
}
