<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RealPersonRequest extends Model
{
    protected $table = 'real_person_requests';

    protected $fillable = [
        'viewed_at',
        'taken_at',
        'resolved_at',
        'agent_id',
        'question',
        'response',
        'status',
        'created_at',
        'updated_at',
        'observations',
    ];

    protected $casts = [
        'viewed_at' => 'date:d/m/Y H:i:s',
        'taken_at' => 'date:d/m/Y H:i:s',
        'resolved_at' => 'date:d/m/Y H:i:s',
    ];

    /**
     * The agent (user) assigned to this request.
     */
    public function agent()
    {
        return $this->belongsTo(User::class, 'agent_id');
    }

    /**
     * The customer who made this request.
     */
    public function customer()
    {
        return $this->belongsTo(Customer::class, 'customer_id');
    }
}
