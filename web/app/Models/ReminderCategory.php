<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;


class ReminderCategory extends Model
{
    protected $table = 'reminder_categories';

    protected $fillable = [
        'title',
        'description',
        'color_code',
        'observation'
    ];

    public function reminders()
    {
        return $this->hasMany(Reminder::class);
    }
}