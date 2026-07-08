"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { LeadTable } from "@/components/leads/LeadTable";
import { LeadFormModal } from "@/components/leads/LeadFormModal";
import { Button } from "@/components/shared/Button";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { createLead, getLeads } from "@/lib/api";
import { CreateLeadPayload, Lead } from "@/lib/types";

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [success, setSuccess] = useState("");

  async function loadLeads() {
    setLoading(true);
    setError(null);

    try {
      const data = await getLeads();
      setLeads(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible de charger les prospects.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    queueMicrotask(() => {
      void loadLeads();
    });
  }, []);

  async function handleCreateLead(payload: CreateLeadPayload) {
    await createLead(payload);
    setSuccess("Prospect cree avec succes.");
    await loadLeads();
  }

  return (
    <AppShell
      title="Prospects"
      actions={
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="h-4 w-4" />
          Nouveau prospect
        </Button>
      }
    >
      {success ? (
        <div className="mb-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{success}</div>
      ) : null}

      {loading ? <LoadingState /> : null}
      {error && !loading ? <ErrorState description={error} onRetry={loadLeads} /> : null}

      {!loading && !error ? (
        leads.length ? (
          <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
            <LeadTable leads={leads} />
          </div>
        ) : (
          <EmptyState
            title="Aucun prospect"
            description="Commencez par ajouter un nouveau prospect a votre pipeline."
            actionLabel="Nouveau prospect"
            onAction={() => setModalOpen(true)}
          />
        )
      ) : null}

      <LeadFormModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleCreateLead} />
    </AppShell>
  );
}
