<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

use App\Models\User;

class BotConfig extends Model
{
    use SoftDeletes;
    // Si la tabla se llama exactamente 'bot_config'
    protected $table = 'bot_configs';

    // Laravel maneja automáticamente created_at y updated_at
    protected $fillable = [
        'long_prompt',
        'short_prompt',
        'bot_type',
        'bot_name',
        'bot_description',
        'user_id',
        'created_at',
        'updated_at',
    ];

    /**
     * Define the relationship with the User model.
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
