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

export interface AnalyticsPoint {
  period: string;
  count: number;
}

/**
 * Llama al endpoint /tickets/analytics/period y retorna los puntos de datos.
 */
export async function getTicketsAnalytics(
  period: 'hour' | 'day' | 'month'
): Promise<AnalyticsPoint[]> {
  const url = `${BASE_URL}/analytics/period?period=${period}`;
  const response = await fetchWithCsrf<{
    period: string;
    range: { from: string; to: string };
    data: AnalyticsPoint[];
  }>(url);

  return response.data; // response.data is AnalyticsPoint[]
}

export interface ResolutionPoint {
  period: string;     // 2025-06-07 15:00:00 | 2025-06-07 | 2025-06
  urgency: 'low' | 'medium' | 'high';
  avg_hours: number;
}

export async function getAvgResolutionAnalytics(
  period: 'hour' | 'day' | 'month'
): Promise<ResolutionPoint[]> {
  const url = `${BASE_URL}/analytics/avg-resolution-time?period=${period}`;
  const response = await fetchWithCsrf<{
    period: string;
    range: { from: string; to: string };
    data: ResolutionPoint[];
  }>(url);

  return response.data;       // array de ResolutionPoint
}

export interface MessagePoint {
  period: string;   // '2025-06-07 15:00:00' | '2025-06-07' | '2025-06'
  count: number;
}

export async function getMessagesAnalytics(
  period: 'hour' | 'day' | 'month'
): Promise<MessagePoint[]> {
  const url = `${import.meta.env.VITE_APP_URL}/analytics/messages?period=${period}`;
  const res = await fetchWithCsrf<{
    period: string;
    range: { from: string; to: string };
    data: MessagePoint[];
  }>(url);
  return res.data;
}


export interface DashboardMetrics {
  pendingRealPersonRequests: number;
  avgRealPersonResolutionHrs: number;
  openMarketingTickets: number;
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const url = `${import.meta.env.VITE_APP_URL}/analytics/dashboard-metrics`;
  return await fetchWithCsrf<DashboardMetrics>(url);
}