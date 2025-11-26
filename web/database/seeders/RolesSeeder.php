<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Roles;

class RolesSeeder extends Seeder
{
    public function run(): void
    {
        Roles::firstOrCreate(
            ['name' => 'Administrador'],
            [
                'description' => 'Los usuarios administradores tienen acceso completo al sistema. Por defecto, reciben notificaciones de eventos de pago',
                'is_active'   => true,
            ]
        );
    }
}
