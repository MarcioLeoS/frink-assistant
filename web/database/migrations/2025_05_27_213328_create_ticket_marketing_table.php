<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tickets_marketing', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')->constrained('customers')->onDelete('cascade');
            $table->foreignId('chat_context_id')->nullable()->constrained('chat_contexts')->onDelete('set null');
            $table->enum('status', ['open', 'in_progress', 'resolved', 'closed'])->default('open');
            $table->boolean('bot_contacted')->default(false);
            $table->enum('urgency', ['low', 'medium', 'high'])->default('low');
            $table->string('problem_type')->nullable();
            $table->string('problem_description')->nullable();
            $table->string('resolution_description')->nullable();
            $table->unsignedBigInteger('asigned_to')->nullable();
            $table->boolean('escalated')->default(false);
            $table->timestamps();
            $table->timestamp('resolved_at')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tickets');
    }
};
