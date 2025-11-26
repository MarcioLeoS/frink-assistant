<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Roles extends Model
{
    use HasFactory;

    protected $table = 'roles';

    protected $fillable = [
        'name',
        'description',
        'is_active',
    ];

    /**
     * Relación muchos-a-muchos con usuarios
     */
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_roles', 'role_id', 'user_id');
    }

    /**
     * Scope para roles activos
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Verificar si es rol de administrador
     */
    public function isAdmin(): bool
    {
        return $this->name === 'admin';
    }

    /**
     * Obtener usuarios con este rol
     */
    public function getUsersWithRole()
    {
        return $this->users()->get();
    }
}
