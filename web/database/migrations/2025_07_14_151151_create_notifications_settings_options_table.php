<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('notifications_settings_options', function (Blueprint $t) {
            $t->id();
            $t->timestamps();
            $t->string('name');
            $t->boolean('active')->default(true);
            $t->string('description')->nullable();
            $t->foreignId('notification_setting_id')  // e.g., email, sms
                ->constrained('notifications_settings')
                ->onDelete('cascade')
                ->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications_settings_options');
    }
};
