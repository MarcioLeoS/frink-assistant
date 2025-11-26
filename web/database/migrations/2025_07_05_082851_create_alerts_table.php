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
        Schema::create('alerts', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('type')->index();
            $table->string('status')->index();
            $table->enum('urgency', ['low', 'medium', 'high'])->default('medium')->index();
            $table->string('provider')->nullable();
            $table->string('name')->nullable();
            $table->text('description')->nullable(); 
            $table->json('data')->nullable();
            $table->string('error_message')->nullable(); 
            $table->integer('error_code')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('alerts');
    }
};
