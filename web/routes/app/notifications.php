<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\App\AlertsController;
use App\Http\Controllers\Notifications\NotificationController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('notifications', function () {
        return Inertia::render('app/notifications/notifications');
    })->name('notifications');

    // Route::get('/alerts', [AlertsController::class, 'index'])->name('alerts.index');
});

Route::middleware(['auth', 'verified'])->prefix('notifications')->group(function () {
    Route::get('/types', [NotificationController::class, 'getTypes']);
    Route::get('/types/{type}/options', [NotificationController::class, 'getOptionsByType']);
    Route::get('/list', [NotificationController::class, 'getNotifications']);
    Route::post('/create', [NotificationController::class, 'create']);
    Route::patch('/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::patch('/{id}/seen', [NotificationController::class, 'markAsSeen']);
    Route::patch('/mark-all-read', [NotificationController::class, 'markAllAsRead']);

    Route::post('/preference', [NotificationController::class, 'savePreference']);
    Route::post('/channel', [NotificationController::class, 'saveChannel']);
    Route::post('/test-email', [NotificationController::class, 'testEmail']);
    Route::post('/email-config', [NotificationController::class, 'saveEmailConfig']);
});
