/**
 * 房贷计算引擎
 *
 * 支持三种贷款类型：
 * - 商业贷款（基于 LPR 浮动利率）
 * - 公积金贷款（固定利率 2.85%）
 * - 组合贷款（商业+公积金混合）
 *
 * 支持两种还款方式：
 * - 等额本息：每月还款额固定，利息占比逐月递减
 * - 等额本金：每月本金固定，利息逐月递减，前期还贷压力大
 */

export type LoanType = "commercial" | "provident" | "combined";
export type PaymentMethod = "equal-installment" | "equal-principal";

export interface MortgageInput {
  loanType: LoanType;
  paymentMethod: PaymentMethod;
  commercialAmount: number; // 商业贷款金额（万元）
  providentAmount: number; // 公积金贷款金额（万元）
  commercialRate: number; // 商业贷款利率（%）
  providentRate: number; // 公积金贷款利率（%）
  years: number; // 贷款年限
}

export interface MonthlyDetail {
  month: number;
  payment: number; // 月供
  principal: number; // 本金
  interest: number; // 利息
  remaining: number; // 剩余本金
}

export interface MortgageResult {
  totalPayment: number; // 还款总额
  totalInterest: number; // 总利息
  monthlyPayment: number; // 首月月供（等额本息则为每月固定值）
  monthlyPaymentLast: number; // 末月月供（等额本金递减）
  totalLoan: number; // 贷款总额
  schedule: MonthlyDetail[]; // 每月明细
}

/** 计算月供 */
export function calculateMortgage(input: MortgageInput): MortgageResult {
  const {
    paymentMethod,
    commercialAmount,
    providentAmount,
    commercialRate,
    providentRate,
    years,
  } = input;

  // 转换为元
  const commercialLoan = commercialAmount * 10000;
  const providentLoan = providentAmount * 10000;
  const totalLoan = commercialLoan + providentLoan;

  const months = years * 12;

  // 月利率
  const commercialMonthlyRate = commercialRate / 100 / 12;
  const providentMonthlyRate = providentRate / 100 / 12;

  if (paymentMethod === "equal-installment") {
    return calcEqualInstallment(
      commercialLoan,
      providentLoan,
      commercialMonthlyRate,
      providentMonthlyRate,
      months,
      totalLoan
    );
  } else {
    return calcEqualPrincipal(
      commercialLoan,
      providentLoan,
      commercialMonthlyRate,
      providentMonthlyRate,
      months,
      totalLoan
    );
  }
}

/** 等额本息计算 */
function calcEqualInstallment(
  commercialLoan: number,
  providentLoan: number,
  cr: number,
  pr: number,
  months: number,
  totalLoan: number
): MortgageResult {
  // 分别计算商业和公积金的月供，然后相加
  const commercialPayment = calcAnnuity(commercialLoan, cr, months);
  const providentPayment = calcAnnuity(providentLoan, pr, months);

  const monthlyPayment =
    (commercialPayment || 0) + (providentPayment || 0);

  const schedule: MonthlyDetail[] = [];
  let remainingCommercial = commercialLoan;
  let remainingProvident = providentLoan;
  let totalPayment = 0;

  for (let i = 1; i <= months; i++) {
    const commercialInterest = remainingCommercial * cr;
    const providentInterest = remainingProvident * pr;
    const totalInterest = commercialInterest + providentInterest;

    const totalPrincipal = monthlyPayment - totalInterest;

    // 按比例分配本金到商业和公积金
    const ratio =
      remainingCommercial + remainingProvident > 0
        ? remainingCommercial / (remainingCommercial + remainingProvident)
        : 0;

    const commercialPrincipal = totalPrincipal * ratio;
    const providentPrincipal = totalPrincipal * (1 - ratio);

    remainingCommercial = Math.max(0, remainingCommercial - commercialPrincipal);
    remainingProvident = Math.max(0, remainingProvident - providentPrincipal);

    totalPayment += monthlyPayment;

    schedule.push({
      month: i,
      payment: Math.round(monthlyPayment * 100) / 100,
      principal: Math.round(totalPrincipal * 100) / 100,
      interest: Math.round(totalInterest * 100) / 100,
      remaining: Math.round((remainingCommercial + remainingProvident) * 100) / 100,
    });
  }

  return {
    totalPayment: Math.round(totalPayment * 100) / 100,
    totalInterest: Math.round((totalPayment - totalLoan) * 100) / 100,
    monthlyPayment: Math.round(monthlyPayment * 100) / 100,
    monthlyPaymentLast: Math.round(monthlyPayment * 100) / 100,
    totalLoan,
    schedule,
  };
}

/** 等额本金计算 */
function calcEqualPrincipal(
  commercialLoan: number,
  providentLoan: number,
  cr: number,
  pr: number,
  months: number,
  totalLoan: number
): MortgageResult {
  const commercialMonthlyPrincipal = commercialLoan / months;
  const providentMonthlyPrincipal = providentLoan / months;
  const totalMonthlyPrincipal =
    commercialMonthlyPrincipal + providentMonthlyPrincipal;

  const schedule: MonthlyDetail[] = [];
  let remainingCommercial = commercialLoan;
  let remainingProvident = providentLoan;
  let totalPayment = 0;

  for (let i = 1; i <= months; i++) {
    const commercialInterest = remainingCommercial * cr;
    const providentInterest = remainingProvident * pr;
    const totalInterest = commercialInterest + providentInterest;

    const monthlyPayment = totalMonthlyPrincipal + totalInterest;

    remainingCommercial = Math.max(0, remainingCommercial - commercialMonthlyPrincipal);
    remainingProvident = Math.max(0, remainingProvident - providentMonthlyPrincipal);

    totalPayment += monthlyPayment;

    schedule.push({
      month: i,
      payment: Math.round(monthlyPayment * 100) / 100,
      principal: Math.round(totalMonthlyPrincipal * 100) / 100,
      interest: Math.round(totalInterest * 100) / 100,
      remaining: Math.round((remainingCommercial + remainingProvident) * 100) / 100,
    });
  }

  const lastIdx = schedule.length - 1;
  return {
    totalPayment: Math.round(totalPayment * 100) / 100,
    totalInterest: Math.round((totalPayment - totalLoan) * 100) / 100,
    monthlyPayment: Math.round(schedule[0].payment * 100) / 100,
    monthlyPaymentLast: Math.round(schedule[lastIdx].payment * 100) / 100,
    totalLoan,
    schedule,
  };
}

/** 等额本息公式：M = P * r * (1+r)^n / ((1+r)^n - 1) */
function calcAnnuity(
  principal: number,
  monthlyRate: number,
  months: number
): number {
  if (principal === 0 || monthlyRate === 0) return 0;
  const pow = Math.pow(1 + monthlyRate, months);
  return (principal * monthlyRate * pow) / (pow - 1);
}
