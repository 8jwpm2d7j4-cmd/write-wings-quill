import { useMemo } from "react";

type Entry = { date: string; words: number };

/** GitHub-style 12-week heatmap of writing activity. */
export function StreakCalendar({ entries, target = 500 }: { entries: Entry[]; target?: number }) {
  const map = useMemo(() => {
    const m = new Map<string, number>();
    entries.forEach((e) => m.set(e.date, e.words));
    return m;
  }, [entries]);

  const weeks = 12;
  const today = new Date();
  const cells: { date: string; words: number }[] = [];
  // Start from (weeks*7 - 1) days ago
  for (let i = weeks * 7 - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    cells.push({ date: key, words: map.get(key) ?? 0 });
  }

  const intensity = (w: number) => {
    if (w === 0) return "bg-muted";
    const pct = w / target;
    if (pct < 0.25) return "bg-primary/20";
    if (pct < 0.5) return "bg-primary/40";
    if (pct < 1) return "bg-primary/70";
    return "bg-primary";
  };

  // Group into weeks (columns)
  const cols: (typeof cells)[] = [];
  for (let i = 0; i < weeks; i++) cols.push(cells.slice(i * 7, i * 7 + 7));

  return (
    <div className="paper-card p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs uppercase tracking-widest text-muted-foreground">Last 12 weeks</div>
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <span>Less</span>
          <span className="w-2.5 h-2.5 rounded-sm bg-muted" />
          <span className="w-2.5 h-2.5 rounded-sm bg-primary/20" />
          <span className="w-2.5 h-2.5 rounded-sm bg-primary/40" />
          <span className="w-2.5 h-2.5 rounded-sm bg-primary/70" />
          <span className="w-2.5 h-2.5 rounded-sm bg-primary" />
          <span>More</span>
        </div>
      </div>
      <div className="flex gap-1 overflow-x-auto">
        {cols.map((col, ci) => (
          <div key={ci} className="flex flex-col gap-1">
            {col.map((c) => (
              <div
                key={c.date}
                title={`${c.date}: ${c.words} words`}
                className={`w-3 h-3 rounded-sm ${intensity(c.words)}`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
