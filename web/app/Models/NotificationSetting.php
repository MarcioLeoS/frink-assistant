<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class NotificationSetting extends Model
{
    use HasFactory;

    protected $table = 'notifications_settings';

    protected $fillable = [
        'name',
        'active',
        'description',
        'type',
        'enabled',
        'host',
        'port',
        'encryption',
        'username',
        'password',
        'from_address',
        'from_name',
        'api_key',
        'api_url',
        'sender_id',
        'config',
    ];

    protected $casts = [
        'active' => 'boolean',
        'enabled' => 'boolean',
        'port' => 'integer',
        'config' => 'array',
    ];

    /**
     * Tipos de canales disponibles
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
     * Relación con las opciones de configuración de notificaciones
     */
    public function options(): HasMany
    {
        return $this->hasMany(NotificationSettingOption::class);
    }

    /**
     * Scope para configuraciones activas
     */
    public function scopeActive($query)
    {
        return $query->where('active', true);
    }

    /**
     * Scope para configuraciones habilitadas
     */
    public function scopeEnabled($query)
    {
        return $query->where('enabled', true);
    }

    /**
     * Scope para filtrar por tipo
     */
    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }
}