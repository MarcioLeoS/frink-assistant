<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\App\RealPersonRequestController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('person-request', function () {
        return Inertia::render('app/person-request/person-request');
    })->name('person-request');

    Route::get('person-requests', [RealPersonRequestController::class, 'index'])->name('person-requests.index');
    Route::post('person-requests', [RealPersonRequestController::class, 'store'])->name('person-requests.store');
    Route::get('person-requests/{id}', [RealPersonRequestController::class, 'show'])->name('person-requests.show');
    Route::match(['put', 'patch'], 'person-requests/{id}', [RealPersonRequestController::class, 'update'])->name('person-requests.update');
    Route::post('person-requests/{id}/assign-agent', [RealPersonRequestController::class, 'assignAgent'])->name('person-requests.assign-agent');
    Route::delete('person-requests/{id}', [RealPersonRequestController::class, 'destroy'])->name('person-requests.destroy');
});
