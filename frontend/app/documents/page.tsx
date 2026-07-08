"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/shared/Button";
import { Modal } from "@/components/shared/Modal";

const initialDocs = [
  { name: "Piece d identite", progress: 85 },
  { name: "Preuve de revenu", progress: 72 },
  { name: "Contrats / Documents", progress: 48 },
  { name: "Formulaires signes", progress: 66 },
  { name: "Autres pieces", progress: 34 },
];

export default function DocumentsPage() {
  const [open, setOpen] = useState(false);

  return (
    <AppShell title="Documents">
      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Checklist documents</h2>
          <Button variant="secondary" onClick={() => setOpen(true)}>
            Tous les modeles
          </Button>
        </div>
        <div className="space-y-3">
          {initialDocs.map((doc) => (
            <div key={doc.name}>
              <div className="mb-1 flex items-center justify-between text-sm text-slate-600">
                <span>{doc.name}</span>
                <span>{doc.progress}%</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100">
                <div className="h-2 rounded-full bg-indigo-500" style={{ width: `${doc.progress}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Modeles disponibles"
        footer={<Button onClick={() => setOpen(false)}>Fermer</Button>}
      >
        <div className="space-y-2 text-sm text-slate-700">
          <p className="rounded-xl bg-slate-50 p-3">Modele contrat de representation</p>
          <p className="rounded-xl bg-slate-50 p-3">Modele procuration client</p>
          <p className="rounded-xl bg-slate-50 p-3">Modele declaration immigration</p>
          <p className="rounded-xl bg-slate-50 p-3">Modele checklist litige emploi</p>
        </div>
      </Modal>
    </AppShell>
  );
}
