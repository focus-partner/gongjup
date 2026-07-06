/**
 * 个人所得税计算引擎
 *
 * 中国个税采用 7 级超额累进税率：
 * - 起征点 5000 元/月（60000 元/年）
 * - 专项附加扣除：子女教育、继续教育、大病医疗、住房贷款利息、
 *   住房租金、赡养老人、婴幼儿照护
 *
 * 年终奖可选两种计税方式：
 * - 单独计税：年终奖 ÷ 12 找对应税率，不并入综合所得
 * - 并入综合所得：与工资合并计算
 */

export interface TaxInput {
  monthlySalary: number; // 月工资收入
  yearEndBonus: number; // 年终奖
  socialInsurance: number; // 每月五险一金个人缴纳
  specialDeductions: {
    // 每月专项附加扣除
    children: number; // 子女教育（每个 2000/月）
    continuingEducation: number; // 继续教育（400/月）
    housingLoan: number; // 住房贷款利息（1000/月）
    housingRent: number; // 住房租金（800/1100/1500/月）
    elderlyCare: number; // 赡养老人（最高 3000/月）
    infantCare: number; // 婴幼儿照护（每个 2000/月）
  };
}

export interface TaxResult {
  // 综合所得（工资）
  annualTaxableIncome: number; // 年应纳税所得额
  annualTax: number; // 年个税
  monthlyTax: number; // 月个税（平均）
  effectiveRate: number; // 实际税率

  // 年终奖
  bonusTaxSeparate: number; // 单独计税个税
  bonusTaxCombined: number; // 并入综合所得个税
  recommendedMethod: "separate" | "combined"; // 推荐方式

  // 到手收入
  annualNetIncome: number; // 年税后收入
  monthlyNetIncome: number; // 月税后收入
}

/** 综合所得 7 级超额累进税率表（年度） */
const TAX_BRACKETS = [
  { limit: 36000, rate: 0.03, deduction: 0 },
  { limit: 144000, rate: 0.1, deduction: 2520 },
  { limit: 300000, rate: 0.2, deduction: 16920 },
  { limit: 420000, rate: 0.25, deduction: 31920 },
  { limit: 660000, rate: 0.3, deduction: 52920 },
  { limit: 960000, rate: 0.35, deduction: 85920 },
  { limit: Infinity, rate: 0.45, deduction: 181920 },
];

/** 年终奖单独计税税率表（月度） */
const BONUS_BRACKETS = [
  { limit: 3000, rate: 0.03, deduction: 0 },
  { limit: 12000, rate: 0.1, deduction: 210 },
  { limit: 25000, rate: 0.2, deduction: 1410 },
  { limit: 35000, rate: 0.25, deduction: 2660 },
  { limit: 55000, rate: 0.3, deduction: 4410 },
  { limit: 80000, rate: 0.35, deduction: 7160 },
  { limit: Infinity, rate: 0.45, deduction: 15160 },
];

export function calculateTax(input: TaxInput): TaxResult {
  const { monthlySalary, yearEndBonus, socialInsurance, specialDeductions } = input;

  // 月度起征点 5000
  const MONTHLY_THRESHOLD = 5000;

  // 计算每月专项附加扣除总额
  const monthlyDeductions =
    specialDeductions.children +
    specialDeductions.continuingEducation +
    specialDeductions.housingLoan +
    specialDeductions.housingRent +
    specialDeductions.elderlyCare +
    specialDeductions.infantCare;

  // 计算年度综合所得（不含年终奖）
  const annualSalary = monthlySalary * 12;
  const annualSocialInsurance = socialInsurance * 12;
  const annualThreshold = MONTHLY_THRESHOLD * 12; // 60000
  const annualDeductions = monthlyDeductions * 12;

  // 年应纳税所得额
  const annualTaxableIncome = Math.max(
    0,
    annualSalary - annualSocialInsurance - annualThreshold - annualDeductions
  );

  // 计算年度个税
  const annualTax = calcTaxFromBrackets(annualTaxableIncome, TAX_BRACKETS);

  // 年终奖单独计税
  const monthlyBonus = yearEndBonus / 12;
  const bonusBracket = findBracket(monthlyBonus, BONUS_BRACKETS);
  const bonusTaxSeparate = Math.max(
    0,
    yearEndBonus * bonusBracket.rate - bonusBracket.deduction
  );

  // 年终奖并入综合所得
  const combinedIncome = annualTaxableIncome + yearEndBonus;
  const combinedTax = calcTaxFromBrackets(combinedIncome, TAX_BRACKETS);
  const bonusTaxCombined = combinedTax - annualTax;

  // 推荐更优计税方式
  const recommendedMethod =
    bonusTaxSeparate <= bonusTaxCombined ? "separate" : "combined";

  const totalTax = annualTax + Math.min(bonusTaxSeparate, bonusTaxCombined);
  const annualNetIncome =
    annualSalary + yearEndBonus - annualSocialInsurance - totalTax;

  return {
    annualTaxableIncome: Math.round(annualTaxableIncome * 100) / 100,
    annualTax: Math.round(annualTax * 100) / 100,
    monthlyTax: Math.round((annualTax / 12) * 100) / 100,
    effectiveRate:
      annualSalary > 0
        ? Math.round((annualTax / (annualSalary - annualSocialInsurance)) * 10000) / 100
        : 0,

    bonusTaxSeparate: Math.round(bonusTaxSeparate * 100) / 100,
    bonusTaxCombined: Math.round(bonusTaxCombined * 100) / 100,
    recommendedMethod,

    annualNetIncome: Math.round(annualNetIncome * 100) / 100,
    monthlyNetIncome: Math.round((annualNetIncome / 12) * 100) / 100,
  };
}

function calcTaxFromBrackets(
  income: number,
  brackets: typeof TAX_BRACKETS
): number {
  const bracket = findBracket(income, brackets);
  return Math.max(0, income * bracket.rate - bracket.deduction);
}

function findBracket(
  value: number,
  brackets: typeof TAX_BRACKETS
): (typeof TAX_BRACKETS)[number] {
  return brackets.find((b) => value <= b.limit) ?? brackets[brackets.length - 1];
}
