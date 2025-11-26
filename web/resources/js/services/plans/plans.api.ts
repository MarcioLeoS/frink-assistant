// resources/js/Services/bots.api.ts
import { fetchWithCsrf } from "../http";
import { BASE_URL } from "../../config/env";

export interface Plan {
    id: number;
    order: number;
    name: string;
    slug: string;
    price: number;
    monthly_label?: string; // Precio mensual
    annual_label?: string; // Precio anual
    currency: string;
    interval: string;  // e.g., 'month', 'year'
    trial_days: number;
    created_at: string;  // ISO date
    updated_at: string;  // ISO date
    features: PlanFeature[];
    subscriptions: Subscription[];
}

export interface PlanFeature {
    id: number;
    code: number;
    description: number;
    plan_id: number;
    created_at: string;  // ISO date
    updated_at: string;  // ISO date
}

export interface Subscription {
    id: number;
    plan_id: number; // Relación con el plan
    provider_sub_id?: string; // ID del proveedor de suscripción
    status: string; // Estado de la suscripción (e.g., 'active', 'canceled')
    next_renewal: string; // Fecha de la próxima renovación (ISO date)
    next_renewal_formatted: string; // Fecha de la próxima renovación formateada
    canceled_at?: string; // Fecha de cancelación (ISO date)
    created_at: string; // Fecha de creación (ISO date)
    updated_at: string; // Fecha de actualización (ISO date)

    // Relaciones
    plan?: Plan; // Relación con el plan
    payments?: Payment[]; // Relación con los pagos
}

export interface Payment {
    id: number;
    subscription_id: number; // Relación con la suscripción
    amount: number; // Monto del pago
    currency: string; // Moneda del pago
    status: string; // Estado del pago (e.g., 'completed', 'failed')
    created_at: string; // Fecha de creación (ISO date)
    updated_at: string; // Fecha de actualización (ISO date)
}

/** Fetch paginated list of bot configurations. */
export async function getPlans(): Promise<Plan[]> {
    const url = new URL(`${BASE_URL}/plans`);
    const resp = await fetchWithCsrf<{ data: Plan[] }>(url.toString());
    return resp.data;
}

export async function updateSuscription(
    planId: number,
    interval: "month" | "year" = "month"
): Promise<void> {
    const url = new URL(`${BASE_URL}/plans/${planId}/subscribe`);
    await fetchWithCsrf(url.toString(), {
        method: "POST",
        body: JSON.stringify({ interval }),
        headers: {
            "Content-Type": "application/json",
        },
    });
}

export async function getActiveSuscription(): Promise<{ data: Subscription | null }> {
    const url = new URL(`${BASE_URL}/plans/subscription`);
    const resp = await fetchWithCsrf<{ data: Subscription | null }>(url.toString());
    return resp;
}