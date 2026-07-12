"use client";

import { useEffect, useState } from "react";
import {
  AlertTriangle,
  CalendarCheck2,
  FileWarning,
  FolderPlus,
  PhoneForwarded,
  RefreshCw,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { StatCard } from "@/components/dashboard/StatCard";
import { IntakeVolumeChart } from "@/components/dashboard/IntakeVolumeChart";
import { PipelineCard } from "@/components/dashboard/PipelineCard";
import { CaseTypeDonutChart } from "@/components/dashboard/CaseTypeDonutChart";
import { UrgencyOverviewCard } from "@/components/dashboard/UrgencyOverviewCard";
import { RecentCallsCard } from "@/components/dashboard/RecentCallsCard";
import { ConsultationsCard } from "@/components/dashboard/ConsultationsCard";
import { DocumentChecklistCard } from "@/components/dashboard/DocumentChecklistCard";
import { AssistantInsightCard } from "@/components/dashboard/AssistantInsightCard";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { LeadTable } from "@/components/leads/LeadTable";
import { Button } from "@/components/shared/Button";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { Modal } from "@/components/shared/Modal";
import { getLeads, simulateCall } from "@/lib/api";
import { Lead, SimulateCallPayload, SimulateCallResponse } from "@/lib/types";

const mockIntakeData = [
  { date: "20 Avr", intakes: 40 },
  { date: "24 Avr", intakes: 65 },
  { date: "27 Avr", intakes: 50 },
  { date: "30 Avr", intakes: 68 },
  { date: "04 Mai", intakes: 39 },
  { date: "08 Mai", intakes: 63 },
  { date: "11 Mai", intakes: 43 },
  { date: "15 Mai", intakes: 84 },
  { date: "18 Mai", intakes: 76 },
];

const mockCalls = [
  {
    id: "1",
    fullName: "Jean Dupont",
    phone: "+1 (514) 555-0198",
    time: "10:24",
    summary: "Client emploi: rupture du contrat, souhaite verifier droits et indemnites.",
  },
  {
    id: "2",
    fullName: "Marie Lefebvre",
    phone: "+1 (438) 555-0142",
    time: "09:47",
    summary: "Demande familiale, preparation audience garde partagee.",
  },
  {
    id: "3",
    fullName: "Thomas Bernard",
    phone: "+1 (514) 555-0103",
    time: "Hier",
    summary: "Dossier immobilier avec documents manquants a recuperer.",
  },
];

const mockConsultations = [
  {
    id: "1",
    date: "19 Mai",
    time: "09:30",
    client: "Jean Dupont",
    type: "Consultation initiale",
    owner: "Me. Martin",
  },
  {
    id: "2",
    date: "19 Mai",
    time: "11:00",
    client: "Marie Lefebvre",
    type: "Consultation initiale",
    owner: "Me. Bernard",
  },
  {
    id: "3",
    date: "20 Mai",
    time: "14:00",
    client: "Sophie Gauthier",
    type: "Suivi de dossier",
    owner: "Me. Martin",
  },
];

const mockChecklist = [
  { label: "Piece d identite", progress: 85 },
  { label: "Preuve de revenu", progress: 72 },
  { label: "Contrats / Documents", progress: 48 },
  { label: "Formulaires signes", progress: 66 },
  { label: "Autres pieces", progress: 34 },
];

const defaultCallPayload: SimulateCallPayload = {
  transcript: "Client explique un litige de travail et demande une prise en charge rapide.",
  caller_phone: "+1 (514) 555-1111",
  recording_url: "",
};

function bucket(leads: Lead[], key: (lead: Lead) => string | undefined) {
  return leads.reduce<Record<string, number>>((acc, lead) => {
    const value = (key(lead) || "").toLowerCase();
    if (!value) return acc;
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
}

export default function DashboardPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [simulateOpen, setSimulateOpen] = useState(false);
  const [simulateForm, setSimulateForm] = useState(defaultCallPayload);
  const [simulateLoading, setSimulateLoading] = useState(false);
  const [simulateResult, setSimulateResult] = useState<SimulateCallResponse | null>(null);
  const [successMessage, setSuccessMessage] = useState("");

  async function loadLeads() {
    setLoading(true);
    setError("");
    try {
      const data = await getLeads();
      console.log("Fetched leads:", data);
      setLeads(data);
    } catch (err: any) {
      setError(err.message || "Could not load leads");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    queueMicrotask(() => {
      void loadLeads();
    });
  }, []);

  const statusMap = bucket(leads, (lead) => lead.status);
  const urgencyMap = bucket(leads, (lead) => lead.urgency);
  const caseTypeMap = bucket(leads, (lead) => lead.case_type);

  const totalLeads = leads.length;
  const newCases = statusMap.new || totalLeads;
  const urgentCases = (statusMap.urgent || 0) + (urgencyMap.high || 0) + (urgencyMap.critical || 0);
  const bookedCases = statusMap.booked || 0;
  const missingDocuments = Math.max(8, Math.round(totalLeads * 0.2)) || 34;
  const completionBase = (statusMap.complete || 0) + (statusMap.booked || 0) + (statusMap.client || 0);
  const completionRate = totalLeads > 0 ? Math.min(100, Math.round((completionBase / totalLeads) * 100)) : 76;

  const pipelineItems = [
    { label: "Nouveau", count: statusMap.new || 0, color: "#6366F1" },
    { label: "A qualifier", count: statusMap.to_qualify || 0, color: "#2563EB" },
    { label: "Incomplet", count: statusMap.incomplete || 0, color: "#F59E0B" },
    { label: "Complet", count: statusMap.complete || 0, color: "#10B981" },
    { label: "Urgent", count: statusMap.urgent || 0, color: "#EF4444" },
    { label: "Reserve / Booked", count: statusMap.booked || 0, color: "#8B5CF6" },
    { label: "Client", count: statusMap.client || 0, color: "#22C55E" },
  ];

  const donutData = [
    { name: "Emploi", value: caseTypeMap.droit_du_travail || 0, color: "#6366F1" },
    { name: "Famille", value: caseTypeMap.droit_de_la_famille || 0, color: "#3B82F6" },
    { name: "Immobilier", value: caseTypeMap.immobilier || 0, color: "#14B8A6" },
    { name: "Immigration", value: caseTypeMap.immigration || 0, color: "#F59E0B" },
    { name: "General", value: caseTypeMap.general || 0, color: "#94A3B8" },
  ];

  const hasDonutData = donutData.some((item) => item.value > 0);
  const finalDonutData = hasDonutData
    ? donutData
    : [
        { name: "Emploi", value: 128, color: "#6366F1" },
        { name: "Famille", value: 109, color: "#3B82F6" },
        { name: "Immobilier", value: 91, color: "#14B8A6" },
        { name: "Immigration", value: 68, color: "#F59E0B" },
        { name: "General", value: 59, color: "#94A3B8" },
      ];

  const urgencyItems = [
    { label: "Faible", count: urgencyMap.normal || 0, color: "#22C55E" },
    { label: "Moyenne", count: urgencyMap.medium || 0, color: "#F59E0B" },
    { label: "Elevee", count: urgencyMap.high || 0, color: "#F97316" },
    { label: "Critique", count: urgencyMap.critical || 0, color: "#EF4444" },
  ];

  const hasUrgencyData = urgencyItems.some((item) => item.count > 0);
  const finalUrgencyItems = hasUrgencyData
    ? urgencyItems
    : [
        { label: "Faible", count: 203, color: "#22C55E" },
        { label: "Moyenne", count: 152, color: "#F59E0B" },
        { label: "Elevee", count: 77, color: "#F97316" },
        { label: "Critique", count: 23, color: "#EF4444" },
      ];

  const intakeData = leads.filter((lead) => lead.created_at).length
    ? Object.entries(
        leads.reduce<Record<string, number>>((acc, lead) => {
          if (!lead.created_at) return acc;
          const date = new Date(lead.created_at);
          if (Number.isNaN(date.getTime())) return acc;
          const label = new Intl.DateTimeFormat("fr-FR", {
            day: "2-digit",
            month: "short",
          }).format(date);
          acc[label] = (acc[label] || 0) + 1;
          return acc;
        }, {}),
      ).map(([date, intakes]) => ({ date, intakes }))
    : mockIntakeData;

  const recentLeads = [...leads]
    .sort((a, b) => (new Date(b.created_at || 0).getTime() || 0) - (new Date(a.created_at || 0).getTime() || 0))
    .slice(0, 6);

  async function onSimulateCallSubmit() {
    setSimulateLoading(true);
    setError("");

    try {
      const response = await simulateCall(simulateForm);
      setSuccessMessage("Appel IA traite avec succes");
      setSimulateOpen(false);
      setSimulateResult(response);
      await loadLeads();
    } catch (err: any) {
      setError(err.message || "Echec de simulation.");
    } finally {
      setSimulateLoading(false);
    }
  }

  return (
    <AppShell
      title="Tableau de bord"
      actions={
        <div className="flex gap-2">
          <Button variant="secondary" onClick={loadLeads} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Rafraîchir
          </Button>
          <Button onClick={() => setSimulateOpen(true)}>
            <PhoneForwarded className="h-4 w-4" />
            Simuler un appel IA
          </Button>
        </div>
      }
    >
      {successMessage ? (
        <div className="mb-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{successMessage}</div>
      ) : null}

      {loading ? <LoadingState /> : null}
      {error && !loading ? <ErrorState description={error} onRetry={loadLeads} /> : null}

      {!loading && !error ? (
        <div className="space-y-5">
          <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
            <StatCard title="Nouveaux dossiers" value={newCases} trend="+18% vs mois dernier" icon={FolderPlus} accent="indigo" />
            <StatCard title="Dossiers urgents" value={urgentCases} trend="+9% vs mois dernier" icon={AlertTriangle} accent="red" />
            <StatCard title="Rendez-vous planifies" value={bookedCases} trend="+22% vs mois dernier" icon={CalendarCheck2} accent="blue" />
            <StatCard title="Documents manquants" value={missingDocuments} trend="-5% vs mois dernier" icon={FileWarning} accent="amber" positive={false} />
            <StatCard title="Taux de completion" value={`${completionRate}%`} trend="+8% vs mois dernier" icon={CalendarCheck2} accent="green" />
          </section>

          <section className="grid grid-cols-1 gap-4 xl:grid-cols-12">
            <div className="xl:col-span-6">
              <IntakeVolumeChart data={intakeData} />
            </div>
            <div className="xl:col-span-3">
              <PipelineCard items={pipelineItems} total={Math.max(totalLeads, 1)} />
            </div>
            <div className="xl:col-span-3">
              <CaseTypeDonutChart
                data={finalDonutData}
                total={finalDonutData.reduce((sum, item) => sum + item.value, 0)}
              />
            </div>
          </section>

          <section className="grid grid-cols-1 gap-4 xl:grid-cols-12">
            <div className="xl:col-span-4">
              <UrgencyOverviewCard
                items={finalUrgencyItems}
                total={finalUrgencyItems.reduce((sum, item) => sum + item.count, 0)}
              />
            </div>
            <div className="xl:col-span-5">
              <DashboardCard title="Leads recents" action={<span className="text-xs text-indigo-600">Voir tout</span>}>
                {recentLeads.length ? <LeadTable leads={recentLeads} compact /> : <EmptyState title="Aucun prospect" description="Ajoutez un prospect pour commencer." />}
              </DashboardCard>
            </div>
            <div className="xl:col-span-3">
              <RecentCallsCard calls={mockCalls} />
            </div>
          </section>

          <section className="grid grid-cols-1 gap-4 xl:grid-cols-12">
            <div className="xl:col-span-4">
              <ConsultationsCard initialItems={mockConsultations} />
            </div>
            <div className="xl:col-span-4">
              <DocumentChecklistCard items={mockChecklist} />
            </div>
            <div className="xl:col-span-4">
              <AssistantInsightCard />
            </div>
          </section>
        </div>
      ) : null}

      <Modal
        open={simulateOpen}
        onClose={() => setSimulateOpen(false)}
        title="Simuler un appel IA"
        footer={
          <>
            <Button variant="secondary" onClick={() => setSimulateOpen(false)}>
              Annuler
            </Button>
            <Button onClick={onSimulateCallSubmit} disabled={simulateLoading}>
              {simulateLoading ? "Traitement..." : "Lancer la simulation"}
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <label className="text-sm text-slate-600">
            Transcript
            <textarea
              rows={5}
              value={simulateForm.transcript}
              onChange={(event) =>
                setSimulateForm((prev) => ({ ...prev, transcript: event.target.value }))
              }
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
            />
          </label>
          <label className="text-sm text-slate-600">
            Caller phone
            <input
              value={simulateForm.caller_phone}
              onChange={(event) =>
                setSimulateForm((prev) => ({ ...prev, caller_phone: event.target.value }))
              }
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
            />
          </label>
          <label className="text-sm text-slate-600">
            Recording URL
            <input
              value={simulateForm.recording_url || ""}
              onChange={(event) =>
                setSimulateForm((prev) => ({ ...prev, recording_url: event.target.value }))
              }
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
            />
          </label>
        </div>
      </Modal>

      <Modal
        open={Boolean(simulateResult)}
        onClose={() => setSimulateResult(null)}
        title="Resultat simulation IA"
        footer={<Button onClick={() => setSimulateResult(null)}>Fermer</Button>}
      >
        {simulateResult ? (
          <div className="space-y-3 text-sm text-slate-700">
            <p className="rounded-xl bg-emerald-50 p-3 text-emerald-700">{simulateResult.message}</p>
            <div>
              <p className="font-semibold">Resume</p>
              <p className="mt-1 rounded-xl bg-slate-50 p-3">{simulateResult.call_summary}</p>
            </div>
            <div>
              <p className="font-semibold">Documents requis</p>
              <ul className="mt-1 list-disc space-y-1 pl-5">
                {simulateResult.required_documents?.map((doc) => (
                  <li key={doc}>{doc}</li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}
      </Modal>
    </AppShell>
  );
}
