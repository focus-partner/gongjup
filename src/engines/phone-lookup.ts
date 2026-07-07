/** 手机号归属地查询引擎 */

const prefixMap: Record<string, string> = {
  "130":"联通","131":"联通","132":"联通","133":"电信","134":"移动","135":"移动","136":"移动","137":"移动","138":"移动","139":"移动",
  "145":"联通","146":"联通","147":"移动","148":"移动","149":"电信","150":"移动","151":"移动","152":"移动","153":"电信","155":"联通",
  "156":"联通","157":"移动","158":"移动","159":"移动","162":"广电","165":"移动","166":"联通","167":"联通","170":"虚拟","171":"虚拟",
  "172":"移动","173":"电信","174":"电信","175":"联通","176":"联通","177":"电信","178":"移动","180":"电信","181":"电信","182":"移动",
  "183":"移动","184":"移动","185":"联通","186":"联通","187":"移动","188":"移动","189":"电信","190":"电信","191":"电信","192":"广电",
  "193":"电信","195":"移动","196":"联通","197":"移动","198":"移动","199":"电信",
};

export function lookupPhone(phone: string): {valid:boolean; carrier:string; carrierName:string; error?:string} {
  const cleaned = phone.replace(/\s/g,"");
  if(!/^1\d{10}$/.test(cleaned)) return {valid:false,carrier:"",carrierName:"",error:"不是有效的11位手机号"};
  const prefix=cleaned.slice(0,3);
  const carrier = prefixMap[prefix] || "未知";
  const carrierNames: Record<string,string> = {移动:"中国移动",联通:"中国联通",电信:"中国电信",广电:"中国广电",虚拟:"虚拟运营商"};
  return {valid:true,carrier,carrierName:carrierNames[carrier]||carrier};
}
