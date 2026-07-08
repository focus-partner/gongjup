/** 模板生成引擎：网名、辞职信、情话、快递单 */

const namePrefixes=["暗夜","星辰","梦幻","逆天","暴走","绝世","孤傲","倾城","流浪","薄荷",
  "柠檬","草莓","棉花","彩虹","银河","北极","南极","深海的","山顶的","隔壁的","下凡的","退休的"];
const nameSuffixes=["小仙女","小哥哥","老司机","小可爱","大佬","少年","少女","侠客","公主",
  "王子","猎手","刺客","法师","战士","奶爸","程序猿","设计师","打工人","干饭人","摸鱼王","睡神"];
const nameAdjs=["爱吃","不爱","只会","精通","擅长","沉迷","恐惧"];
const nameNouns=["螺蛳粉","奶茶","火锅","代码","摸鱼","睡觉","追剧","游戏","撸猫","健身","加班","写bug"];

export function generateNickname(style: "cute"|"cool"|"funny"|"random"="random"): string {
  const s = style==="random"? ["cute","cool","funny"][Math.floor(Math.random()*3)] : style;
  const r=[()=>namePrefixes[Math.floor(Math.random()*namePrefixes.length)]+nameSuffixes[Math.floor(Math.random()*nameSuffixes.length)],
    ()=>nameAdjs[Math.floor(Math.random()*nameAdjs.length)]+nameNouns[Math.floor(Math.random()*nameNouns.length)]+"的"+nameSuffixes[Math.floor(Math.random()*nameSuffixes.length)],
    ()=>nameNouns[Math.floor(Math.random()*nameNouns.length)]+"味的"+namePrefixes[Math.floor(Math.random()*namePrefixes.length)]];
    return r[Math.floor(Math.random()*r.length)]();
}

const loveLines=["遇见你，是我这辈子最美丽的意外。","你的笑容，是我每天早起的动力。","我不擅长说情话，但我擅长想你。",
  "世间万物，都不及你眉眼间的温柔。","如果想念有声音，怕是早已震耳欲聋。","你是我写不完的诗，唱不完的歌。",
  "这辈子很短，但有你很长。","我可以戒掉奶茶，但戒不掉想你。","你的名字，是我听过最美的情话。",
  "星星有很多颗，但我只看见你这一颗。","往后余生，风雪是你，平淡是你。","你是我的今天，也是我的每一个明天。",
  "三生有幸遇见你，纵使悲凉也是情。","我不知道什么是爱情，但我知道什么是你。","想和你一起，从清晨到日暮。"];
export function generateLoveLine(): string { return loveLines[Math.floor(Math.random()*loveLines.length)]; }

const resignationReasons=["个人职业规划调整","想去看看更大的世界","身体需要休息调整","准备创业","家庭原因需要照顾",
  "想换个赛道挑战自己","通勤太远身心俱疲","找到了一份更适合的工作","准备继续深造学习","想gap一段时间"];
const thanks=["感谢领导一直以来的指导和信任","感谢团队伙伴们的支持和帮助",
  "在公司学到了很多，成长了很多","非常感谢公司给予的机会和平台","这段经历将是我宝贵的财富"];
export function generateResignation(name:string, company:string, years:number): string {
  const reason=resignationReasons[Math.floor(Math.random()*resignationReasons.length)];
  const thank=thanks[Math.floor(Math.random()*thanks.length)];
  const d=new Date(); const lastDay=new Date(d); lastDay.setDate(d.getDate()+30);
  return `尊敬的领导：

您好！

我是${company}的${name}，在公司已经工作了${years}年。经过慎重考虑，我决定辞去目前的职务，${reason}。

${thank}。

我计划在${lastDay.toLocaleDateString("zh-CN")}前完成工作交接。在离开前，我会把手头的工作整理好，确保平稳过渡。

祝公司蒸蒸日上，祝同事们工作顺利！

此致
敬礼

${name}
${d.toLocaleDateString("zh-CN")}`;
}

const expressCompanies=["顺丰速运","中通快递","圆通速递","韵达快递","申通快递","极兔速递","京东物流","EMS"];
const goods=["手机壳","衣服","零食大礼包","化妆品","数码产品","书籍","日用品","神秘礼物","文件资料","电子产品"];
export function generateExpress(orderNum:string): string {
  const company=expressCompanies[Math.floor(Math.random()*expressCompanies.length)];
  const good=goods[Math.floor(Math.random()*goods.length)];
  const status=["已揽收","运输中","到达中转站","派送中","已签收"][Math.floor(Math.random()*5)];
  const d=new Date();
  return `【${company}】订单号：${orderNum}\n\n📦 物品：${good}\n📅 下单时间：${d.toLocaleString("zh-CN")}\n🚚 当前状态：${status}\n📍 预计送达：${new Date(d.getTime()+2*86400000).toLocaleDateString("zh-CN")}\n\n—— 此快递信息由工具派模拟生成，仅供娱乐 ——`;
}
