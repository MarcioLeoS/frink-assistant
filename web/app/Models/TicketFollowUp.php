<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TicketFollowUp extends Model
{
    protected $table = 'ticket_follow_ups';

    protected $fillable = [
        'ticket_id',
        'notes',
        'follow_up_at',
        'created_by'
    ];

    protected $casts = [
        'follow_up_at' => 'datetime',
    ];

    public function ticket()
    {
        return $this->belongsTo(Ticket::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

}
