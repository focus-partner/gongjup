/** 数字转大写 + 预产期计算 */
const digits=["零","一","二","三","四","五","六","七","八","九"];
const units=["","十","百","千","万","十万","百万","千万","亿"];
const upperDigits=["零","壹","贰","叁","肆","伍","陆","柒","捌","玖"];
const upperUnits=["","拾","佰","仟","万","拾万","佰万","仟万","亿"];

export function numberToChinese(n: number): string {
  if(n===0) return "零"; if(n<0) return "负"+numberToChinese(-n);
  const s=String(Math.floor(n)); let result="";
  for(let i=0;i<s.length;i++){const d=parseInt(s[i]);const u=s.length-i-1;if(d!==0)result+=digits[d]+units[u];else if(s.length>1&&result[result.length-1]!=="零"&&i<s.length-1)result+="零"}
  return result.replace(/零$/,"");
}
export function numberToChineseUpper(n: number): string {
  if(n===0) return "零元整"; const s=String(Math.floor(n)); let result="";
  for(let i=0;i<s.length;i++){const d=parseInt(s[i]);const u=s.length-i-1;if(d!==0)result+=upperDigits[d]+upperUnits[u];else if(s.length>1&&result[result.length-1]!=="零"&&i<s.length-1)result+="零"}
  return result.replace(/零$/,"")+"元整";
}
export function calcDueDate(lastPeriod: Date): { date: string; weeks: number; trimester: string } {
  const due=new Date(lastPeriod); due.setDate(due.getDate()+280);
  const now=new Date(); const weeks=Math.floor((now.getTime()-lastPeriod.getTime())/604800000);
  return {date:due.toISOString().slice(0,10),weeks,trimester:weeks<=13?"孕早期":weeks<=27?"孕中期":"孕晚期"};
}
export function calcLoan(principal:number,annualRate:number,months:number): {monthly:number;total:number;totalInterest:number} {
  const mr=annualRate/100/12; const monthly=(principal*mr*Math.pow(1+mr,months))/(Math.pow(1+mr,months)-1);
  return {monthly:Math.round(monthly*100)/100,total:Math.round(monthly*months*100)/100,totalInterest:Math.round((monthly*months-principal)*100)/100};
}
