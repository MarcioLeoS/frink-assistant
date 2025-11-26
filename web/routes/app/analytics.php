<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\App\AnalyticsController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('analitycs', function () {
        return Inertia::render('app/analytics/analytics');
    })->name('analytics');

    Route::get('analytics/dashboard-metrics', [AnalyticsController::class, 'getDashboardMetrics']);
    Route::get('/analytics/period', [AnalyticsController::class, 'getTicketsByPeriodAnalytics']);
    Route::get('/analytics/avg-resolution-time', [AnalyticsController::class, 'getAvgResolutionTimeAnalytics']);
    Route::get('/analytics/messages', [AnalyticsController::class, 'getMessagesByPeriodAnalytics']);
});
