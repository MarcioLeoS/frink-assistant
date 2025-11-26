<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Middleware\CheckPaymentStatus;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('app/analytics/analytics');
    })->withoutMiddleware(CheckPaymentStatus::class)->name('dashboard');

    Route::get('kpi', function () {
        return Inertia::render('app/kpi/kpi');
    })->name('kpi');

    Route::get('trackings', function () {
        return Inertia::render('app/trackings/trackings');
    })->name('trackings');

    Route::get('integrations', function () {
        return Inertia::render('app/integrations/integrations');
    })->name('integrations');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';

//App routes
require __DIR__ . '/app/customers.php';
require __DIR__ . '/app/tickets.php';
require __DIR__ . '/app/reminders.php';
require __DIR__ . '/app/analytics.php';
require __DIR__ . '/app/personRequest.php';
require __DIR__ . '/app/users.php';
require __DIR__ . '/app/bots.php';
require __DIR__ . '/app/settings.php';
require __DIR__ . '/app/plans.php';
require __DIR__ . '/app/billing.php';
require __DIR__ . '/app/alerts.php';
require __DIR__ . '/app/notifications.php';
require __DIR__ . '/app/enterprise.php';
