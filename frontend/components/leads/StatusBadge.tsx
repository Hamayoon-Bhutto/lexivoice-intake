"use client";

import { LeadStatus } from "@/lib/types";
import { cn, statusLabel } from "@/lib/utils";

const statusColor: Record<string, string> = {
  new: "bg-indigo-50 text-indigo-700",
  to_qualify: "bg-blue-50 text-blue-700",
  incomplete: "bg-amber-50 text-amber-700",
  complete: "bg-emerald-50 text-emerald-700",
  urgent: "bg-red-50 text-red-700",
  booked: "bg-violet-50 text-violet-700",
  client: "bg-green-50 text-green-700",
};

export function StatusBadge({ status }: { status?: LeadStatus }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-lg px-2.5 py-1 text-xs font-semibold",
        statusColor[status || ""] || "bg-slate-100 text-slate-700",
      )}
    >
      {statusLabel(status)}
    </span>
  );
}
