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
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('title');
            $table->text('message');
            $table->enum('type', ['info', 'warning', 'error', 'success'])->default('info');
            $table->boolean('read')->default(false);
            $table->enum('status', ['pending', 'sent', 'failed'])->default('pending');
            $table->enum('sector', ['general', 'user', 'system', 'customers', 'model', 'tickets', 'payments'])->default('general');

            // Columnas faltantes según la imagen
            $table->enum('severity', ['low', 'medium', 'high', 'critical'])->default('medium');
            $table->string('module')->nullable(); // Módulo que generó la notificación
            $table->string('redirect_url')->nullable(); // URL de redirección
            $table->json('meta')->nullable(); // Metadata adicional
            $table->boolean('seen')->default(false); // Si la notificación fue vista

            // Foreign keys
            $table->foreignId('role_id')
                ->nullable()
                ->constrained('roles')
                ->onDelete('set null')
                ->onUpdate('cascade');
            $table->foreignId('notification_setting_option_id')
                ->nullable()
                ->constrained('notifications_settings_options')
                ->onDelete('set null')
                ->onUpdate('cascade');

            // Índices para mejor rendimiento
            $table->index(['type', 'status']);
            $table->index(['sector', 'severity']);
            $table->index(['module', 'created_at']);
            $table->index('seen');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
