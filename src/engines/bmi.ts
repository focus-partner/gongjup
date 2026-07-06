/**
 * BMI 身体质量指数计算引擎
 *
 * BMI = 体重(kg) / 身高²(m²)
 *
 * 中国标准分类：
 * - 偏瘦：BMI < 18.5
 * - 正常：18.5 ≤ BMI < 24
 * - 偏胖：24 ≤ BMI < 28
 * - 肥胖：BMI ≥ 28
 */

export type BMICategory = "underweight" | "normal" | "overweight" | "obese";

export interface BMIResult {
  bmi: number;
  category: BMICategory;
  categoryLabel: string;
  categoryColor: string; // Tailwind 颜色类名
  idealWeightMin: number; // 理想体重范围下限(kg)
  idealWeightMax: number; // 理想体重范围上限(kg)
  advice: string;
}

const CATEGORY_CONFIG: Record<
  BMICategory,
  { label: string; color: string; advice: string }
> = {
  underweight: {
    label: "偏瘦",
    color: "text-blue-500",
    advice:
      "您的体重偏低，建议适当增加营养摄入，保持均衡饮食，配合力量训练增加肌肉量。如持续偏瘦建议就医排查。",
  },
  normal: {
    label: "正常",
    color: "text-green-500",
    advice:
      "您的体重在健康范围内，请继续保持均衡饮食和规律运动，定期监测体重变化。",
  },
  overweight: {
    label: "偏胖",
    color: "text-amber-500",
    advice:
      "您的体重略高于正常范围，建议控制饮食热量摄入，增加有氧运动，每周至少 150 分钟中等强度运动。",
  },
  obese: {
    label: "肥胖",
    color: "text-red-500",
    advice:
      "您的体重已达到肥胖标准，建议咨询医生或营养师制定科学减重计划，避免心血管和代谢疾病风险。",
  },
};

export function calculateBMI(heightCm: number, weightKg: number): BMIResult {
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  const roundedBMI = Math.round(bmi * 10) / 10;

  // 判定类别
  let category: BMICategory;
  if (bmi < 18.5) category = "underweight";
  else if (bmi < 24) category = "normal";
  else if (bmi < 28) category = "overweight";
  else category = "obese";

  const config = CATEGORY_CONFIG[category];

  // 理想体重范围（BMI 18.5-24）
  const idealWeightMin = Math.round(18.5 * heightM * heightM * 10) / 10;
  const idealWeightMax = Math.round(24 * heightM * heightM * 10) / 10;

  return {
    bmi: roundedBMI,
    category,
    categoryLabel: config.label,
    categoryColor: config.color,
    idealWeightMin,
    idealWeightMax,
    advice: config.advice,
  };
}
