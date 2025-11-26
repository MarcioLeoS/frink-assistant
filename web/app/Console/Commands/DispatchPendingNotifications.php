<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Jobs\SendPendingNotifications;

class DispatchPendingNotifications extends Command
{
    protected $signature = 'notifications:dispatch-pending';
    protected $description = 'Despacha el job para enviar notificaciones pendientes por email';

    public function handle()
    {
        dispatch(new SendPendingNotifications());
        $this->info('Job SendPendingNotifications despachado.');
    }
}
