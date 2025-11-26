import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
    getUserNotifications,
    markNotificationAsRead,
    markNotificationAsSeen,
    markAllNotificationsAsRead,
    NotificationItem,
    NotificationStats,
    NotificationFilters,
} from "@/services/notifications/notifications.api";

export function useUserNotifications(filters?: NotificationFilters) {
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [stats, setStats] = useState<NotificationStats>({
        total: 0,
        unread: 0,
        unseen: 0,
        read: 0,
        seen: 0,
    });
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchNotifications = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getUserNotifications(filters);
            setNotifications(data.notifications);
            setStats(data.stats);
        } catch (err: any) {
            const errorMessage = err.message || "Failed to fetch notifications";
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    const markAsRead = useCallback(async (id: number) => {
        try {
            await markNotificationAsRead(id);
            setNotifications(prev => 
                prev.map(notification => 
                    notification.id === id 
                        ? { ...notification, read: true }
                        : notification
                )
            );
            setStats(prev => ({
                ...prev,
                unread: prev.unread - 1,
                read: prev.read + 1,
            }));
            toast.success("Notification marked as read");
        } catch (err: any) {
            toast.error(err.message || "Failed to mark notification as read");
        }
    }, []);

    const markAsSeen = useCallback(async (id: number) => {
        try {
            await markNotificationAsSeen(id);
            setNotifications(prev => 
                prev.map(notification => 
                    notification.id === id 
                        ? { ...notification, seen: true }
                        : notification
                )
            );
            setStats(prev => ({
                ...prev,
                unseen: prev.unseen - 1,
                seen: prev.seen + 1,
            }));
        } catch (err: any) {
            toast.error(err.message || "Failed to mark notification as seen");
        }
    }, []);

    const markAllAsRead = useCallback(async () => {
        try {
            await markAllNotificationsAsRead();
            setNotifications(prev => 
                prev.map(notification => ({ ...notification, read: true }))
            );
            setStats(prev => ({
                ...prev,
                unread: 0,
                read: prev.total,
            }));
            toast.success("All notifications marked as read");
        } catch (err: any) {
            toast.error(err.message || "Failed to mark all notifications as read");
        }
    }, []);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    return {
        notifications,
        stats,
        loading,
        error,
        markAsRead,
        markAsSeen,
        markAllAsRead,
        refetch: fetchNotifications,
    };
}