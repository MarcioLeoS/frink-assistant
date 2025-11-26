<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Mail\MailManager;
use Symfony\Component\Mailer\Transport\Smtp\EsmtpTransport;
use App\Models\NotificationsChannels;
use App\Services\Notification\SystemNotifier;

class DynamicMailServiceProvider extends ServiceProvider
{

    /**
     * Register and configure the custom dynamic-db-smtp mail transport.
     * This method is called when the service provider boots.
     * It adds a new mailer configuration that loads SMTP settings dynamically from the database,
     * allowing the application to send emails using credentials stored in the notifications_channels table.
     * @param MailManager $manager The mail manager instance to extend with the new transport.
     * @throws \RuntimeException If no active SMTP channel is found in the database.
     * @return void
     */
    public function boot(MailManager $manager): void
    {
        config([
            'mail.mailers.dynamic-db-smtp' => [
                'transport' => 'dynamic-db-smtp',
                'timeout'   => null,
            ],
        ]);

        $manager->extend('dynamic-db-smtp', function (array $config = []) {
            $channel = NotificationsChannels::where('type', 'mail')
                ->where('enabled', true)
                ->first();

            if (!$channel) {
                SystemNotifier::notifyMissingMailChannel();
                throw new \RuntimeException('No hay canal SMTP activo configurado.');
            }

            // Create a new SMTP transport using the channel's configuration
            $transport = new EsmtpTransport(
                $channel->host,
                $channel->port,
                $channel->encryption === 'ssl'
            );

            // If username is set, configure authentication for the transport
            if ($channel->username) {
                $transport->setUsername($channel->username);
                $transport->setPassword($channel->password);
            }

            // Return the configured transport instance
            return $transport;
        });
    }
}
