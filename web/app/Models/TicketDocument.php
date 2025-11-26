<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TicketDocument extends Model
{
    protected $table = 'ticket_documents';

    protected $fillable = [
        'ticket_id',
        'title',
        'markdown',
    ];

    public function ticket()
    {
        return $this->belongsTo(Ticket::class);
    }
}
