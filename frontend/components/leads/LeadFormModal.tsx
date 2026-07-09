"use client";

import { FormEvent, useState } from "react";
import { CreateLeadPayload } from "@/lib/types";
import { Button } from "@/components/shared/Button";
import { Modal } from "@/components/shared/Modal";

interface LeadFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateLeadPayload) => Promise<void>;
}

const defaultValues: CreateLeadPayload = {
  full_name: "",
  phone: "",
  email: "",
  case_type: "general",
  urgency: "normal",
  location: "",
  objective: "",
  status: "new",
  origin_channel: "web",
};

export function LeadFormModal({ open, onClose, onSubmit }: LeadFormModalProps) {
  const [form, setForm] = useState<CreateLeadPayload>(defaultValues);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await onSubmit(form);
      setForm(defaultValues);
      setError(null);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur s'est produite");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Nouveau prospect"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" form="lead-form" disabled={submitting}>
            {submitting ? "Creation..." : "Enregistrer"}
          </Button>
        </>
      }
    >
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      <form id="lead-form" className="grid grid-cols-1 gap-3 md:grid-cols-2" onSubmit={handleSubmit}>
        <label className="text-sm text-slate-600">
          Nom complet
          <input
            required
            value={form.full_name}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, full_name: event.target.value }))
            }
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
          />
        </label>
        <label className="text-sm text-slate-600">
          Telephone
          <input
            required
            value={form.phone}
            onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
          />
        </label>
        <label className="text-sm text-slate-600">
          Email
          <input
            type="email"
            required
            value={form.email}
            onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
          />
        </label>
        <label className="text-sm text-slate-600">
          Type d affaire
          <select
            value={form.case_type}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, case_type: event.target.value }))
            }
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
          >
            <option value="droit_du_travail">Emploi</option>
            <option value="droit_de_la_famille">Famille</option>
            <option value="immobilier">Immobilier</option>
            <option value="immigration">Immigration</option>
            <option value="general">General</option>
          </select>
        </label>
        <label className="text-sm text-slate-600">
          Urgence
          <select
            value={form.urgency}
            onChange={(event) => setForm((prev) => ({ ...prev, urgency: event.target.value }))}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
          >
            <option value="normal">Faible</option>
            <option value="medium">Moyenne</option>
            <option value="high">Elevee</option>
            <option value="critical">Critique</option>
          </select>
        </label>
        <label className="text-sm text-slate-600">
          Statut
          <select
            value={form.status}
            onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value }))}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
          >
            <option value="new">Nouveau</option>
            <option value="to_qualify">A qualifier</option>
            <option value="incomplete">Incomplet</option>
            <option value="complete">Complet</option>
            <option value="urgent">Urgent</option>
            <option value="booked">Reserve</option>
            <option value="client">Client</option>
          </select>
        </label>
        <label className="text-sm text-slate-600">
          Localisation
          <input
            value={form.location}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, location: event.target.value }))
            }
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
          />
        </label>
        <label className="text-sm text-slate-600">
          Canal origine
          <input
            value={form.origin_channel}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, origin_channel: event.target.value }))
            }
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
          />
        </label>
        <label className="text-sm text-slate-600 md:col-span-2">
          Objectif
          <textarea
            rows={3}
            value={form.objective}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, objective: event.target.value }))
            }
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
          />
        </label>
      </form>
    </Modal>
  );
}
