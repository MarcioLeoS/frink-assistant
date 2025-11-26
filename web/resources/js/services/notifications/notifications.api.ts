import { fetchWithCsrf } from "../http";
import { BASE_URL } from "../../config/env";

export interface NotificationSetting {
    id: number;
    name: string;
    type: string;
    description: string;
    enabled: boolean;
    options: NotificationSettingOption[];
}

export interface NotificationSettingOption {
    id: number;
    name: string;
    type: string;
    description: string;
    active: boolean;
    setting?: {
        id: number;
        name: string;
        type: string;
    };
}

export interface NotificationItem {
    id: number;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    status: 'pending' | 'sent' | 'failed';
    sector: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    module?: string;
    redirect_url?: string;
    meta?: Record<string, any>;
    read: boolean;
    seen: boolean;
    created_at: string;
    updated_at: string;
    setting_option?: NotificationSettingOption;
}

export interface NotificationStats {
    total: number;
    unread: number;
    unseen: number;
    read: number;
    seen: number;
}

export interface NotificationsResponse {
    notifications: NotificationItem[];
    stats: NotificationStats;
}

export interface NotificationFilters {
    type?: string;
    status?: string;
    sector?: string;
    severity?: string;
    read?: boolean;
    seen?: boolean;
    recent_days?: number;
}

/** Obtener todos los tipos de notificaciones con sus opciones */
export async function getNotificationTypes(): Promise<NotificationSetting[]> {
    const url = new URL(`${BASE_URL}/notifications/types`);
    const resp = await fetchWithCsrf<{ data: NotificationSetting[] }>(url.toString());
    return resp.data;
}

/** Obtener opciones de notificación por tipo */
export async function getNotificationOptionsByType(type: string): Promise<NotificationSettingOption[]> {
    const url = new URL(`${BASE_URL}/notifications/types/${type}/options`);
    const resp = await fetchWithCsrf<{ data: NotificationSettingOption[] }>(url.toString());
    return resp.data;
}

/** Obtener notificaciones del usuario */
export async function getNotifications(filters?: NotificationFilters): Promise<NotificationsResponse> {
    const url = new URL(`${BASE_URL}/notifications/l`);

    // Agregar filtros como query parameters
    if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                url.searchParams.append(key, value.toString());
            }
        });
    }

    const resp = await fetchWithCsrf<{ data: NotificationsResponse }>(url.toString());
    return resp.data;
}

/** Marcar notificación como leída */
export async function markNotificationAsRead(id: number): Promise<void> {
    const url = new URL(`${BASE_URL}/notifications/${id}/read`);
    await fetchWithCsrf(url.toString(), {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
    });
}

/** Marcar notificación como vista */
export async function markNotificationAsSeen(id: number): Promise<void> {
    const url = new URL(`${BASE_URL}/notifications/${id}/seen`);
    await fetchWithCsrf(url.toString(), {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
    });
}

/** Marcar todas las notificaciones como leídas */
export async function markAllNotificationsAsRead(): Promise<void> {
    const url = new URL(`${BASE_URL}/notifications/mark-all-read`);
    await fetchWithCsrf(url.toString(), {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
    });
}

/** Crear nueva notificación */
export async function createNotification(data: {
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    severity?: 'low' | 'medium' | 'high' | 'critical';
    sector?: string;
    module?: string;
    redirect_url?: string;
    meta?: Record<string, any>;
}): Promise<NotificationItem> {
    const url = new URL(`${BASE_URL}/notifications/create`);
    const resp = await fetchWithCsrf<{ data: NotificationItem }>(url.toString(), {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        },
    });
    return resp.data;
}

export async function saveUserNotificationPreference(optionId: number, enabled: boolean): Promise<void> {
    const url = new URL(`${BASE_URL}/notifications/preference`);
    await fetchWithCsrf(url.toString(), {
        method: "POST",
        body: JSON.stringify({
            notification_setting_option_id: optionId,
            enabled,
        }),
        headers: {
            "Content-Type": "application/json",
        },
    });
}

export async function saveNotificationChannel(type: string, enabled: boolean): Promise<void> {
    const url = new URL(`${BASE_URL}/notifications/channel`);
    await fetchWithCsrf(url.toString(), {
        method: "POST",
        body: JSON.stringify({
            type,
            enabled,
        }),
        headers: {
            "Content-Type": "application/json",
        },
    });
}

export async function saveEmailConfig(config: Record<string, string>): Promise<void> {
    const url = new URL(`${BASE_URL}/notifications/email-config`);

    await fetchWithCsrf(url.toString(), {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest",
            "X-CSRF-TOKEN": (window as any).csrfToken,
        },
        body: JSON.stringify(config),
    });
}

export async function testEmail(testEmailTo: string) {
    const url = new URL(`${BASE_URL}/notifications/test-email`);

    await fetchWithCsrf(url.toString(), {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest",
            "X-CSRF-TOKEN": (window as any).csrfToken,
        },
        body: JSON.stringify({
            to: testEmailTo,
        }),
    });
}