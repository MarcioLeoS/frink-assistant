<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChatSummary extends Model
{
    protected $table = 'chat_summary';
    protected $fillable = [
        'summary',
        'chat_context_id',
        'customer_id',
    ];

    // Relaciones

    public function chatContext()
    {
        return $this->belongsTo(ChatContext::class);
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }
}
