import { fetchWithCsrf } from "../http";
import { BASE_URL } from "../../config/env";

export interface Alert {
  id: number;
  type: string;
  status: string;
  urgency: 'low' | 'medium' | 'high';
  provider?: string | null;
  name?: string | null;
  description?: string | null;
  data?: any;
  error_message?: string | null;
  error_code?: number | null;
  created_at: string;
  updated_at: string;
}

export interface AlertsResponse {
  data: Alert[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export async function getAlerts(page = 1, perPage = 20): Promise<AlertsResponse> {
  const url = new URL(`${BASE_URL}/alerts`);
  url.searchParams.set('page', String(page));
  url.searchParams.set('perPage', String(perPage));
  return await fetchWithCsrf<AlertsResponse>(url.toString());
}
