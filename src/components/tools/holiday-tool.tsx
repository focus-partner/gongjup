"use client";
const holidays2026=[
  {d:"2026-01-01",n:"元旦",t:"法定假日"}, {d:"2026-01-28",n:"除夕",t:"法定假日"}, {d:"2026-01-29",n:"春节",t:"法定假日"},
  {d:"2026-02-12",n:"元宵节",t:"传统节日"}, {d:"2026-04-04",n:"清明节",t:"法定假日"}, {d:"2026-05-01",n:"劳动节",t:"法定假日"},
  {d:"2026-05-31",n:"端午节",t:"法定假日"}, {d:"2026-08-19",n:"七夕",t:"传统节日"}, {d:"2026-09-25",n:"中秋节",t:"法定假日"},
  {d:"2026-10-01",n:"国庆节",t:"法定假日"}, {d:"2026-10-25",n:"重阳节",t:"传统节日"}, {d:"2026-12-22",n:"冬至",t:"传统节日"},
];
export function HolidayTool() {
  const today=new Date().toISOString().slice(0,10);
  const upcoming=holidays2026.filter(h=>h.d>=today).slice(0,5);
  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-border/50 bg-card p-6">
        <p className="text-sm font-medium mb-3">📅 2026年节假日</p>
        <div className="space-y-1.5">
          {holidays2026.map(h=>{const d=new Date(h.d);const isPast=h.d<today;const isToday=h.d===today;return(
            <div key={h.d} className={`flex items-center justify-between p-2 rounded-lg text-sm ${isPast?"opacity-40":isToday?"bg-primary/10 font-bold":""}`}>
              <span>{h.d} {["日一二三四五六"[d.getDay()]]}</span><span>{h.n}</span><span className="text-[10px] text-muted-foreground">{h.t}</span>
            </div>);})}
        </div>
      </div>
      {upcoming.length>0&&<div className="rounded-2xl border border-red-100 bg-red-50/50 dark:bg-red-950/10 p-4"><p className="text-xs font-medium mb-2">🔜 即将到来</p>{upcoming.map(h=>{const days=Math.ceil((new Date(h.d).getTime()-new Date().getTime())/86400000);return<p key={h.d} className="text-sm">{h.n}：<span className="font-bold text-red-600">{days}天后</span>（{h.d}）</p>})}</div>}
      <p className="text-xs text-muted-foreground">💡 每年自动更新，调休安排请以国务院通知为准</p>
    </div>
  );
}
