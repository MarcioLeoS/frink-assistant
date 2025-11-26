<?php

namespace App\Http\Controllers\Notifications;

use App\Http\Controllers\Controller;
use App\Services\Notification\NotificationService;
use App\Services\Notification\NotificationFactory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\UserNotificationPreference;
use App\Models\NotificationSetting;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Mail;
use App\Services\Notification\Types\SystemNotification;

class NotificationController extends Controller
{
    protected $notificationService;
    protected $systemNotification;

    public function __construct(NotificationService $notificationService, SystemNotification $systemNotification)
    {
        $this->notificationService = $notificationService;
        $this->systemNotification = $systemNotification;
    }

    public function getNotifications(Request $request)
    {
        $filters = $request->only([
            'type',
            'status',
            'sector',
            'severity',
            'read',
            'seen',
            'recent_days',
        ]);

        $notifications = $this->notificationService->getNotifications($filters);

        return response()->json([
            'success' => true,
            'data' => $notifications,
        ]);
    }

    /**
     * Mostrar tipos de notificaciones con opciones
     */
    public function getTypes()
    {
        $types = $this->notificationService->getNotificationTypesWithOptions();

        return response()->json([
            'success' => true,
            'data' => $types,
        ]);
    }

    /**
     * Obtener opciones por tipo
     */
    public function getOptionsByType(string $type)
    {
        $options = $this->notificationService->getNotificationOptionsByType($type);

        return response()->json([
            'success' => true,
            'data' => $options,
        ]);
    }

    /**
     * Marcar notificación como leída
     */
    public function markAsRead(int $id)
    {
        $result = $this->notificationService->markAsRead($id, Auth::id());

        return response()->json([
            'success' => $result,
            'message' => $result ? 'Notification marked as read' : 'Notification not found',
        ]);
    }

    /**
     * Marcar notificación como vista
     */
    public function markAsSeen(int $id)
    {
        $result = $this->notificationService->markAsSeen($id, Auth::id());

        return response()->json([
            'success' => $result,
            'message' => $result ? 'Notification marked as seen' : 'Notification not found',
        ]);
    }

    /**
     * Marcar todas como leídas
     */
    public function markAllAsRead()
    {
        $result = $this->notificationService->markAllAsRead(Auth::id());

        return response()->json([
            'success' => true,
            'message' => 'All notifications marked as read',
        ]);
    }

    /**
     * Crear notificación (ejemplo)
     */
    public function create(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'message' => 'required|string',
            'type' => 'required|in:info,success,warning,error',
            'severity' => 'nullable|in:low,medium,high,critical',
            'sector' => 'nullable|in:general,user,system,customers,model,tickets,payments',
            'module' => 'nullable|string|max:255',
            'redirect_url' => 'nullable|url',
            'meta' => 'nullable|array',
        ]);

        $notification = NotificationFactory::create(array_merge(
            $request->all(),
            ['user_id' => Auth::id()]
        ));

        if (!$notification) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create notification',
            ], 500);
        }

        return response()->json([
            'success' => true,
            'message' => 'Notification created successfully',
            'data' => $notification,
        ]);
    }

    public function savePreference(Request $request)
    {
        $request->validate([
            'notification_setting_option_id' => 'required|exists:notifications_settings_options,id',
            'enabled' => 'required|boolean',
        ]);

        $option = \App\Models\NotificationSettingOption::findOrFail($request->notification_setting_option_id);
        $option->active = $request->enabled;
        $option->save();

        return response()->json([
            'success' => true,
            'data' => $option,
        ]);
    }

    public function saveChannel(Request $request)
    {
        $request->validate([
            'type' => 'required|string|exists:notifications_settings,type',
            'enabled' => 'required|boolean',
        ]);

        $setting = \App\Models\NotificationSetting::where('type', $request->type)->firstOrFail();
        $setting->enabled = $request->enabled;
        $setting->save();

        return response()->json([
            'success' => true,
            'data' => $setting,
        ]);
    }

    public function saveEmailConfig(Request $request)
    {
        $request->validate([
            'MAIL_MAILER' => 'required|string',
            'MAIL_SCHEME' => 'nullable|string',
            'MAIL_HOST' => 'required|string',
            'MAIL_PORT' => 'required|string',
            'MAIL_USERNAME' => 'nullable|string',
            'MAIL_PASSWORD' => 'nullable|string',
            'MAIL_FROM_ADDRESS' => 'required|string',
            'MAIL_FROM_NAME' => 'required|string',
        ]);

        $setting = \App\Models\NotificationSetting::where('type', 'email')->firstOrFail();

        // Puedes guardar los datos en columnas específicas o en el campo 'config' (json)
        $setting->config = [
            'MAIL_MAILER' => $request->MAIL_MAILER,
            'MAIL_SCHEME' => $request->MAIL_SCHEME,
            'MAIL_HOST' => $request->MAIL_HOST,
            'MAIL_PORT' => $request->MAIL_PORT,
            'MAIL_USERNAME' => $request->MAIL_USERNAME,
            'MAIL_PASSWORD' => $request->MAIL_PASSWORD,
            'MAIL_FROM_ADDRESS' => $request->MAIL_FROM_ADDRESS,
            'MAIL_FROM_NAME' => $request->MAIL_FROM_NAME,
        ];
        $setting->save();

        //Notify the user about the email configuration
        SystemNotification::create(
            'Configuración de Email Actualizada',
            'La configuración de email ha sido actualizada correctamente.',
            ['sector' => 'system']
        );

        return response()->json([
            'success' => true,
            'data' => $setting->config,
        ]);
    }

    public function testEmail(Request $request)
    {
        $request->validate([
            'to' => 'required|email',
        ]);

        $setting = \App\Models\NotificationSetting::where('type', 'email')->firstOrFail();
        $config = $setting->config ?? [];

        try {
            config([
                'mail.mailers.test' => [
                    'transport' => $config['MAIL_MAILER'] ?? 'log',
                    'host' => $config['MAIL_HOST'] ?? '127.0.0.1',
                    'port' => $config['MAIL_PORT'] ?? 2525,
                    'encryption' => $config['MAIL_SCHEME'] ?? null,
                    'username' => $config['MAIL_USERNAME'] ?? null,
                    'password' => $config['MAIL_PASSWORD'] ?? null,
                ],
                'mail.from.address' => $config['MAIL_FROM_ADDRESS'] ?? 'hello@example.com',
                'mail.from.name' => $config['MAIL_FROM_NAME'] ?? 'Frink Assistant',
                'mail.default' => 'test',
            ]);

            Mail::raw('Este es un correo de prueba de Frink Assistant.', function ($message) use ($request) {
                $message->to($request->to)
                    ->subject('Prueba de email');
            });

            return response()->json([
                'success' => true,
                'message' => '¡Correo de prueba enviado correctamente!',
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al enviar el correo de prueba: ' . $e->getMessage(),
            ], 500);
        }
    }
}
