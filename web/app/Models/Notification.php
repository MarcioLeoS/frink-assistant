<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Notification extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'message',
        'type',
        'read',
        'status',
        'sector',
        'severity',
        'module',
        'redirect_url',
        'meta',
        'seen',
        'user_id',
        'role_id',
        'notification_setting_option_id',
    ];

    protected $casts = [
        'read' => 'boolean',
        'seen' => 'boolean',
        'meta' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Tipos de notificación disponibles
     */
    const TYPES = [
        'info' => 'info',
        'warning' => 'warning',
        'error' => 'error',
        'success' => 'success',
    ];

    /**
     * Estados de notificación disponibles
     */
    const STATUSES = [
        'pending' => 'pending',
        'sent' => 'sent',
        'failed' => 'failed',
    ];

    /**
     * Sectores de notificación disponibles
     */
    const SECTORS = [
        'general' => 'general',
        'user' => 'user',
        'system' => 'system',
        'customers' => 'customers',
        'model' => 'model',
        'tickets' => 'tickets',
        'payments' => 'payments',
    ];

    /**
     * Severidades de notificación disponibles
     */
    const SEVERITIES = [
        'low' => 'low',
        'medium' => 'medium',
        'high' => 'high',
        'critical' => 'critical',
    ];

    /**
     * Relación con el usuario
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relación con el rol
     */
    public function role(): BelongsTo
    {
        return $this->belongsTo(Roles::class);
    }

    /**
     * Relación con la opción de configuración de notificaciones
     */
    public function notificationSettingOption(): BelongsTo
    {
        return $this->belongsTo(NotificationSettingOption::class);
    }

    /**
     * Scope para notificaciones no leídas
     */
    public function scopeUnread($query)
    {
        return $query->where('read', false);
    }

    /**
     * Scope para notificaciones leídas
     */
    public function scopeRead($query)
    {
        return $query->where('read', true);
    }

    /**
     * Scope para notificaciones no vistas
     */
    public function scopeUnseen($query)
    {
        return $query->where('seen', false);
    }

    /**
     * Scope para notificaciones vistas
     */
    public function scopeSeen($query)
    {
        return $query->where('seen', true);
    }

    /**
     * Scope para filtrar por tipo
     */
    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }

    /**
     * Scope para filtrar por estado
     */
    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope para filtrar por sector
     */
    public function scopeBySector($query, $sector)
    {
        return $query->where('sector', $sector);
    }

    /**
     * Scope para filtrar por severidad
     */
    public function scopeBySeverity($query, $severity)
    {
        return $query->where('severity', $severity);
    }

    /**
     * Scope para filtrar por módulo
     */
    public function scopeByModule($query, $module)
    {
        return $query->where('module', $module);
    }

    /**
     * Scope para filtrar por usuario
     */
    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    /**
     * Scope para notificaciones recientes
     */
    public function scopeRecent($query, $days = 30)
    {
        return $query->where('created_at', '>=', now()->subDays($days));
    }

    /**
     * Marcar la notificación como leída
     */
    public function markAsRead(): bool
    {
        return $this->update(['read' => true]);
    }

    /**
     * Marcar la notificación como no leída
     */
    public function markAsUnread(): bool
    {
        return $this->update(['read' => false]);
    }

    /**
     * Marcar la notificación como vista
     */
    public function markAsSeen(): bool
    {
        return $this->update(['seen' => true]);
    }

    /**
     * Marcar la notificación como no vista
     */
    public function markAsUnseen(): bool
    {
        return $this->update(['seen' => false]);
    }

    /**
     * Verificar si la notificación está leída
     */
    public function isRead(): bool
    {
        return $this->read;
    }

    /**
     * Verificar si la notificación está sin leer
     */
    public function isUnread(): bool
    {
        return !$this->read;
    }

    /**
     * Verificar si la notificación está vista
     */
    public function isSeen(): bool
    {
        return $this->seen;
    }

    /**
     * Verificar si la notificación está sin ver
     */
    public function isUnseen(): bool
    {
        return !$this->seen;
    }
}