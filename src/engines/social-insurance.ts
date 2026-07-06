/**
 * 五险一金计算引擎
 *
 * 中国社保体系：
 * - 养老：单位 16%，个人 8%
 * - 医疗：单位 8-10%，个人 2%
 * - 失业：单位 0.5-1%，个人 0.2-0.5%
 * - 工伤：单位 0.2-1.9%（行业差别费率），个人 0%
 * - 生育：单位 0.5-1%，个人 0%（已并入医疗）
 * - 公积金：单位和个人 5-12%
 *
 * 缴费基数：上年度月平均工资，有上下限（社平工资 60%-300%）
 */

export interface CitySocialConfig {
  city: string;
  province: string;
  // 缴费比例（%）
  pensionEmployer: number;
  pensionEmployee: number;
  medicalEmployer: number;
  medicalEmployee: number;
  unemploymentEmployer: number;
  unemploymentEmployee: number;
  injuryEmployer: number; // 工伤（按行业，取中值）
  maternityEmployer: number; // 生育
  housingFundMin: number; // 公积金最低比例
  housingFundMax: number; // 公积金最高比例
  // 缴费基数上下限
  baseMin: number; // 基数下限（月）
  baseMax: number; // 基数上限（月）
}

// 主要城市五险一金配置（2025年参考值）
export const CITY_CONFIGS: Record<string, CitySocialConfig> = {
  beijing: {
    city: "北京", province: "北京",
    pensionEmployer: 16, pensionEmployee: 8,
    medicalEmployer: 9.8, medicalEmployee: 2,
    unemploymentEmployer: 0.5, unemploymentEmployee: 0.5,
    injuryEmployer: 0.4, maternityEmployer: 0.8,
    housingFundMin: 5, housingFundMax: 12,
    baseMin: 6821, baseMax: 35283,
  },
  shanghai: {
    city: "上海", province: "上海",
    pensionEmployer: 16, pensionEmployee: 8,
    medicalEmployer: 10, medicalEmployee: 2,
    unemploymentEmployer: 0.5, unemploymentEmployee: 0.5,
    injuryEmployer: 0.4, maternityEmployer: 1,
    housingFundMin: 5, housingFundMax: 12,
    baseMin: 7384, baseMax: 36921,
  },
  shenzhen: {
    city: "深圳", province: "广东",
    pensionEmployer: 14, pensionEmployee: 8,
    medicalEmployer: 6, medicalEmployee: 2,
    unemploymentEmployer: 0.7, unemploymentEmployee: 0.3,
    injuryEmployer: 0.28, maternityEmployer: 0.5,
    housingFundMin: 5, housingFundMax: 12,
    baseMin: 3523, baseMax: 32376,
  },
  guangzhou: {
    city: "广州", province: "广东",
    pensionEmployer: 14, pensionEmployee: 8,
    medicalEmployer: 6.85, medicalEmployee: 2,
    unemploymentEmployer: 0.8, unemploymentEmployee: 0.2,
    injuryEmployer: 0.4, maternityEmployer: 0.85,
    housingFundMin: 5, housingFundMax: 12,
    baseMin: 2300, baseMax: 33786,
  },
  hangzhou: {
    city: "杭州", province: "浙江",
    pensionEmployer: 14, pensionEmployee: 8,
    medicalEmployer: 9.5, medicalEmployee: 2,
    unemploymentEmployer: 0.5, unemploymentEmployee: 0.5,
    injuryEmployer: 0.4, maternityEmployer: 0.6,
    housingFundMin: 5, housingFundMax: 12,
    baseMin: 3957, baseMax: 22311,
  },
  chengdu: {
    city: "成都", province: "四川",
    pensionEmployer: 16, pensionEmployee: 8,
    medicalEmployer: 7.75, medicalEmployee: 2,
    unemploymentEmployer: 0.6, unemploymentEmployee: 0.4,
    injuryEmployer: 0.4, maternityEmployer: 0.8,
    housingFundMin: 5, housingFundMax: 12,
    baseMin: 4246, baseMax: 21228,
  },
  wuhan: {
    city: "武汉", province: "湖北",
    pensionEmployer: 16, pensionEmployee: 8,
    medicalEmployer: 8, medicalEmployee: 2,
    unemploymentEmployer: 0.7, unemploymentEmployee: 0.3,
    injuryEmployer: 0.4, maternityEmployer: 0.7,
    housingFundMin: 5, housingFundMax: 12,
    baseMin: 4224, baseMax: 21120,
  },
  nanjing: {
    city: "南京", province: "江苏",
    pensionEmployer: 16, pensionEmployee: 8,
    medicalEmployer: 8.8, medicalEmployee: 2,
    unemploymentEmployer: 0.5, unemploymentEmployee: 0.5,
    injuryEmployer: 0.4, maternityEmployer: 0.8,
    housingFundMin: 5, housingFundMax: 12,
    baseMin: 4494, baseMax: 24042,
  },
};

