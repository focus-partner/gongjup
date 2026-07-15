/** 轻量工具合集：英文大小写、进制转换、摩斯电码、文本反转 */

// ===== 英文大小写 =====
export function toUpperCase(t:string):string{return t.toUpperCase()}
export function toLowerCase(t:string):string{return t.toLowerCase()}
export function toTitleCase(t:string):string{return t.replace(/\w\S*/g,w=>w.charAt(0).toUpperCase()+w.slice(1).toLowerCase())}
export function toSentenceCase(t:string):string{return t.charAt(0).toUpperCase()+t.slice(1).toLowerCase()}
export function toggleCase(t:string):string{return t.split("").map(c=>c===c.toUpperCase()?c.toLowerCase():c.toUpperCase()).join("")}

// ===== 进制转换 =====
export function convertBase(value:string,fromBase:number,toBase:number):string{
  try{const n=parseInt(value,fromBase);if(isNaN(n))return"输入格式错误";return n.toString(toBase).toUpperCase()}catch{return"转换失败"}
}

// ===== 摩斯电码 =====
const morseMap:Record<string,string>={A:".-",B:"-...",C:"-.-.",D:"-..",E:".",F:"..-.",G:"--.",H:"....",I:"..",J:".---",K:"-.-",L:".-..",M:"--",N:"-.",O:"---",P:".--.",Q:"--.-",R:".-.",S:"...",T:"-",U:"..-",V:"...-",W:".--",X:"-..-",Y:"-.--",Z:"--..","0":"-----","1":".----","2":"..---","3":"...--","4":"....-","5":".....","6":"-....","7":"--...","8":"---..","9":"----.",". ":"。"," ":"/"};
const reverseMorse:Record<string,string>={};for(const[k,v]of Object.entries(morseMap))reverseMorse[v]=k;

export function textToMorse(text:string):string{return text.toUpperCase().split("").map(c=>morseMap[c]||c).join(" ")}
export function morseToText(morse:string):string{return morse.split(" ").map(s=>reverseMorse[s]||s).join("")}

// ===== 文本反转 =====
export function reverseText(t:string):string{return t.split("").reverse().join("")}
export function reverseWords(t:string):string{return t.split(/\s+/).reverse().join(" ")}

// ===== Emoji分类数据 =====
export const emojiData:{category:string;items:{emoji:string;name:string}[]}[]=[
  {category:"😀 表情",items:[{emoji:"😀",name:"哈哈"},{emoji:"😂",name:"笑哭"},{emoji:"🤣",name:"笑趴"},{emoji:"😊",name:"微笑"},{emoji:"😍",name:"花痴"},{emoji:"😘",name:"飞吻"},{emoji:"😜",name:"鬼脸"},{emoji:"🤔",name:"思考"},{emoji:"😎",name:"墨镜酷"},{emoji:"🥳",name:"庆祝"},{emoji:"😭",name:"大哭"},{emoji:"😤",name:"生气"}]},
  {category:"❤️ 手势",items:[{emoji:"👍",name:"赞"},{emoji:"👎",name:"踩"},{emoji:"👏",name:"鼓掌"},{emoji:"🙌",name:"举手"},{emoji:"🤝",name:"握手"},{emoji:"💪",name:"肌肉"},{emoji:"✌️",name:"耶"},{emoji:"🤞",name:"好运"},{emoji:"👋",name:"挥手"},{emoji:"🖐️",name:"举手"}]},
  {category:"🎉 活动",items:[{emoji:"🎉",name:"庆祝"},{emoji:"🎂",name:"生日"},{emoji:"🎁",name:"礼物"},{emoji:"🎈",name:"气球"},{emoji:"🎊",name:"彩带"},{emoji:"🎀",name:"蝴蝶结"},{emoji:"🏆",name:"奖杯"},{emoji:"🥇",name:"金牌"},{emoji:"🎯",name:"靶心"},{emoji:"🔥",name:"火"},{emoji:"⭐",name:"星"},{emoji:"💯",name:"一百分"}]},
  {category:"🐱 动物",items:[{emoji:"🐱",name:"猫"},{emoji:"🐶",name:"狗"},{emoji:"🐰",name:"兔"},{emoji:"🐼",name:"熊猫"},{emoji:"🐨",name:"考拉"},{emoji:"🦊",name:"狐狸"},{emoji:"🐸",name:"青蛙"},{emoji:"🦄",name:"独角兽"},{emoji:"🐳",name:"鲸鱼"},{emoji:"🐝",name:"蜜蜂"}]},
  {category:"🍔 食物",items:[{emoji:"🍔",name:"汉堡"},{emoji:"🍕",name:"披萨"},{emoji:"🍣",name:"寿司"},{emoji:"🍜",name:"拉面"},{emoji:"🎂",name:"蛋糕"},{emoji:"🍦",name:"冰淇淋"},{emoji:"🍺",name:"啤酒"},{emoji:"☕",name:"咖啡"},{emoji:"🍉",name:"西瓜"},{emoji:"🍓",name:"草莓"}]},
  {category:"💻 物品",items:[{emoji:"💻",name:"电脑"},{emoji:"📱",name:"手机"},{emoji:"⌚",name:"手表"},{emoji:"📷",name:"相机"},{emoji:"💡",name:"灯泡"},{emoji:"🔑",name:"钥匙"},{emoji:"💎",name:"钻石"},{emoji:"💰",name:"钱袋"},{emoji:"📚",name:"书"},{emoji:"✏️",name:"铅笔"}]},
  {category:"🚗 交通",items:[{emoji:"🚗",name:"汽车"},{emoji:"✈️",name:"飞机"},{emoji:"🚲",name:"自行车"},{emoji:"🚢",name:"船"},{emoji:"🚀",name:"火箭"},{emoji:"🏠",name:"房子"},{emoji:"🌍",name:"地球"},{emoji:"☀️",name:"太阳"},{emoji:"🌈",name:"彩虹"},{emoji:"⚡",name:"闪电"}]},
];
