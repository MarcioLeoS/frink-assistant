import { fetchWithCsrf } from "../http";

import { BASE_URL } from "../../config/env";

export interface Customer {
    id: number;
    name: string;
    email: string | null;
    phone_number: string;
}

export interface Agent {
    id: number;
    name: string;
    email: string | null;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface RealPersonRequest {
    id: number;
    viewed_at: string | null;      // format: 'd/m/Y H:i:s' or null
    taken_at: string | null;       // format: 'd/m/Y H:i:s' or null
    resolved_at: string | null;    // format: 'd/m/Y H:i:s' or null
    agent_id: number | null;
    agent?: Agent | null;
    question: string;
    response: string | null;
    status: string;
    customer_id: number;
    customer: Customer;
    created_at: string;
    updated_at: string;
    observations: string | null;
}

export interface RealPersonRequestQuery {
    page: number;
    perPage?: number;
    status?: string | null;
    agent_id?: number | null;
    customer_id?: number | null;
    search?: string;
    created_from?: string; // ISO or Y-m-d
    created_to?: string;
    updated_from?: string;
    updated_to?: string;
    viewed_from?: string;
    viewed_to?: string;
    taken_from?: string;
    taken_to?: string;
    resolved_from?: string;
    resolved_to?: string;
}

export interface RequestsResponse {
    data: RealPersonRequest[];
    last_page: number;
    total: number;
}

/** Fetches request data for a given page with filters */
export async function getRequests(query: RealPersonRequestQuery): Promise<RequestsResponse> {
    const params = new URLSearchParams();
    params.append('page', String(query.page));
    if (query.perPage) params.append('perPage', String(query.perPage));
    if (query.status && query.status !== "Todos") params.append('status', query.status);
    if (query.agent_id) params.append('agent_id', String(query.agent_id));
    if (query.customer_id) params.append('customer_id', String(query.customer_id));
    if (query.search) params.append('search', query.search);
    if (query.created_from) params.append('created_from', query.created_from);
    if (query.created_to) params.append('created_to', query.created_to);
    if (query.updated_from) params.append('updated_from', query.updated_from);
    if (query.updated_to) params.append('updated_to', query.updated_to);
    if (query.viewed_from) params.append('viewed_from', query.viewed_from);
    if (query.viewed_to) params.append('viewed_to', query.viewed_to);
    if (query.taken_from) params.append('taken_from', query.taken_from);
    if (query.taken_to) params.append('taken_to', query.taken_to);
    if (query.resolved_from) params.append('resolved_from', query.resolved_from);
    if (query.resolved_to) params.append('resolved_to', query.resolved_to);

    const url = `${BASE_URL}/person-requests?${params.toString()}`;
    return await fetchWithCsrf<RequestsResponse>(url);
}

/** Fetches all agents (users) */
export async function getAgents(): Promise<Agent[]> {
    const url = `${BASE_URL}/agents`;
    return await fetchWithCsrf<Agent[]>(url);
}

/** Asigns an agent to a request */
export async function assignAgentToRequest(requestId: number, agentId: number) {
    const url = `${BASE_URL}/person-requests/${requestId}/assign-agent`;
    return await fetchWithCsrf(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agent_id: agentId }),
    });
}

/** Update a request's status, observations, and timestamps */
export async function updateRequest(
  id: number,
  data: Partial<
    Pick<
      RealPersonRequest,
      "status" | "observations" | "viewed_at" | "taken_at" | "resolved_at"
    >
  >
) {
  const url = `${BASE_URL}/person-requests/${id}`;
  return await fetchWithCsrf(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}