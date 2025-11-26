<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Plan extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'active',
        'order',
        'slug',
        'price',
        'currency',
        'interval',
        'trial_days',
        'interval_count',
        'interval_unit',
        'created_at',
        'updated_at',
    ];

    /* --- Relaciones --- */
    public function features()
    {
        return $this->belongsToMany(Feature::class, 'plan_feature')->withPivot('value');
    }

    public function subscriptions()
    {
        return $this->hasMany(Subscription::class);
    }
}
