"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { StatusBadge } from "@/components/leads/StatusBadge";
import { UrgencyBadge } from "@/components/leads/UrgencyBadge";
import { Button } from "@/components/shared/Button";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { getLeads } from "@/lib/api";
import { Lead } from "@/lib/types";
import { caseTypeLabel, findLeadById, formatDate } from "@/lib/utils";

export default function LeadDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id || "";
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const [localStatus, setLocalStatus] = useState<string | undefined>(undefined);
  const [localUrgency, setLocalUrgency] = useState<string | undefined>(undefined);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await getLeads();
      setLeads(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors du chargement du prospect.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    queueMicrotask(() => {
      void load();
    });
  }, []);

  const lead = useMemo(() => findLeadById(leads, id), [leads, id]);
  const status = localStatus || lead?.status;
  const urgency = localUrgency || lead?.urgency;

  return (
    <AppShell title="Detail prospect">
      {loading ? <LoadingState /> : null}
      {error && !loading ? <ErrorState description={error} onRetry={load} /> : null}

      {!loading && !error && !lead ? (
        <ErrorState title="Prospect introuvable" description="Aucun prospect ne correspond a cet identifiant." />
      ) : null}

      {!loading && !error && lead ? (
        <div className="space-y-4">
          {notice ? (
            <div className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-700">{notice}</div>
          ) : null}

          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="text-2xl font-semibold text-slate-900">{lead.full_name}</h1>
                <p className="mt-1 text-sm text-slate-500">Cree le {formatDate(lead.created_at)}</p>
              </div>
              <div className="flex gap-2">
                <StatusBadge status={status} />
                <UrgencyBadge urgency={urgency} />
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
              <Field label="Telephone" value={lead.phone} />
              <Field label="Email" value={lead.email} />
              <Field label="Type d affaire" value={caseTypeLabel(lead.case_type)} />
              <Field label="Canal origine" value={lead.origin_channel} />
              <Field label="Localisation" value={lead.location} />
              <Field label="Objectif" value={lead.objective} />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="secondary"
              onClick={() => setNotice("Action simulee - endpoint backend a connecter.")}
            >
              Modifier
            </Button>
            <Button
              onClick={() => {
                setLocalUrgency("high");
                setLocalStatus("urgent");
                setNotice("Action simulee - endpoint backend a connecter.");
              }}
            >
              Marquer urgent
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setLocalStatus("complete");
                setNotice("Action simulee - endpoint backend a connecter.");
              }}
            >
              Marquer complet
            </Button>
            <Link href="/leads">
              <Button variant="ghost">Retour aux prospects</Button>
            </Link>
          </div>
        </div>
      ) : null}
    </AppShell>
  );
}

function Field({ label, value }: { label: string; value?: string }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-sm text-slate-800">{value || "-"}</p>
    </div>
  );
}
