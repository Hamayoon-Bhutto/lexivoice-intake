import clsx, { ClassValue } from "clsx";
import { Lead, LeadStatus, LeadUrgency } from "./types";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(value?: string) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function statusLabel(status?: LeadStatus) {
  const map: Record<string, string> = {
    new: "Nouveau",
    to_qualify: "A qualifier",
    incomplete: "Incomplet",
    complete: "Complet",
    urgent: "Urgent",
    booked: "Reserve",
    client: "Client",
  };

  return map[status || ""] || status || "Non defini";
}

export function urgencyLabel(urgency?: LeadUrgency) {
  const map: Record<string, string> = {
    normal: "Faible",
    medium: "Moyenne",
    high: "Elevee",
    critical: "Critique",
  };

  return map[urgency || ""] || urgency || "Non definie";
}

export function caseTypeLabel(caseType?: string) {
  const map: Record<string, string> = {
    droit_du_travail: "Emploi",
    droit_de_la_famille: "Famille",
    immobilier: "Immobilier",
    immigration: "Immigration",
    general: "General",
  };

  return map[caseType || ""] || caseType || "General";
}

export function normalizeLeadId(id: string | number) {
  return String(id);
}

export function findLeadById(leads: Lead[], id: string) {
  return leads.find((lead) => normalizeLeadId(lead.id) === id);
}
