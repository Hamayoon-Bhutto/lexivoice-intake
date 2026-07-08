"use client";

import { FormEvent, useState } from "react";
import { CalendarPlus } from "lucide-react";
import { Button } from "@/components/shared/Button";
import { Modal } from "@/components/shared/Modal";
import { DashboardCard } from "./DashboardCard";

interface Consultation {
  id: string;
  date: string;
  time: string;
  client: string;
  type: string;
  owner: string;
}

export function ConsultationsCard({ initialItems }: { initialItems: Consultation[] }) {
  const [items, setItems] = useState(initialItems);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    client: "",
    type: "Consultation initiale",
    date: "",
    time: "",
    owner: "Me. Martin",
  });

  function handleAdd(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setItems((prev) => [
      {
        id: String(Date.now()),
        client: form.client,
        type: form.type,
        date: form.date,
        time: form.time,
        owner: form.owner,
      },
      ...prev,
    ]);
    setOpen(false);
    setForm({ client: "", type: "Consultation initiale", date: "", time: "", owner: "Me. Martin" });
  }

  return (
    <>
      <DashboardCard
        title="Consultations a venir"
        action={
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm">Voir le calendrier</Button>
            <Button size="sm" onClick={() => setOpen(true)}>
              <CalendarPlus className="h-3.5 w-3.5" />
              Ajouter consultation
            </Button>
          </div>
        }
      >
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded-xl border border-slate-100 p-2.5 text-sm">
              <div>
                <p className="font-medium text-slate-800">{item.client}</p>
                <p className="text-xs text-slate-500">{item.type}</p>
              </div>
              <div className="text-right text-xs text-slate-500">
                <p>{item.date}</p>
                <p>{item.time}</p>
                <p>{item.owner}</p>
              </div>
            </div>
          ))}
        </div>
      </DashboardCard>

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
        <form id="consultation-form" className="space-y-3" onSubmit={handleAdd}>
          <input
            required
            placeholder="Nom client"
            className="w-full rounded-xl border border-slate-200 px-3 py-2"
            value={form.client}
            onChange={(event) => setForm((prev) => ({ ...prev, client: event.target.value }))}
          />
          <input
            placeholder="Type"
            className="w-full rounded-xl border border-slate-200 px-3 py-2"
            value={form.type}
            onChange={(event) => setForm((prev) => ({ ...prev, type: event.target.value }))}
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              type="date"
              required
              className="w-full rounded-xl border border-slate-200 px-3 py-2"
              value={form.date}
              onChange={(event) => setForm((prev) => ({ ...prev, date: event.target.value }))}
            />
            <input
              type="time"
              required
              className="w-full rounded-xl border border-slate-200 px-3 py-2"
              value={form.time}
              onChange={(event) => setForm((prev) => ({ ...prev, time: event.target.value }))}
            />
          </div>
        </form>
      </Modal>
    </>
  );
}
