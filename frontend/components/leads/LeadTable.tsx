"use client";

import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { Lead } from "@/lib/types";
import { caseTypeLabel, formatDate, normalizeLeadId } from "@/lib/utils";
import { Button } from "@/components/shared/Button";
import { StatusBadge } from "./StatusBadge";
import { UrgencyBadge } from "./UrgencyBadge";

interface LeadTableProps {
  leads: Lead[];
  compact?: boolean;
}

export function LeadTable({ leads, compact = false }: LeadTableProps) {
  const router = useRouter();

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left">
        <thead>
          <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-500">
            <th className="px-3 py-3 font-semibold">Nom</th>
            <th className="px-3 py-3 font-semibold">Type d affaire</th>
            <th className="px-3 py-3 font-semibold">Urgence</th>
            <th className="px-3 py-3 font-semibold">Statut</th>
            <th className="px-3 py-3 font-semibold">Date</th>
            <th className="px-3 py-3 font-semibold">Action</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr
              key={normalizeLeadId(lead.id)}
              className="cursor-pointer border-b border-slate-100 text-sm text-slate-700 transition hover:bg-slate-50"
              onClick={() => router.push(`/leads/${normalizeLeadId(lead.id)}`)}
            >
              <td className="px-3 py-3 font-medium text-slate-900">{lead.full_name || "-"}</td>
              <td className="px-3 py-3">{caseTypeLabel(lead.case_type)}</td>
              <td className="px-3 py-3">
                <UrgencyBadge urgency={lead.urgency} />
              </td>
              <td className="px-3 py-3">
                <StatusBadge status={lead.status} />
              </td>
              <td className="px-3 py-3">{formatDate(lead.created_at)}</td>
              <td className="px-3 py-3">
                <Button
                  variant="secondary"
                  size="sm"
                  className="gap-1"
                  onClick={(event) => {
                    event.stopPropagation();
                    router.push(`/leads/${normalizeLeadId(lead.id)}`);
                  }}
                >
                  <Eye className="h-3.5 w-3.5" />
                  Voir
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {compact ? null : (
        <p className="px-3 pt-4 text-xs text-slate-500">{leads.length} prospects affiches</p>
      )}
    </div>
  );
}
