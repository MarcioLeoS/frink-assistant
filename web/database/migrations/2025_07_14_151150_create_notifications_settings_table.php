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
        Schema::create('notifications_settings', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('name');
            $table->boolean('active')->default(true);
            $table->string('description')->nullable();

            // Channel type (email, sms, push, webhook, etc.)
            $table->enum('type', ['email', 'sms', 'push', 'webhook', 'slack', 'discord', 'teams'])->default('email');

            // Email configuration
            $table->boolean('enabled')->default(true);
            $table->string('host')->nullable();
            $table->integer('port')->nullable();
            $table->string('encryption')->nullable(); // tls, ssl, null
            $table->string('username')->nullable();
            $table->string('password')->nullable();
            $table->string('from_address')->nullable();
            $table->string('from_name')->nullable();

            // API configuration (for SMS, Push, Webhook)
            $table->string('api_key')->nullable();
            $table->string('api_url')->nullable();
            $table->string('sender_id')->nullable(); // For SMS

            // JSON configuration for additional settings
            $table->json('config')->nullable();

            // Indexes for better performance
            $table->index('type');
            $table->index('active');
            $table->index('enabled');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications_settings');
    }
};
