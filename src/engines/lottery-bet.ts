/** 彩票倍投计算器引擎 */

export interface LotteryBetResult {
  totalBet: number; // 总投注额
  totalReturn: number; // 总回报
  netProfit: number; // 净利润
  rounds: { round: number; betAmount: number; accumulated: number; ifWin: number; netProfit: number }[];
}

/**
 * 计算倍投方案
 * @param baseAmount 起始投注金额
 * @param odds 赔率
 * @param multiplier 倍投倍数（通常为2）
 * @param maxRounds 最大轮次
 */
export function calcChasingBet(
  baseAmount: number,
  odds: number,
  multiplier: number = 2,
  maxRounds: number = 10,
): LotteryBetResult {
  const rounds: LotteryBetResult["rounds"] = [];
  let accumulated = 0;

  for (let i = 1; i <= maxRounds; i++) {
    const betAmount = i === 1 ? baseAmount : Math.round(betAmount * multiplier * 100) / 100;
    accumulated += betAmount;
    const ifWin = Math.round(betAmount * odds * 100) / 100;
    const netProfit = Math.round((ifWin - accumulated) * 100) / 100;

    rounds.push({ round: i, betAmount, accumulated: Math.round(accumulated * 100) / 100, ifWin, netProfit });
  }

  const lastRound = rounds[rounds.length - 1];
  return { totalBet: lastRound.accumulated, totalReturn: lastRound.accumulated + lastRound.netProfit, netProfit: lastRound.netProfit, rounds };
}
