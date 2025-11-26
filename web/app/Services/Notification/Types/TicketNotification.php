<?php

namespace App\Services\Notification\Types;

use App\Services\Notification\NotificationFactory;

class TicketNotification
{
    public static function create(string $title, string $message, array $options = []): ?\App\Models\Notification
    {
        return NotificationFactory::createTicket($title, $message, $options);
    }
}