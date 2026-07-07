/** 年龄计算器引擎 */
export function calculateAge(birthDate: Date): {
  years: number; months: number; days: number;
  totalMonths: number; totalDays: number; totalWeeks: number;
  nextBirthday: number; // 距下次生日天数
  zodiac: string;
} {
  const now = new Date();
  let years = now.getFullYear() - birthDate.getFullYear();
  let months = now.getMonth() - birthDate.getMonth();
  let days = now.getDate() - birthDate.getDate();

  if (days < 0) { months--; const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0); days += prevMonth.getDate(); }
  if (months < 0) { years--; months += 12; }

  const totalDays = Math.floor((now.getTime() - birthDate.getTime()) / 86400000);
  const totalWeeks = Math.floor(totalDays / 7);

  // 距下次生日
  const nextBirth = new Date(now.getFullYear(), birthDate.getMonth(), birthDate.getDate());
  if (nextBirth < now) nextBirth.setFullYear(nextBirth.getFullYear() + 1);
  const nextBirthday = Math.ceil((nextBirth.getTime() - now.getTime()) / 86400000);

  return { years, months, days, totalMonths: years * 12 + months, totalDays, totalWeeks, nextBirthday, zodiac: getZodiac(birthDate.getFullYear()) };
}

function getZodiac(year: number): string {
  const animals = ["🐭鼠", "🐮牛", "🐯虎", "🐰兔", "🐲龙", "🐍蛇", "🐴马", "🐑羊", "🐵猴", "🐔鸡", "🐶狗", "🐷猪"];
  return animals[(year - 4) % 12];
}
