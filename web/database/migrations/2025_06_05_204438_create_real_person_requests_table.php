<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('real_person_requests', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->timestamp('viewed_at')->nullable();
            $table->timestamp('taken_at')->nullable();
            $table->timestamp('resolved_at')->nullable();
            $table->unsignedBigInteger('agent_id')->nullable();
            $table->text('observations')->nullable();
            $table->text('response')->nullable();
            $table->text('question')->nullable();
            $table->enum('status', ['pending', 'viewed', 'in_progress', 'resolved'])->nullable();
            $table->foreignId('customer_id')->constrained('customers')->onDelete('cascade');
            $table->foreignId('conversation_id')->nullable()->constrained('conversations')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('follow_ups');
    }
};