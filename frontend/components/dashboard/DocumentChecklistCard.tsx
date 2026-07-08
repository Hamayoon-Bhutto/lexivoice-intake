"use client";

import { useState } from "react";
import { Button } from "@/components/shared/Button";
import { Modal } from "@/components/shared/Modal";
import { DashboardCard } from "./DashboardCard";

interface ChecklistItem {
  label: string;
  progress: number;
}

export function DocumentChecklistCard({ items }: { items: ChecklistItem[] }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <DashboardCard
        title="Checklist documents"
        action={
          <Button variant="secondary" size="sm" onClick={() => setOpen(true)}>
            Tous les modeles
          </Button>
        }
      >
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.label} className="space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>{item.label}</span>
                <span>{item.progress}%</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-indigo-500"
                  style={{ width: `${item.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </DashboardCard>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Modeles de documents"
        footer={<Button onClick={() => setOpen(false)}>Fermer</Button>}
      >
        <ul className="space-y-2 text-sm text-slate-700">
          <li className="rounded-xl bg-slate-50 p-2">Modele de procuration</li>
          <li className="rounded-xl bg-slate-50 p-2">Modele de declaration</li>
          <li className="rounded-xl bg-slate-50 p-2">Checklist immigration</li>
          <li className="rounded-xl bg-slate-50 p-2">Dossier immobilier standard</li>
        </ul>
      </Modal>
    </>
  );
}
