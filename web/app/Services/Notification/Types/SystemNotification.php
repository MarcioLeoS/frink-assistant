<?php

namespace App\Services\Notification\Types;

use App\Services\Notification\NotificationFactory;

class SystemNotification
{
    public static function create(string $title, string $message, array $options = []): ?\App\Models\Notification
    {
        return NotificationFactory::createPayment($title, $message, $options);
    }
}