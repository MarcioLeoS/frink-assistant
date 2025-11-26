<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Roles>
 */
class RolesFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => 'Administrador',
            'description' => 'Los usuarios administradores tienen acceso completo al sistema. Por defecto, reciben notificaciones de eventos de pago',
            'is_active' => true
        ];
    }
}
