/** 身份证号码解析引擎 */

export interface IDInfo {
  valid: boolean; province: string; city: string; district: string;
  birthDate: string; age: number; gender: string; zodiac: string;
  error?: string;
}

// 省级代码映射（前两位）
const provinces: Record<string, string> = {
  "11":"北京","12":"天津","13":"河北","14":"山西","15":"内蒙古","21":"辽宁","22":"吉林","23":"黑龙江",
  "31":"上海","32":"江苏","33":"浙江","34":"安徽","35":"福建","36":"江西","37":"山东",
  "41":"河南","42":"湖北","43":"湖南","44":"广东","45":"广西","46":"海南",
  "50":"重庆","51":"四川","52":"贵州","53":"云南","54":"西藏",
  "61":"陕西","62":"甘肃","63":"青海","64":"宁夏","65":"新疆",
  "71":"台湾","81":"香港","82":"澳门",
};

export function parseIDNumber(id: string): IDInfo {
  const cleaned = id.trim().toUpperCase();
  if (!/^\d{17}[\dX]$/.test(cleaned)) return { valid: false, province: "", city: "", district: "", birthDate: "", age: 0, gender: "", zodiac: "", error: "格式不正确（需18位）" };

  // 校验码验证
  const weights = [7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2];
  const checkMap = "10X98765432";
  let sum = 0;
  for (let i = 0; i < 17; i++) sum += parseInt(cleaned[i]) * weights[i];
  if (checkMap[sum % 11] !== cleaned[17]) return { valid: false, province: "", city: "", district: "", birthDate: "", age: 0, gender: "", zodiac: "", error: "校验码不正确" };

  const province = provinces[cleaned.slice(0,2)] || "未知";
  const birthStr = `${cleaned.slice(6,10)}-${cleaned.slice(10,12)}-${cleaned.slice(12,14)}`;
  const birthDate = new Date(birthStr);
  const age = new Date().getFullYear() - birthDate.getFullYear();
  const gender = parseInt(cleaned[16]) % 2 === 0 ? "女" : "男";
  const zodiac = ["🐭鼠","🐮牛","🐯虎","🐰兔","🐲龙","🐍蛇","🐴马","🐑羊","🐵猴","🐔鸡","🐶狗","🐷猪"][(birthDate.getFullYear() - 4) % 12];

  return { valid: true, province, city: "", district: "", birthDate: birthStr, age, gender, zodiac };
}
