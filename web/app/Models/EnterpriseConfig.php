<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EnterpriseConfig extends Model
{
    protected $table = 'enterprise_configs';

    protected $fillable = [
        'enterprise_name',
        'enterprise_customer_name',
        'enterprise_customer_email',
        'enterprise_customer_phone',
        'enterprise_customer_address',
        'enterprise_customer_city',
        'enterprise_customer_state',
        'enterprise_customer_zip',
        'enterprise_customer_country',
        'enterprise_description',
        'enterprise_documentation_text',
        'created_at',
        'updated_at'
    ];
}
