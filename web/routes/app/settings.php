<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Middleware\CheckPaymentStatus;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('config', function () { return Inertia::render('app/config/config'); })->name('config')->withoutMiddleware(CheckPaymentStatus::class);
});
