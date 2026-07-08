/** AA制分账计算器引擎 */

export interface BillItem { name: string; amount: number; paidBy: number } // paidBy: 付款人索引
export interface SplitResult {
  total: number;
  perPerson: number;
  personCount: number;
  settlements: { from: number; to: number; amount: number }[]; // from给to多少钱
  personTotals: { index: number; paid: number; shouldPay: number; balance: number }[];
}

export function splitBill(items: BillItem[], personCount: number): SplitResult {
  const total = items.reduce((s, i) => s + i.amount, 0);
  const perPerson = Math.round((total / personCount) * 100) / 100;

  const paid = new Array(personCount).fill(0);
  for (const item of items) paid[item.paidBy] += item.amount;

  const personTotals = [];
  for (let i = 0; i < personCount; i++) {
    const balance = Math.round((paid[i] - perPerson) * 100) / 100;
    personTotals.push({ index: i, paid: Math.round(paid[i] * 100) / 100, shouldPay: perPerson, balance });
  }

  // 计算结算方案：欠钱的给垫付的人转账
  const debtors = personTotals.filter(p => p.balance < 0).sort((a, b) => a.balance - b.balance);
  const creditors = personTotals.filter(p => p.balance > 0).sort((a, b) => b.balance - a.balance);
  const settlements: SplitResult["settlements"] = [];

  let di = 0, ci = 0;
  while (di < debtors.length && ci < creditors.length) {
    const debt = -debtors[di].balance;
    const credit = creditors[ci].balance;
    const amount = Math.round(Math.min(debt, credit) * 100) / 100;
    settlements.push({ from: debtors[di].index, to: creditors[ci].index, amount });
    debtors[di].balance += amount;
    creditors[ci].balance -= amount;
    if (Math.abs(debtors[di].balance) < 0.01) di++;
    if (Math.abs(creditors[ci].balance) < 0.01) ci++;
  }

  return { total, perPerson, personCount, settlements, personTotals };
}
