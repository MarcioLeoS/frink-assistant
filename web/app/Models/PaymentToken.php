<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PaymentToken extends Model
{
    protected $fillable = ['subscription_id', 'token'];
}
