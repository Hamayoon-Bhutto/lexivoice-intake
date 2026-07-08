"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { DashboardCard } from "./DashboardCard";

interface DonutDatum {
  name: string;
  value: number;
  color: string;
}

export function CaseTypeDonutChart({ data, total }: { data: DonutDatum[]; total: number }) {
  return (
    <DashboardCard title="Repartition par type d affaire">
      <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
        <div className="mx-auto h-52 w-full max-w-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
              >
                {data.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-2 self-center">
          <p className="text-center text-2xl font-semibold text-slate-900 lg:text-left">{total}</p>
          <p className="text-center text-xs text-slate-500 lg:text-left">Total</p>
          {data.map((item) => (
            <div key={item.name} className="flex items-center justify-between text-xs text-slate-600">
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: item.color }} />
                {item.name}
              </span>
              <span>{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </DashboardCard>
  );
}
