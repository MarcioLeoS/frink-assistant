<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('customer_personalizations', function (Blueprint $table) {
            $table->id();
            $table->boolean('enabled')->default(true);
            $table->enum('status', ['active', 'deprecated', 'inactive'])->default('active');
            $table->text('tone')->nullable();
            $table->text('interests')->nullable();
            $table->text('additional_info')->nullable();
            $table->json('expressions')->nullable();
            $table->float('confidence_score')->nullable();
            $table->integer('message_count')->nullable();
            $table->enum('language', ['es', 'en', 'pt'])->default('es');
            $table->foreignId('customer_id')->unique()->constrained('customers')->onDelete('cascade');
            $table->timestamps();
            $table->timestamp('last_used_at')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('customer_personalizations');
    }
};