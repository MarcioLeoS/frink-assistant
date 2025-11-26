<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TicketFile extends Model
{
    protected $table = 'ticket_files';

    protected $fillable = [
        'ticket_id',
        'filename',
        'path',
    ];

    public function ticket()
    {
        return $this->belongsTo(Ticket::class);
    }
}
