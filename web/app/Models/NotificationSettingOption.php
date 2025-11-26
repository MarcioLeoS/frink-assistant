<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class NotificationSettingOption extends Model
{
    use HasFactory;

    protected $table = 'notifications_settings_options';

    protected $fillable = [
        'name',
        'active',
        'type',
        'description',
        'notification_setting_id',
    ];

    protected $casts = [
        'active' => 'boolean',
    ];

    /**
     * Tipos de opciones disponibles
     */
    const TYPES = [
        'email' => 'email',
        'sms' => 'sms',
        'push' => 'push',
        'webhook' => 'webhook',
        'slack' => 'slack',
        'discord' => 'discord',
        'teams' => 'teams',
    ];

    /**
     * Relación con la configuración de notificaciones
     */
    public function notificationSetting(): BelongsTo
    {
        return $this->belongsTo(NotificationSetting::class);
    }

    /**
     * Relación con las notificaciones
     */
    public function notifications(): HasMany
    {
        return $this->hasMany(Notification::class);
    }

    /**
     * Scope para opciones activas
     */
    public function scopeActive($query)
    {
        return $query->where('active', true);
    }

    /**
     * Scope para filtrar por tipo
     */
    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }
}