<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reminders', function (Blueprint $table) {
            $table->id();
            $table->text('content');
            $table->text('description')->nullable();
            $table->text('observation')->nullable();
            $table->timestamp('remind_at')->nullable();
            $table->boolean('notified')->default(false);
            $table->string('source')->nullable();
            $table->foreignId('customer_id')->nullable()->constrained('customers')->onDelete('cascade');
            $table->foreignId('follow_up_id')->nullable()->constrained('follow_ups')->onDelete('set null');
            $table->foreignId('reminder_category_id')->nullable()->constrained('reminder_categories')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reminders');
    }
};