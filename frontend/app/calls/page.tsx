"use client";

import { FormEvent, useState } from "react";
import { PhoneForwarded, Sparkles } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/shared/Button";
import { Modal } from "@/components/shared/Modal";
import { simulateCall } from "@/lib/api";
import { SimulateCallPayload, SimulateCallResponse } from "@/lib/types";

const mockCalls = [
  {
    id: "1",
    name: "Jean Dupont",
    phone: "+1 (514) 555-0198",
    timestamp: "Aujourd hui 10:24",
    summary: "Litige employeur, besoin de strategie avant mediation.",
  },
  {
    id: "2",
    name: "Marie Lefebvre",
    phone: "+1 (438) 555-0142",
    timestamp: "Aujourd hui 09:47",
    summary: "Demande de consultation urgente en droit de la famille.",
  },
  {
    id: "3",
    name: "Thomas Bernard",
    phone: "+1 (514) 555-0103",
    timestamp: "Hier 16:11",
    summary: "Suivi immigration, pieces manquantes identifiees.",
  },
];

const defaultPayload: SimulateCallPayload = {
  transcript: "Le client souhaite contester un congediement et demande une consultation rapide.",
  caller_phone: "+1 (514) 555-2222",
  recording_url: "",
};

export default function CallsPage() {
  const [summary, setSummary] = useState<string | null>(null);
  const [simulateOpen, setSimulateOpen] = useState(false);
  const [simulateResult, setSimulateResult] = useState<SimulateCallResponse | null>(null);
  const [payload, setPayload] = useState(defaultPayload);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSimulate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await simulateCall(payload);
      setSimulateResult(result);
      setSimulateOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur simulation.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell
      title="Appels"
      actions={
        <Button onClick={() => setSimulateOpen(true)}>
          <PhoneForwarded className="h-4 w-4" />
          Simuler un appel IA
        </Button>
      }
    >
      {error ? <p className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
        <h2 className="mb-3 text-lg font-semibold text-slate-900">Appels recents</h2>
        <div className="space-y-2">
          {mockCalls.map((call) => (
            <div key={call.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-100 p-3">
              <div>
                <p className="font-medium text-slate-800">{call.name}</p>
                <p className="text-sm text-slate-500">{call.phone}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">{call.timestamp}</span>
                <Button variant="secondary" size="sm" onClick={() => setSummary(call.summary)}>
                  Resume IA
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal
        open={Boolean(summary)}
        onClose={() => setSummary(null)}
        title="Resume IA"
        footer={<Button onClick={() => setSummary(null)}>Fermer</Button>}
      >
        <p className="rounded-xl bg-indigo-50 p-3 text-sm text-indigo-900">{summary}</p>
      </Modal>

      <Modal
        open={simulateOpen}
        onClose={() => setSimulateOpen(false)}
        title="Simuler un appel IA"
        footer={
          <>
            <Button variant="secondary" onClick={() => setSimulateOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" form="simulate-call-form" disabled={loading}>
              {loading ? "Traitement..." : "Simuler"}
            </Button>
          </>
        }
      >
        <form id="simulate-call-form" className="space-y-3" onSubmit={onSimulate}>
          <label className="text-sm text-slate-600">
            Transcript
            <textarea
              rows={5}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
              value={payload.transcript}
              onChange={(event) => setPayload((prev) => ({ ...prev, transcript: event.target.value }))}
            />
          </label>
          <label className="text-sm text-slate-600">
            Caller phone
            <input
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
              value={payload.caller_phone}
              onChange={(event) => setPayload((prev) => ({ ...prev, caller_phone: event.target.value }))}
            />
          </label>
          <label className="text-sm text-slate-600">
            Recording URL
            <input
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
              value={payload.recording_url || ""}
              onChange={(event) => setPayload((prev) => ({ ...prev, recording_url: event.target.value }))}
            />
          </label>
        </form>
      </Modal>

      <Modal
        open={Boolean(simulateResult)}
        onClose={() => setSimulateResult(null)}
        title="Resultat appel IA"
        footer={<Button onClick={() => setSimulateResult(null)}>Fermer</Button>}
      >
        {simulateResult ? (
          <div className="space-y-3 text-sm">
            <p className="rounded-xl bg-emerald-50 p-3 text-emerald-700">Appel IA traite avec succes</p>
            <div className="rounded-xl bg-slate-50 p-3 text-slate-700">
              <Sparkles className="mb-2 h-4 w-4" />
              {simulateResult.call_summary}
            </div>
            <ul className="list-disc pl-5 text-slate-600">
              {simulateResult.required_documents?.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </Modal>
    </AppShell>
  );
}
