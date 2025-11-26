<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\App\BotsController;
use App\Http\Controllers\App\EnterpriseConfigController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('bot', function () {
        return Inertia::render('app/bot/bot');
    })->name('bot');

    Route::get('bots', [BotsController::class, 'index'])->name('bots.index');
    Route::post('bots', [BotsController::class, 'store'])->name('bots.store');
    Route::get('bots/{id}', [BotsController::class, 'show'])->name('bots.show');
    Route::match(['put', 'patch'], 'bots/{id}', [BotsController::class, 'update'])->name('bots.update');
    Route::delete('bots/{id}', [BotsController::class, 'delete'])->name('bots.delete');
    Route::delete('bots/{id}/force', [BotsController::class, 'destroy'])->name('bots.destroy');

    Route::post('enterprise-config/files', [EnterpriseConfigController::class, 'uploadDocumentation'])->name('enterprise-config.files');
});
