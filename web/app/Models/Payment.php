<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Subscription;

class Payment extends Model
{
    protected $fillable = [
        'subscription_id',
        'amount_cents',
        'currency',
        'mp_payment_id',
        'status',
        'raw',
        'billing_email'
    ];
    protected $casts = ['raw' => 'array'];
    public function subscription()
    {
        return $this->belongsTo(Subscription::class);
    }
}
