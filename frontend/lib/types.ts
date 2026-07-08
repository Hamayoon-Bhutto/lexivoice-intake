export type LeadStatus =
  | "new"
  | "to_qualify"
  | "incomplete"
  | "complete"
  | "urgent"
  | "booked"
  | "client"
  | string;

export type LeadUrgency = "normal" | "medium" | "high" | "critical" | string;

export interface Lead {
  id: number | string;
  full_name: string;
  phone?: string;
  email?: string;
  case_type?: string;
  urgency?: LeadUrgency;
  location?: string;
  objective?: string;
  status?: LeadStatus;
  origin_channel?: string;
  created_at?: string;
  updated_at?: string;
  required_documents?: string[];
  call_summary?: string;
}

export interface CreateLeadPayload {
  full_name: string;
  phone: string;
  email: string;
  case_type: string;
  urgency: LeadUrgency;
  location: string;
  objective: string;
  status: LeadStatus;
  origin_channel: string;
}

export interface SimulateCallPayload {
  transcript: string;
  caller_phone: string;
  recording_url?: string;
}

export interface SimulateCallResponse {
  message: string;
  lead: Lead;
  call_summary: string;
  required_documents: string[];
  workflow_result: Record<string, unknown>;
}

export interface LeadsApiResponse {
  message: string;
  data: Lead[];
}
