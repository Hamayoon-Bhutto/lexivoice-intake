"use client";

import { Play, Sparkles } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/shared/Button";
import { Modal } from "@/components/shared/Modal";
import { DashboardCard } from "./DashboardCard";

export interface MockCall {
  id: string;
  fullName: string;
  phone: string;
  time: string;
  summary: string;
}

interface RecentCallsCardProps {
  calls: MockCall[];
}

export function RecentCallsCard({ calls }: RecentCallsCardProps) {
  const [selectedSummary, setSelectedSummary] = useState<string | null>(null);

  return (
    <>
      <DashboardCard
        title="Appels recents (IA)"
        action={<button className="text-xs font-semibold text-indigo-600">Voir tout</button>}
      >
        <div className="space-y-2">
          {calls.map((call) => (
            <div key={call.id} className="flex items-center justify-between rounded-xl border border-slate-100 p-2.5">
              <div className="flex min-w-0 items-center gap-2">
                <button className="rounded-full bg-indigo-50 p-2 text-indigo-600">
                  <Play className="h-3.5 w-3.5" />
                </button>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-800">{call.fullName}</p>
                  <p className="truncate text-xs text-slate-500">{call.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">{call.time}</span>
                <Button variant="secondary" size="sm" onClick={() => setSelectedSummary(call.summary)}>
                  Resume IA
                </Button>
              </div>
            </div>
          ))}
        </div>
      </DashboardCard>

      <Modal
        open={Boolean(selectedSummary)}
        onClose={() => setSelectedSummary(null)}
        title="Resume IA"
        footer={<Button onClick={() => setSelectedSummary(null)}>Fermer</Button>}
      >
        <div className="rounded-xl bg-indigo-50 p-3 text-sm text-indigo-900">
          <Sparkles className="mb-2 h-4 w-4" />
          {selectedSummary}
        </div>
      </Modal>
    </>
  );
}
