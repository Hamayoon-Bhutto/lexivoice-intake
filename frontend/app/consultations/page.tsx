"use client";

import { FormEvent, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/shared/Button";
import { Modal } from "@/components/shared/Modal";

interface Consultation {
  id: string;
  client: string;
  date: string;
  time: string;
  type: string;
}

const initialConsultations: Consultation[] = [
  { id: "1", client: "Jean Dupont", date: "2026-07-08", time: "09:30", type: "Consultation initiale" },
  { id: "2", client: "Marie Lefebvre", date: "2026-07-08", time: "11:00", type: "Suivi dossier" },
  { id: "3", client: "Sophie Gauthier", date: "2026-07-09", time: "14:00", type: "Consultation initiale" },
];

export default function ConsultationsPage() {
  const [items, setItems] = useState(initialConsultations);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ client: "", date: "", time: "", type: "Consultation initiale" });

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setItems((prev) => [{ id: String(Date.now()), ...form }, ...prev]);
    setOpen(false);
    setForm({ client: "", date: "", time: "", type: "Consultation initiale" });
  }

  return (
    <AppShell
      title="Consultations"
      actions={
        <Button onClick={() => setOpen(true)}>
          Ajouter consultation
        </Button>
      }
    >
      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
        <h2 className="mb-3 text-lg font-semibold text-slate-900">Prochaines consultations</h2>
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded-xl border border-slate-100 p-3 text-sm">
              <div>
                <p className="font-medium text-slate-800">{item.client}</p>
                <p className="text-slate-500">{item.type}</p>
              </div>
              <div className="text-right text-slate-600">
                <p>{item.date}</p>
                <p>{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Ajouter consultation"
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>Annuler</Button>
            <Button type="submit" form="consultation-form">Ajouter</Button>
          </>
        }
      >
        <form id="consultation-form" className="space-y-3" onSubmit={onSubmit}>
          <input
            required
            placeholder="Nom client"
            className="w-full rounded-xl border border-slate-200 px-3 py-2"
            value={form.client}
            onChange={(event) => setForm((prev) => ({ ...prev, client: event.target.value }))}
          />
          <input
            required
            type="date"
            className="w-full rounded-xl border border-slate-200 px-3 py-2"
            value={form.date}
            onChange={(event) => setForm((prev) => ({ ...prev, date: event.target.value }))}
          />
          <input
            required
            type="time"
            className="w-full rounded-xl border border-slate-200 px-3 py-2"
            value={form.time}
            onChange={(event) => setForm((prev) => ({ ...prev, time: event.target.value }))}
          />
          <input
            placeholder="Type"
            className="w-full rounded-xl border border-slate-200 px-3 py-2"
            value={form.type}
            onChange={(event) => setForm((prev) => ({ ...prev, type: event.target.value }))}
          />
        </form>
      </Modal>
    </AppShell>
  );
}
