import {
  CreateLeadPayload,
  Lead,
  LeadsApiResponse,
  SimulateCallPayload,
  SimulateCallResponse,
} from "./types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    ...init,
  });

  if (!response.ok) {
    const fallbackMessage = `Request failed with status ${response.status}`;

    try {
      const errorBody = (await response.json()) as { detail?: string; message?: string };
      throw new Error(errorBody.detail || errorBody.message || fallbackMessage);
    } catch {
      throw new Error(fallbackMessage);
    }
  }

  return (await response.json()) as T;
}

export async function getLeads(): Promise<Lead[]> {
  const data = await request<LeadsApiResponse>("/leads/");
  return data.data || [];
}

export async function createLead(payload: CreateLeadPayload): Promise<Lead> {
  return request<Lead>("/leads/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function simulateCall(
  payload: SimulateCallPayload,
): Promise<SimulateCallResponse> {
  return request<SimulateCallResponse>("/demo/simulate-call", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function healthCheck(): Promise<{ status?: string; message?: string }> {
  return request<{ status?: string; message?: string }>("/health");
}

export { API_BASE_URL };
