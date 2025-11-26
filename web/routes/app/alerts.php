<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\App\AlertsController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('alert', function () {
        return Inertia::render('app/alerts/alerts');
    })->name('alert');

    Route::get('/alerts', [AlertsController::class, 'index'])->name('alerts.index');
});
