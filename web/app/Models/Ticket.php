<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ticket extends Model
{
    protected $table = 'tickets';
    protected $fillable = [
        'customer_id',
        'chat_context_id',
        'status',               // Valores: open, in_progress, resolved, closed
        'bot_contacted',
        'urgency',              // Valores: low, medium, high
        'problem_type',
        'problem_description',
        'resolution_description',
        'asigned_to',
        'resolved_at',
        'escalated'
    ];

    protected $casts = [
        'bot_contacted' => 'boolean',
        'escalated'     => 'boolean',
        'created_at'    => 'datetime:d/m/Y H:i',
        'resolved_at'   => 'datetime:d/m/Y H:i',
        'updated_at'    => 'datetime:d/m/Y H:i',
    ];

    // Relaciones

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function chatContext()
    {
        return $this->belongsTo(ChatContext::class);
    }

    public function followUps()
    {
        return $this->hasMany(TicketFollowUp::class);
    }

    public function documents()
    {
        return $this->hasMany(TicketDocument::class);
    }

    public function files()
    {
        return $this->hasMany(TicketFile::class);
    }

    public function scopeFromLastHours($query, int $hours = 48): void
    {
        $query->where('created_at', '>=', now()->subHours($hours));
    }
}
