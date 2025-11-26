<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\Billing\PlansController;
use App\Http\Controllers\Billing\SubscriptionController;
use App\Http\Middleware\CheckPaymentStatus;

Route::middleware(['auth', 'verified'])->withoutMiddleware(CheckPaymentStatus::class)->group(function () {
    Route::get('plan', function () {
        return Inertia::render('app/config/plans');
    })->name('plan');

    Route::get('plans', [PlansController::class, 'index'])->name('plans.index');
    Route::post('plans', [PlansController::class, 'store'])->name('plans.store');
    // Route::get('plans/{id}', [PlansController::class, 'show'])->name('plans.show');
    // Route::match(['put', 'patch'], 'plans/{id}', [PlansController::class, 'update'])->name('plans.update');
    // Route::delete('plans/{id}', [PlansController::class, 'delete'])->name('plans.delete');
    // Route::delete('plans/{id}/force', [PlansController::class, 'destroy'])->name('plans.destroy');

    //Suscription
    Route::get('plans/subscription', [SubscriptionController::class, 'index']);
    Route::post('plans/{id}/subscribe', [SubscriptionController::class, 'subscribe']);
});
