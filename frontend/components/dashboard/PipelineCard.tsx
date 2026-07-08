"use client";

import { DashboardCard } from "./DashboardCard";

interface PipelineItem {
  label: string;
  count: number;
  color: string;
}

export function PipelineCard({ items, total }: { items: PipelineItem[]; total: number }) {
  return (
    <DashboardCard title="Pipeline des dossiers">
      <div className="space-y-3">
        {items.map((item) => {
          const percent = total > 0 ? Math.round((item.count / total) * 100) : 0;

          return (
            <div key={item.label} className="space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>{item.label}</span>
                <span>
                  {item.count} ({percent}%)
                </span>
              </div>
              <div className="h-2 rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full"
                  style={{ width: `${percent}%`, background: item.color }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-4 text-xs text-slate-500">Total dossiers: {total}</p>
    </DashboardCard>
  );
}
