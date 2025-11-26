<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Billing\MercadoPagoController;
use App\Http\Controllers\Billing\SubscriptionController;
use App\Http\Middleware\CheckPaymentStatus;

Route::middleware(['auth', 'verified'])->withoutMiddleware(CheckPaymentStatus::class)->group(function () {
    Route::get('mp/payment-preference', [MercadoPagoController::class, 'createPaymentPreference'])
        ->name('mp.payment-preference');

    Route::post('mp/process-payment', [MercadoPagoController::class, 'processPayment'])
        ->name('mp.process-payment');

    // Rutas de retorno desde Mercado Pago
    Route::get('billing/success',  [MercadoPagoController::class, 'success'])->name('billing.success');
    Route::get('billing/failure',  [MercadoPagoController::class, 'failure'])->name('billing.failure');
    Route::get('billing/pending',  [MercadoPagoController::class, 'pending'])->name('billing.pending');
});
