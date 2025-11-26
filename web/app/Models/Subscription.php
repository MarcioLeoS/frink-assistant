<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subscription extends Model
{
    use HasFactory;

    protected $fillable = [
        'plan_id','provider_sub_id',
        'status','next_renewal','canceled_at',
    ];

    protected $casts = [
        'next_renewal' => 'date',
        'canceled_at'  => 'datetime',
    ];

    /* Relaciones */
    public function plan()        { return $this->belongsTo(Plan::class); }
    public function payments()    { return $this->hasMany(Payment::class); }

    /* Helpers */
    public function isActive(): bool
    {
        return $this->status === 'active';
    }
}
