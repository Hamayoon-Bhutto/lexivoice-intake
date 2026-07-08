"use client";

import { FormEvent, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/shared/Button";

export default function SettingsPage() {
  const [form, setForm] = useState({
    firmName: "Cabinet Martin Avocats",
    timezone: "America/Toronto",
    notifications: true,
  });
  const [message, setMessage] = useState("");

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("Parametres enregistres localement.");
  }

  return (
    <AppShell title="Parametres">
      <form onSubmit={onSubmit} className="max-w-2xl space-y-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
        <h2 className="text-lg font-semibold text-slate-900">Configuration generale</h2>

        <label className="block text-sm text-slate-600">
          Nom du cabinet
          <input
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
            value={form.firmName}
            onChange={(event) => setForm((prev) => ({ ...prev, firmName: event.target.value }))}
          />
        </label>

        <label className="block text-sm text-slate-600">
          Fuseau horaire
          <input
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
            value={form.timezone}
            onChange={(event) => setForm((prev) => ({ ...prev, timezone: event.target.value }))}
          />
        </label>

        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={form.notifications}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, notifications: event.target.checked }))
            }
          />
          Recevoir les alertes email
        </label>

        <div className="flex items-center gap-3">
          <Button type="submit">Enregistrer</Button>
          {message ? <p className="text-sm text-emerald-600">{message}</p> : null}
        </div>
      </form>
    </AppShell>
  );
}
