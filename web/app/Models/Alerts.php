<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Alerts extends Model
{
    use HasFactory;

    protected $table = 'alerts';

    protected $fillable = [
        'type',
        'status',
        'urgency',
        'provider',
        'name',
        'description',
        'data',
        'error_message',
        'error_code',
    ];

    protected $casts = [
        'data' => 'array',
        'error_code' => 'integer',
    ];
}
