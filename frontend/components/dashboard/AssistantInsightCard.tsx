"use client";

import { Sparkles } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/shared/Button";
import { Modal } from "@/components/shared/Modal";
import { DashboardCard } from "./DashboardCard";

export function AssistantInsightCard() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <DashboardCard className="bg-gradient-to-br from-indigo-50 to-violet-50 ring-indigo-100">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-white p-2 text-indigo-600 shadow-sm">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <p className="text-lg font-semibold text-slate-900">Assistant LexiVoice</p>
            <p className="mt-2 text-sm text-slate-600">
              L IA analyse vos appels et documents pour extraire les informations cles et vous faire gagner du temps.
            </p>
            <Button className="mt-4" onClick={() => setOpen(true)}>
              Voir les insights IA
            </Button>
          </div>
        </div>
      </DashboardCard>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Insights IA"
        footer={<Button onClick={() => setOpen(false)}>Fermer</Button>}
      >
        <ul className="space-y-2 text-sm text-slate-700">
          <li className="rounded-xl bg-indigo-50 p-3">
            68% des appels recents mentionnent un besoin de suivi documentaire.
          </li>
          <li className="rounded-xl bg-indigo-50 p-3">
            Le delai moyen de qualification est de 1.8 jour sur les dossiers emploi.
          </li>
          <li className="rounded-xl bg-indigo-50 p-3">
            Opportunite: automatiser les rappels de preuve de revenu pour reduire les incomplets.
          </li>
        </ul>
      </Modal>
    </>
  );
}
