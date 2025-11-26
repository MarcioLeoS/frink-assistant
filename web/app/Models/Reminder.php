<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Reminder extends Model
{
    protected $table = 'reminders';
    protected $fillable = [
        'content',
        'remind_at',
        'notified',
        'source',
        'customer_id',
        'reminder_category_id',
        'description',
        'observation',
        'follow_up_id'
    ];

    protected $casts = [
        'remind_at'  => 'date:d/m/Y H:i:s',
        'notified'   => 'boolean',
        'created_at' => 'date:d/m/Y H:i:s',
    ];

    // Relación

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function category()
    {
        return $this->belongsTo(ReminderCategory::class, 'reminder_category_id');
    }

    public function followUp()
    {
        return $this->belongsTo(FollowUp::class, 'follow_up_id');
    }
}
