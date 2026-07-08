"use client";

import { DashboardCard } from "./DashboardCard";

interface UrgencyItem {
  label: string;
  count: number;
  color: string;
}

export function UrgencyOverviewCard({ items, total }: { items: UrgencyItem[]; total: number }) {
  return (
    <DashboardCard title="Apercu par urgence">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex items-end gap-2 rounded-xl bg-slate-50 p-4">
          {items.map((item) => {
            const percent = total > 0 ? Math.max(8, Math.round((item.count / total) * 100)) : 10;
            return (
              <div key={item.label} className="flex flex-1 flex-col items-center gap-2">
                <div className="w-full rounded-lg" style={{ height: `${percent}%`, background: item.color }} />
                <span className="text-[11px] text-slate-500">{item.label}</span>
              </div>
            );
          })}
        </div>
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.label} className="flex items-center justify-between text-sm text-slate-600">
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: item.color }} />
                {item.label}
              </span>
              <span>{item.count}</span>
            </div>
          ))}
        </div>
      </div>
    </DashboardCard>
  );
}
