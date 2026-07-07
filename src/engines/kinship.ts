/** 亲戚称呼计算器引擎 */

export interface KinshipResult { call: string; explain: string; }

// 爸爸的兄弟姐妹
const paternal: Record<string, KinshipResult> = {
  "爸爸的哥哥": { call: "伯伯/大爷", explain: "父亲的哥哥" },
  "爸爸的弟弟": { call: "叔叔", explain: "父亲的弟弟" },
  "爸爸的姐姐": { call: "姑姑/姑妈", explain: "父亲的姐姐" },
  "爸爸的妹妹": { call: "姑姑", explain: "父亲的妹妹" },
  "爸爸的哥哥的妻子": { call: "伯母/大娘", explain: "伯父的妻子" },
  "爸爸的弟弟的妻子": { call: "婶婶/婶子", explain: "叔叔的妻子" },
  "爸爸的姐妹的丈夫": { call: "姑父/姑丈", explain: "姑姑的丈夫" },
  "爸爸的爸爸": { call: "爷爷/祖父", explain: "父亲的父亲" },
  "爸爸的妈妈": { call: "奶奶/祖母", explain: "父亲的母亲" },
};

// 妈妈的兄弟姐妹
const maternal: Record<string, KinshipResult> = {
  "妈妈的哥哥": { call: "舅舅", explain: "母亲的哥哥" },
  "妈妈的弟弟": { call: "舅舅", explain: "母亲的弟弟" },
  "妈妈的姐姐": { call: "姨妈/大姨", explain: "母亲的姐姐" },
  "妈妈的妹妹": { call: "姨妈/小姨", explain: "母亲的妹妹" },
  "妈妈的哥哥的妻子": { call: "舅妈/舅母", explain: "舅舅的妻子" },
  "妈妈的弟弟的妻子": { call: "舅妈/舅母", explain: "舅舅的妻子" },
  "妈妈的姐妹的丈夫": { call: "姨父/姨丈", explain: "姨妈的丈夫" },
  "妈妈的爸爸": { call: "外公/姥爷", explain: "母亲的父亲" },
  "妈妈的妈妈": { call: "外婆/姥姥", explain: "母亲的母亲" },
};

// 同辈
const sameGen: Record<string, KinshipResult> = {
  "哥哥": { call: "哥哥", explain: "同父母的年长男性" },
  "弟弟": { call: "弟弟", explain: "同父母的年幼男性" },
  "姐姐": { call: "姐姐", explain: "同父母的年长女性" },
  "妹妹": { call: "妹妹", explain: "同父母的年幼女性" },
  "爸爸的哥哥的儿子(年长)": { call: "堂哥", explain: "伯父的儿子，比你大" },
  "爸爸的哥哥的儿子(年幼)": { call: "堂弟", explain: "伯父的儿子，比你小" },
  "爸爸的弟弟的儿子(年长)": { call: "堂哥", explain: "叔叔的儿子，比你大" },
  "爸爸的弟弟的儿子(年幼)": { call: "堂弟", explain: "叔叔的儿子，比你小" },
  "爸爸的姐妹的儿子(年长)": { call: "表哥", explain: "姑姑的儿子，比你大" },
  "爸爸的姐妹的儿子(年幼)": { call: "表弟", explain: "姑姑的儿子，比你小" },
  "妈妈的兄弟的儿子(年长)": { call: "表哥", explain: "舅舅的儿子，比你大" },
  "妈妈的兄弟的儿子(年幼)": { call: "表弟", explain: "舅舅的儿子，比你小" },
  "妈妈的姐妹的儿子(年长)": { call: "表哥", explain: "姨妈的儿子，比你大" },
  "妈妈的姐妹的儿子(年幼)": { call: "表弟", explain: "姨妈的儿子，比你小" },
};

/** 根据选中的路径返回称呼 */
export function getKinship(keys: string[]): KinshipResult | null {
  const key = keys.join("的");
  return paternal[key] || maternal[key] || sameGen[key] || null;
}

/** 查询选项列表 */
export const kinshipOptions = {
  side: ["爸爸", "妈妈"],
  parentSibling: ["哥哥", "弟弟", "姐姐", "妹妹"],
  parentSiblingSpouse: ["的妻子", "的丈夫"],
  parentParent: ["的爸爸", "的妈妈"],
  selfSibling: ["哥哥", "弟弟", "姐姐", "妹妹"],
  cousin: ["的儿子(年长)", "的儿子(年幼)", "的女儿(年长)", "的女儿(年幼)"],
};