export interface SocialInsuranceInput {
  cityKey: string;
  salary: number; // 税前月工资
  housingFundRate: number; // 公积金比例（5-12%）
}

export interface SocialInsuranceResult {
  salary: number; // 缴费基数（实际）
  // 个人缴纳
  personalPension: number;
  personalMedical: number;
  personalUnemployment: number;
  personalHousingFund: number;
  personalTotal: number;
  // 单位缴纳
  employerPension: number;
  employerMedical: number;
  employerUnemployment: number;
  employerInjury: number;
  employerMaternity: number;
  employerHousingFund: number;
  employerTotal: number;
  // 合计
  grandTotal: number;
  netSalary: number; // 税后工资（仅扣除五险一金，未扣个税）
}

export const CITY_LIST = Object.entries(CITY_CONFIGS).map(([key, cfg]) => ({
  key,
  city: cfg.city,
  province: cfg.province,
}));

export function calculateSocialInsurance(
  input: SocialInsuranceInput,
): SocialInsuranceResult | null {
  const config = CITY_CONFIGS[input.cityKey];
  if (!config) return null;

  // 确定缴费基数（介于上下限之间）
  const base = Math.min(config.baseMax, Math.max(config.baseMin, input.salary));

  const housingRate = Math.min(
    config.housingFundMax,
    Math.max(config.housingFundMin, input.housingFundRate),
  );

  const personalPension = base * (config.pensionEmployee / 100);
  const personalMedical = base * (config.medicalEmployee / 100);
  const personalUnemployment = base * (config.unemploymentEmployee / 100);
  const personalHousingFund = base * (housingRate / 100);
  const personalTotal =
    personalPension + personalMedical + personalUnemployment + personalHousingFund;

  const employerPension = base * (config.pensionEmployer / 100);
  const employerMedical = base * (config.medicalEmployer / 100);
  const employerUnemployment = base * (config.unemploymentEmployer / 100);
  const employerInjury = base * (config.injuryEmployer / 100);
  const employerMaternity = base * (config.maternityEmployer / 100);
  const employerHousingFund = base * (housingRate / 100);
  const employerTotal =
    employerPension +
    employerMedical +
    employerUnemployment +
    employerInjury +
    employerMaternity +
    employerHousingFund;

  const grandTotal = personalTotal + employerTotal;

  return {
    salary: base,
    personalPension: Math.round(personalPension * 100) / 100,
    personalMedical: Math.round(personalMedical * 100) / 100,
    personalUnemployment: Math.round(personalUnemployment * 100) / 100,
    personalHousingFund: Math.round(personalHousingFund * 100) / 100,
    personalTotal: Math.round(personalTotal * 100) / 100,
    employerPension: Math.round(employerPension * 100) / 100,
    employerMedical: Math.round(employerMedical * 100) / 100,
    employerUnemployment: Math.round(employerUnemployment * 100) / 100,
    employerInjury: Math.round(employerInjury * 100) / 100,
    employerMaternity: Math.round(employerMaternity * 100) / 100,
    employerHousingFund: Math.round(employerHousingFund * 100) / 100,
    employerTotal: Math.round(employerTotal * 100) / 100,
    grandTotal: Math.round(grandTotal * 100) / 100,
    netSalary: Math.round((input.salary - personalTotal) * 100) / 100,
  };
}
