<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('enterprise_configs', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->text('enterprise_name')->nullable();
            $table->text('enterprise_description')->nullable();
            $table->string('enterprise_documentation_url')->nullable();
            $table->text('enterprise_documentation_text')->nullable();
            $table->string('enterprise_customer_name')->nullable();
            $table->string('enterprise_customer_email')->nullable();
            $table->string('enterprise_customer_phone')->nullable();
            $table->string('enterprise_customer_address')->nullable();
            $table->string('enterprise_customer_city')->nullable();
            $table->string('enterprise_customer_state')->nullable();
            $table->string('enterprise_customer_zip')->nullable();
            $table->string('enterprise_customer_country')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('enterprise_configs');
    }
};