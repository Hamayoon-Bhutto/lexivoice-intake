"use client";

import { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

interface DashboardCardProps extends PropsWithChildren {
  title?: string;
  action?: React.ReactNode;
  className?: string;
}

export function DashboardCard({ title, action, className, children }: DashboardCardProps) {
  return (
    <section className={cn("rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100", className)}>
      {title ? (
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
          {action}
        </div>
      ) : null}
      {children}
    </section>
  );
}
