// js/services/reminders.api.ts
import { BASE_URL } from "../../config/env";

export interface Category {
  id: number;
  title: string;
  description: string;
  color_code: string;
}

export interface Reminder {
  id: number;
  content: string;
  description: string;
  observation: string;
  remind_at: string;
  created_at: string;
  source: string;
  notified: boolean;
  customer: {
    id: number;
    name: string;
    phone_number: string;
  };
  category: Category;
}

export interface RemindersResponse {
  reminders: {
    data: Reminder[];
    last_page: number;
    total: number;
  };
}

/** Fetches reminder categories */
export async function getCategories(): Promise<Category[]> {
  const res = await fetch(`${BASE_URL}/reminders/categories/getData`);
  if (!res.ok) {
    throw new Error("Error fetching categories");
  }
  return await res.json();
}

/** Parameters to fetch reminders */
export interface GetRemindersParams {
  page: number;
  categoryId?: number;
}

/** Fetches reminders based on page and category */
export async function getReminders({ page, categoryId }: GetRemindersParams): Promise<RemindersResponse> {
  let url = `${BASE_URL}/reminders/getData?page=${page}`;
  if (categoryId && categoryId !== 0) {
    url += `&categoryId=${categoryId}`;
  }
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Error fetching reminders");
  }
  return await res.json();
}
