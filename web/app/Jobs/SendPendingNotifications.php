<?php

namespace App\Jobs;

use App\Models\Notification;
use App\Models\User;
use App\Mail\EmailNotification;
use App\Models\NotificationSetting;
use App\Services\Notification\Types\SystemNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Exception;

class SendPendingNotifications implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            $settings = NotificationSetting::where('type', 'email')->first();
            $config = $settings->config;

            config([
                'mail.mailers.custom' => [
                    'transport' => $config['MAIL_MAILER'] ?? 'log',
                    'host' => $config['MAIL_HOST'] ?? '127.0.0.1',
                    'port' => $config['MAIL_PORT'] ?? 2525,
                    'encryption' => $config['MAIL_SCHEME'] ?? null,
                    'username' => $config['MAIL_USERNAME'] ?? null,
                    'password' => $config['MAIL_PASSWORD'] ?? null,
                ],
                'mail.from.address' => $config['MAIL_FROM_ADDRESS'] ?? 'hello@example.com',
                'mail.from.name' => $config['MAIL_FROM_NAME'] ?? 'Frink Assistant',
                'mail.default' => 'custom',
            ]);

            $notifications = Notification::where('status', 'pending')->get();
            $users = User::all();

            if ($notifications->isEmpty()) {
                echo ('No notifications found');
                exit;
            }

            if ($users->isEmpty()) {
                echo ('No notifications found');
                exit;
            }

            foreach ($notifications as $notification) {
                try {
                    foreach ($users as $user) {
                        $email = $user->email;
                        Mail::to($email)->send(new EmailNotification($notification, $user));
                    }
                    $notification->status = 'sent';
                    $notification->save();
                } catch (Exception $e) {
                    $notification->status = 'failed';
                    $notification->save();
                }
            }
        } catch (Exception $e) {
            SystemNotification::create(
                'Error al enviar notificaciones vía email.',
                'La configuración de email es erronea y no permite enviar las notificaciones',
                ['sector' => 'system']
            );
            Log::error('Error sending email notifications: ' . $e->getMessage());
        }
    }
}
