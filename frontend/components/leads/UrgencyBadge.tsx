"use client";

import { LeadUrgency } from "@/lib/types";
import { cn, urgencyLabel } from "@/lib/utils";

const urgencyColor: Record<string, string> = {
  normal: "bg-emerald-50 text-emerald-700",
  medium: "bg-amber-50 text-amber-700",
  high: "bg-orange-50 text-orange-700",
  critical: "bg-red-50 text-red-700",
};

export function UrgencyBadge({ urgency }: { urgency?: LeadUrgency }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-lg px-2.5 py-1 text-xs font-semibold",
        urgencyColor[urgency || ""] || "bg-slate-100 text-slate-700",
      )}
    >
      {urgencyLabel(urgency)}
    </span>
  );
}
