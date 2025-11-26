<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

use App\Models\Notification;
use App\Models\User;

class EmailNotification extends Mailable
{
    use Queueable, SerializesModels;

    public Notification $notification;
    public User $user;

    public function __construct(Notification $notification, User $user)
    {
        $this->notification = $notification;
        $this->user = $user;
    }

    public function build()
    {
        return $this->subject($this->notification->title)
            ->view('emails.notification')
            ->with([
                'notification' => $this->notification,
                'user' => $this->user
            ]);
    }
}
