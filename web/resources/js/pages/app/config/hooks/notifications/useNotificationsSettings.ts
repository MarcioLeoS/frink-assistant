import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
    getNotificationTypes,
    NotificationSetting,
    NotificationSettingOption,
    saveUserNotificationPreference,
    saveNotificationChannel
} from "@/services/notifications/notifications.api";

export function useNotificationSettings() {
    const [settings, setSettings] = useState<NotificationSetting[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Estados para la configuración de la UI
    const [enabledChannels, setEnabledChannels] = useState<Record<string, boolean>>({});
    const [preferences, setPreferences] = useState<Record<string, boolean>>({});

    const fetchSettings = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getNotificationTypes();
            setSettings(data);

            // Inicializar estados de los canales habilitados
            const channelsState: Record<string, boolean> = {};
            const prefsState: Record<string, boolean> = {};

            data.forEach(setting => {
                channelsState[setting.type] = setting.enabled;
                setting.options.forEach(option => {
                    prefsState[option.id.toString()] = option.active ?? false;
                });
            });

            setEnabledChannels(channelsState);
            setPreferences(prefsState);
        } catch (err: any) {
            const errorMessage = err.message || "Failed to fetch notification settings";
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    const toggleChannel = useCallback((type: string) => {
        setEnabledChannels(prev => {
            const newValue = !prev[type];
            saveNotificationChannel(type, newValue).catch(() => {
                toast.error("No se pudo guardar el estado del canal");
            });
            return {
                ...prev,
                [type]: newValue,
            };
        });
    }, []);

    const togglePreference = useCallback(async (optionId: string) => {
        setPreferences(prev => {
            const newValue = !prev[optionId];
            saveUserNotificationPreference(Number(optionId), newValue).catch(() => {
                toast.error("No se pudo guardar la preferencia");
            });
            return {
                ...prev,
                [optionId]: newValue,
            };
        });
    }, []);

    const getOptionsByType = useCallback((type: string): NotificationSettingOption[] => {
        const setting = settings.find(s => s.type === type);
        return setting?.options || [];
    }, [settings]);

    const isChannelEnabled = useCallback((type: string): boolean => {
        return enabledChannels[type] || false;
    }, [enabledChannels]);

    const isPreferenceEnabled = useCallback((optionId: string): boolean => {
        return preferences[optionId] || false;
    }, [preferences]);

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    return {
        settings,
        loading,
        error,
        enabledChannels,
        preferences,
        toggleChannel,
        togglePreference,
        getOptionsByType,
        isChannelEnabled,
        isPreferenceEnabled,
        refetch: fetchSettings,
    };
}