<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FollowUp extends Model
{
    use HasFactory;

    protected $table = 'follow_ups';

    protected $fillable = [
        'follow_up_date',
        'status',
        'notes',
        'customer_id',
        'conversation_id',
        'is_awaiting_reschedule_date',
    ];

    protected $casts = [
        'follow_up_date'                => 'datetime',
        'is_awaiting_reschedule_date'   => 'boolean',
    ];

    public $timestamps = true;

    public function customer()
    {
        return $this->belongsTo(Customer::class, 'customer_id');
    }

    public function conversation()
    {
        return $this->belongsTo(Conversation::class, 'conversation_id');
    }

    public function reminder()
    {
        return $this->hasOne(Reminder::class, 'follow_up_id');
    }
}
