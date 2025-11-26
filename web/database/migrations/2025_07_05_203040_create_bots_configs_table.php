<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bot_configs', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->softDeletes();
            $table->text('long_prompt')->nullable();
            $table->text('short_prompt')->nullable();
            $table->text('bot_type')->nullable();
            $table->text('bot_name')->nullable();
            $table->text('bot_description')->nullable();
            $table->unsignedBigInteger('user_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bot_configs');
    }
};