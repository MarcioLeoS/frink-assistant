// resources/js/Services/bots.api.ts
import { fetchWithCsrf } from "../http";
import { BASE_URL } from "../../config/env";

export interface BotUser {
  id: number;
  name: string;
  email: string;
}

export interface BotConfig {
  id: number;
  long_prompt: string;
  short_prompt: string;
  bot_type: string;
  bot_name: string;
  bot_description?: string | null;
  user_id: number;
  user: BotUser;
  created_at: string;  // ISO date
  updated_at: string;  // ISO date
  deleted_at?: string | null;
}

export interface BotsResponse {
  data: BotConfig[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

/** Fetch paginated list of bot configurations. */
export async function getBots(
  page: number,
  perPage: number,
  search?: string,
  sortBy?: string,
  orderBy?: 'asc' | 'desc',
  botType?: string,
  userId?: number
): Promise<BotsResponse> {
  const url = new URL(`${BASE_URL}/bots`);
  url.searchParams.set('page', String(page));
  url.searchParams.set('perPage', String(perPage));
  if (search)    url.searchParams.set('search', search);
  if (sortBy)    url.searchParams.set('sortBy', sortBy);
  if (orderBy)   url.searchParams.set('orderBy', orderBy);
  if (botType)   url.searchParams.set('botType', botType);
  if (userId != null) url.searchParams.set('userId', String(userId));

  const resp = await fetchWithCsrf<{ botsConfig: BotsResponse }>(url.toString());
  return resp.botsConfig;
}

/**
 * Create a new bot configuration.
 */
export async function createBot(data: Omit<BotConfig, 'id' | 'created_at' | 'updated_at' | 'deleted_at' | 'user'>): Promise<BotConfig> {
  const url = `${BASE_URL}/bots`;
  return await fetchWithCsrf<BotConfig>(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

/**
 * Retrieve a single bot configuration.
 */
export async function getBot(id: number): Promise<BotConfig> {
  const url = `${BASE_URL}/bots/${id}`;
  return await fetchWithCsrf<BotConfig>(url);
}

/**
 * Update an existing bot configuration.
 */
export async function updateBot(id: number, data: Partial<Omit<BotConfig, 'id' | 'created_at' | 'updated_at' | 'deleted_at' | 'user'>>): Promise<BotConfig> {
  const url = `${BASE_URL}/bots/${id}`;
  return await fetchWithCsrf<BotConfig>(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

/**
 * Soft-delete a bot configuration.
 */
export async function deleteBot(id: number): Promise<void> {
  const url = `${BASE_URL}/bots/${id}`;
  await fetchWithCsrf<void>(url, {
    method: "DELETE",
  });
}

/**
 * Permanently delete a bot configuration.
 */
export async function forceDeleteBot(id: number): Promise<void> {
  const url = `${BASE_URL}/bots/${id}/force`;
  await fetchWithCsrf<void>(url, {
    method: "DELETE",
  });
}

/** Restore a soft-deleted bot. */
export async function restoreBot(id: number): Promise<void> {
  const url = `${BASE_URL}/bots/${id}/restore`;
  await fetchWithCsrf<void>(url, { method: 'PATCH' });
}