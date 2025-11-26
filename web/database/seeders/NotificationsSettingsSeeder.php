<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Notification;
use App\Models\NotificationSetting;
use App\Models\NotificationSettingOption;

class NotificationsSettingsSeeder extends Seeder
{
    public function run(): void
    {
        // Configuración principal de Email
        $emailSetting = NotificationSetting::firstOrCreate(
            ['name' => 'Emails'],
            [
                'active' => 1,
                'description' => 'Configuración predeterminada de notificaciones por correo electrónico para todos los usuarios.',
                'type' => 'email',
                'enabled' => false,
                'host' => env('MAIL_HOST'),
                'port' => env('MAIL_PORT'),
                'encryption' => env('MAIL_ENCRYPTION'),
                'username' => env('MAIL_USERNAME'),
                'password' => env('MAIL_PASSWORD') ? encrypt(env('MAIL_PASSWORD')) : null,
                'from_address' => env('MAIL_FROM_ADDRESS'),
                'from_name' => env('MAIL_FROM_NAME'),
                'api_key' => null,
                'api_url' => null,
                'sender_id' => null,
                'config' => json_encode([
                    'timeout' => 30,
                    'retry_attempts' => 3,
                    'priority' => 'normal',
                    'template_engine' => 'blade',
                    'queue' => 'default',
                    'tracking' => true
                ])
            ]
        );

        // Opciones de notificación por email
        NotificationSettingOption::firstOrCreate(
            ['name' => 'Alertas'],
            [
                'active' => true,

                'description' => 'Recibir alertas por correo electrónico.',
                'notification_setting_id' => $emailSetting->id,
            ]
        );

        NotificationSettingOption::firstOrCreate(
            ['name' => 'Recordatorios de pago'],
            [
                'active' => true,
                'description' => 'Recibir recordatorios de pago por correo electrónico.',
                'notification_setting_id' => $emailSetting->id,
            ]
        );

        NotificationSettingOption::firstOrCreate(
            ['name' => 'ímite de mensajes'],
            [
                'active' => true,
                'description' => 'Recibir notificaciones cuando alcance su límite de mensajes.',
                'notification_setting_id' => $emailSetting->id,
            ]
        );

        NotificationSettingOption::firstOrCreate(
            ['name' => 'Actualizaciones del sistema'],
            [
                'active' => true,
                'description' => 'Recibir notificaciones de actualizaciones del sistema por correo electrónico.',
                'notification_setting_id' => $emailSetting->id,
            ]
        );

        NotificationSettingOption::firstOrCreate(
            ['name' => 'Notificaciones de clientes'],
            [
                'active' => true,
                'description' => 'Recibir notificaciones relacionadas con la actividad de los clientes.',
                'notification_setting_id' => $emailSetting->id,
            ]
        );

        NotificationSettingOption::firstOrCreate(
            ['name' => 'Notificaciones de tickets'],
            [
                'active' => true,
                'description' => 'Recibir notificaciones sobre nuevos tickets y actualizaciones de soporte.',
                'notification_setting_id' => $emailSetting->id,
            ]
        );
    }
}