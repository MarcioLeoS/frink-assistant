import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
    getNotificationTypes,
    getNotificationOptionsByType,
    NotificationSetting,
    NotificationSettingOption,
} from "@/services/notifications/notifications.api";

export function useNotificationTypes() {
    const [types, setTypes] = useState<NotificationSetting[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTypes = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getNotificationTypes();
            setTypes(data);
        } catch (err: any) {
            const errorMessage = err.message || "Failed to fetch notification types";
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTypes();
    }, [fetchTypes]);

    return {
        types,
        loading,
        error,
        refetch: fetchTypes,
    };
}

export function useNotificationOptionsByType(type: string) {
    const [options, setOptions] = useState<NotificationSettingOption[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchOptions = useCallback(async () => {
        if (!type) {
            setOptions([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const data = await getNotificationOptionsByType(type);
            setOptions(data);
        } catch (err: any) {
            const errorMessage = err.message || "Failed to fetch notification options";
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [type]);

    useEffect(() => {
        fetchOptions();
    }, [fetchOptions]);

    return {
        options,
        loading,
        error,
        refetch: fetchOptions,
    };
}