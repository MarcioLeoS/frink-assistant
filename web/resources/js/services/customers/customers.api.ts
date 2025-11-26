// resources/js/services/customers/customers.api.ts
import { BASE_URL } from "../../config/env";

export interface ChatContext {
    id: number;
    message_content: string;
    timestamp: string;
    role: string;
    sentiment?: string | null;
}

export interface Conversation {
    id: number;
    updated_at: string;
    chat_contexts: ChatContext[];
}

export interface Ticket { id: number }
export interface Reminder { id: number }
export interface FollowUp { id: number }
export interface Personalization {
    language: string;
    expressions: string[];
    status: string;
}

/* ----------------------- Customer ----------------------- */
export interface Customer {
    id: number;
    name: string;
    phone_number: string;
    email?: string;
    tickets?: Ticket[];
    reminders?: Reminder[];
    follow_ups?: FollowUp[];
    conversations?: Conversation[];
    personalization?: Personalization;
    last_contact_at?: string;
    message_count?: number;
}

/* ---------- CustomersResponse ---------- */
export interface CustomersResponse {
    total: number;
    customers: {
        data: Customer[];
        last_page: number;
        total: number;
    };
}

/* ------------------- CustomerQuery ------------------- */
export interface CustomerQuery {
    page: number;
    sortBy?: string | null;
    sortOrder?: "asc" | "desc";
    search?: string;
    from?: string;
    to?: string;
    minMessages?: number;
    conversacionesLargas?: "todos" | "si" | "no";
    ticketsSoporte?: "todos" | "si" | "no";
    ticketsMarketing?: "todos" | "si" | "no";
    recordatorios?: "todos" | "si" | "no";
    seguimientos?: "todos" | "activos" | "cancelados" | "pendientes";
    personalizacion?: "todos" | "activa" | "inactiva";
    feedbackNegativo?: "todos" | "si" | "no";
    solicitoHumano?: "todos" | "si" | "no";
    problemasRecurrentes?: "todos" | "si" | "no";
}

/* -------------------- GET /customer/getData -------------------- */
export async function getCustomers(
    query: CustomerQuery
): Promise<CustomersResponse> {
    const { page, ...filters } = query;

    const params = new URLSearchParams({ page: String(page) });
    Object.entries(filters).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== "") {
            params.append(k, String(v));
        }
    });

    const url = `${BASE_URL}/customer/getData?${params.toString()}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error("Error fetching customers");

    return res.json();
}

export async function getCustomerDetails(id: number) {
    let url = `${BASE_URL}/customer/getCustomerEspecificData/${id}`;


    const res = await fetch(url);
    if (!res.ok) {
        throw new Error("Error fetching customers");
    }
    return await res.json();
}

export async function getCustomerTimeline(id: number, page: number = 1) {
    const url = `${BASE_URL}/customer/getCustomerEspecificData/timeline/${id}?page=${page}`;

    const res = await fetch(url);
    if (!res.ok) {
        throw new Error("Error fetching customer timeline");
    }

    return await res.json();
}

export async function getCustomerFeedback(id: number) {
    const url = `${BASE_URL}/customer/getCustomerEspecificData/feedBack/${id}`;

    const res = await fetch(url);
    if (!res.ok) {
        throw new Error("Error fetching customer feedback");
    }

    return await res.json();
}

