<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Billing\MercadoPagoController;

Route::post('/mp/preference', [MercadoPagoController::class, 'createPaymentPreference']);
