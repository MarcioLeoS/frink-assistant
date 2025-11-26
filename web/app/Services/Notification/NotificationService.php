<?php

namespace App\Services\Notification;

use App\Models\NotificationSetting;
use App\Models\NotificationSettingOption;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Support\Collection;

class NotificationService
{
    /**
     * Obtener todos los tipos de notificaciones con sus opciones
     */
     public function getNotificationTypesWithOptions(): Collection
    {
        return NotificationSetting::with(['options'])
            ->active()
            ->enabled()
            ->get()
            ->map(function ($setting) {
                return [
                    'id' => $setting->id,
                    'name' => $setting->name,
                    'type' => $setting->type,
                    'description' => $setting->description,
                    'enabled' => $setting->enabled,
                    'options' => $setting->options->map(function ($option) {
                        return [
                            'id' => $option->id,
                            'name' => $option->name,
                            'type' => $option->type,
                            'description' => $option->description,
                            'active' => $option->active,
                        ];
                    }),
                ];
            });
    }

    /**
     * Obtener opciones de notificación por tipo
     */
    public function getNotificationOptionsByType(string $type): Collection
    {
        return NotificationSettingOption::whereHas('notificationSetting', function ($query) use ($type) {
            $query->where('type', $type)->active()->enabled();
        })
            ->active()
            ->get()
            ->map(function ($option) {
                return [
                    'id' => $option->id,
                    'name' => $option->name,
                    'type' => $option->type,
                    'description' => $option->description,
                    'setting' => [
                        'id' => $option->notificationSetting->id,
                        'name' => $option->notificationSetting->name,
                        'type' => $option->notificationSetting->type,
                    ],
                ];
            });
    }

    /**
     * Obtener notificaciones del usuario
     */
    public function getNotifications(array $filters = []): Collection
    {
        $query = Notification::with(['notificationSettingOption.notificationSetting'])
            ->orderBy('created_at', 'desc');

        // Aplicar filtros
        if (isset($filters['type'])) {
            $query->byType($filters['type']);
        }

        if (isset($filters['status'])) {
            $query->byStatus($filters['status']);
        }

        if (isset($filters['sector'])) {
            $query->bySector($filters['sector']);
        }

        if (isset($filters['severity'])) {
            $query->bySeverity($filters['severity']);
        }

        if (isset($filters['read'])) {
            $query->where('read', $filters['read']);
        }

        if (isset($filters['seen'])) {
            $query->where('seen', $filters['seen']);
        }

        if (isset($filters['recent_days'])) {
            $query->recent($filters['recent_days']);
        }

        return $query->get()->map(function ($notification) {
            return [
                'id' => $notification->id,
                'title' => $notification->title,
                'message' => $notification->message,
                'type' => $notification->type,
                'status' => $notification->status,
                'sector' => $notification->sector,
                'severity' => $notification->severity,
                'module' => $notification->module,
                'redirect_url' => $notification->redirect_url,
                'meta' => $notification->meta,
                'read' => $notification->read,
                'seen' => $notification->seen,
                'created_at' => $notification->created_at,
                'updated_at' => $notification->updated_at,
                'setting_option' => $notification->notificationSettingOption ? [
                    'id' => $notification->notificationSettingOption->id,
                    'name' => $notification->notificationSettingOption->name,
                    'type' => $notification->notificationSettingOption->type,
                ] : null,
            ];
        });
    }

    /**
     * Marcar notificación como leída
     */
    public function markAsRead(int $notificationId, int $userId): bool
    {
        $notification = Notification::where('id', $notificationId)
            ->first();

        if (!$notification) {
            return false;
        }

        return $notification->markAsRead();
    }

    /**
     * Marcar notificación como vista
     */
    public function markAsSeen(int $notificationId, int $userId): bool
    {
        $notification = Notification::where('id', $notificationId)
            ->first();

        if (!$notification) {
            return false;
        }

        return $notification->markAsSeen();
    }

    /**
     * Marcar todas las notificaciones como leídas
     */
    public function markAllAsRead(int $userId): bool
    {
        return Notification::unread()
            ->update(['read' => true]);
    }

    /**
     * Obtener estadísticas de notificaciones del usuario
     */
    public function getUserNotificationStats(int $userId): array
    {
        $total = Notification::where()->count();
        $unread = Notification::where()->unread()->count();
        $unseen = Notification::where()->unseen()->count();

        return [
            'total' => $total,
            'unread' => $unread,
            'unseen' => $unseen,
            'read' => $total - $unread,
            'seen' => $total - $unseen,
        ];
    }
}