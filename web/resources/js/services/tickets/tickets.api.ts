import { es } from 'date-fns/locale';
// resources/js/Services/tickets.api.ts
import { fetchWithCsrf } from "../http";

import { BASE_URL } from "../../config/env";

export interface Customer {
  id: number;
  name: string;
  phone_number: string;
  email?: string | null;
}

export interface Ticket {
  id: number;
  status: string;
  urgency: string;
  problem_type: string;
  problem_description: string;
  created_at: string;
  customer_id: number;
  customer: Customer;
  escalated: boolean;
  follow_ups: TicketFollowUp[];
}

export interface TicketsResponse {
  tickets: {
    data: Ticket[];
    last_page: number;
    total: number;
  };
}

export interface TicketFollowUp {
  id: number;
  ticket_id: number;
  notes: string;
  follow_up_at: string; // ISO date string
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  user: {
    id: number;
    name: string;
    email: string;
  }
}

export interface FollowUpPayload {
  notes: string;
  follow_up_at: string; // ISO date string
}

/** Fetches tickets data for a given page */
export async function getTickets(
  page: number,
  perPage: number,
  status: string | null,
  urgency: string | null
): Promise<TicketsResponse> {
  let url = `${BASE_URL}/tickets/getData?page=${page}`;

  if (perPage) url += `&perPage=${perPage}`;
  if (status && status !== "Todos") url += `&status=${status}`;
  if (urgency) url += `&urgency=${urgency}`;

  return await fetchWithCsrf<TicketsResponse>(url);
}

/** Escalates a ticket by ID */
export async function escalateTicket(
  ticketId: number
): Promise<void> {
  const url = `${BASE_URL}/tickets/${ticketId}/escalate`;
  await fetchWithCsrf<void>(url, { method: "POST" });
}

/** Creates a follow-up for a ticket */
export async function createFollowUp(
  ticketId: number,
  payload: FollowUpPayload
): Promise<void> {
  const url = `${BASE_URL}/tickets/${ticketId}/follow-up`;
  await fetchWithCsrf<void>(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function updateStatus(
  ticketId: number,
  status: string
): Promise<void> {
  const url = `${BASE_URL}/tickets/${ticketId}/status`;
  await fetchWithCsrf<void>(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
}