<?php

namespace App\Services\Notification;

use App\Models\Notification;
use App\Models\NotificationSettingOption;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class NotificationFactory
{
    /**
     * Crear una notificación
     */
    public static function create(array $data): ?Notification
    {
        try {
            // Validar datos requeridos
            $validated = self::validateData($data);

            // Crear la notificación
            $notification = Notification::create($validated);

            // Log de la creación
            Log::info('Notification created', [
                'notification_id' => $notification->id,
                'type' => $notification->type,
                'sector' => $notification->sector,
            ]);

            return $notification;
        } catch (\Exception $e) {
            Log::error('Error creating notification', [
                'error' => $e->getMessage(),
                'data' => $data,
            ]);

            return null;
        }
    }

    /**
     * Crear notificación de información
     */
    public static function createInfo(string $title, string $message, array $options = []): ?Notification
    {
        return self::create(array_merge([
            'title' => $title,
            'message' => $message,
            'type' => 'info',
            'severity' => 'low',
            'sector' => 'general',
        ], $options));
    }

    /**
     * Crear notificación de éxito
     */
    public static function createSuccess(string $title, string $message, array $options = []): ?Notification
    {
        return self::create(array_merge([
            'title' => $title,
            'message' => $message,
            'type' => 'success',
            'severity' => 'low',
            'sector' => 'general',
        ], $options));
    }

    /**
     * Crear notificación de advertencia
     */
    public static function createWarning(string $title, string $message, array $options = []): ?Notification
    {
        return self::create(array_merge([
            'title' => $title,
            'message' => $message,
            'type' => 'warning',
            'severity' => 'medium',
            'sector' => 'system',
        ], $options));
    }

    /**
     * Crear notificación de error
     */
    public static function createError(string $title, string $message, array $options = []): ?Notification
    {
        return self::create(array_merge([
            'title' => $title,
            'message' => $message,
            'type' => 'error',
            'severity' => 'high',
            'sector' => 'system',
        ], $options));
    }

    /**
     * Crear notificación crítica
     */
    public static function createCritical(string $title, string $message, array $options = []): ?Notification
    {
        return self::create(array_merge([
            'title' => $title,
            'message' => $message,
            'type' => 'error',
            'severity' => 'critical',
            'sector' => 'system',
        ], $options));
    }

    /**
     * Crear notificación de pago
     */
    public static function createPayment(string $title, string $message, array $options = []): ?Notification
    {
        return self::create(array_merge([
            'title' => $title,
            'message' => $message,
            'type' => 'info',
            'severity' => 'medium',
            'sector' => 'payments',
        ], $options));
    }

    /**
     * Crear notificación de ticket
     */
    public static function createTicket(string $title, string $message, array $options = []): ?Notification
    {
        return self::create(array_merge([
            'title' => $title,
            'message' => $message,
            'type' => 'info',
            'severity' => 'medium',
            'sector' => 'tickets',
        ], $options));
    }

    /**
     * Crear notificación de cliente
     */
    public static function createCustomer(string $title, string $message, array $options = []): ?Notification
    {
        return self::create(array_merge([
            'title' => $title,
            'message' => $message,
            'type' => 'info',
            'severity' => 'medium',
            'sector' => 'customers',
        ], $options));
    }

    /**
     * Validar datos de entrada
     */
    private static function validateData(array $data): array
    {
        $required = ['title', 'message', 'type'];

        foreach ($required as $field) {
            if (!isset($data[$field])) {
                throw new \InvalidArgumentException("Field {$field} is required");
            }
        }

        // Validar tipos
        if (!in_array($data['type'], array_keys(Notification::TYPES))) {
            throw new \InvalidArgumentException("Invalid notification type: {$data['type']}");
        }

        if (isset($data['status']) && !in_array($data['status'], array_keys(Notification::STATUSES))) {
            throw new \InvalidArgumentException("Invalid notification status: {$data['status']}");
        }

        if (isset($data['sector']) && !in_array($data['sector'], array_keys(Notification::SECTORS))) {
            throw new \InvalidArgumentException("Invalid notification sector: {$data['sector']}");
        }

        if (isset($data['severity']) && !in_array($data['severity'], array_keys(Notification::SEVERITIES))) {
            throw new \InvalidArgumentException("Invalid notification severity: {$data['severity']}");
        }

        // Valores por defecto
        $defaults = [
            'status' => 'pending',
            'sector' => 'general',
            'severity' => 'medium',
            'read' => false,
            'seen' => false,
        ];

        return array_merge($defaults, $data);
    }
}
