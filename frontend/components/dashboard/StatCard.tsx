"use client";

import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  trend: string;
  positive?: boolean;
  icon: LucideIcon;
  accent?: "indigo" | "red" | "blue" | "amber" | "green";
}

const accentMap = {
  indigo: "bg-indigo-50 text-indigo-600",
  red: "bg-red-50 text-red-600",
  blue: "bg-blue-50 text-blue-600",
  amber: "bg-amber-50 text-amber-600",
  green: "bg-emerald-50 text-emerald-600",
};

export function StatCard({
  title,
  value,
  trend,
  positive = true,
  icon: Icon,
  accent = "indigo",
}: StatCardProps) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <p className="mt-1 text-3xl font-semibold text-slate-900">{value}</p>
        </div>
        <div className={cn("rounded-xl p-2", accentMap[accent])}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className={cn("mt-2 text-xs", positive ? "text-emerald-600" : "text-red-600")}>{trend}</p>
    </div>
  );
}
