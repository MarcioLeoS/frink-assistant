<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('chat_contexts', function (Blueprint $table) {
            $table->id();
            $table->text('message_content')->nullable();
            $table->dateTime('timestamp');
            $table->string('role', 20);
            $table->foreignId('customer_id')->constrained('customers')->onDelete('cascade');
            $table->foreignId('conversation_id')->nullable()->constrained('conversations')->onDelete('cascade');
            $table->enum('sentiment', ['positive', 'negative', 'marketing', 'duda', 'support', 'unknown'])->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('chat_contexts');
    }
};