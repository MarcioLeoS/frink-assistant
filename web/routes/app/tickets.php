<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\App\TicketsController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/tickets', function () {
        return Inertia::render('app/tickets/tickets');
    })->name('tickets');

    Route::get('/tickets/getData', [TicketsController::class, 'getData']);
    Route::post('/tickets/{id}/escalate', [TicketsController::class, 'escalate'])->name('tickets.escalate');
    Route::post('/tickets/{id}/follow-up', [TicketsController::class, 'followUp'])->name('tickets.followUp');
    Route::put('/tickets/{id}/status', [TicketsController::class, 'updateStatus'])->name('tickets.status');
});
