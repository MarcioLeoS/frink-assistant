<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChatContext extends Model
{
    protected $table = 'chat_contexts';

    protected $fillable = [
        'message_content',
        'timestamp',
        'role',
        'sentiment',
        'customer_id',
        'conversation_id'
    ];

    protected $casts = [
        'timestamp' => 'datetime',
    ];

    // Relaciones

    // Relación muchos a uno con Customer
    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    // Relación muchos a uno con Conversation (opcional)
    public function conversation()
    {
        return $this->belongsTo(Conversation::class);
    }

    // Relación uno a muchos con Ticket
    public function tickets()
    {
        return $this->hasMany(Ticket::class);
    }

    // Relación uno a muchos con TicketMarketing
    public function ticketMarketings()
    {
        return $this->hasMany(TicketMarketing::class);
    }
}
