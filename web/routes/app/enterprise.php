<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\App\EnterpriseConfigController;

Route::middleware(['auth', 'verified'])->prefix('enterprise-config')->group(function () {
    Route::get('/', [EnterpriseConfigController::class, 'getConfiguration']);
    Route::put('/', [EnterpriseConfigController::class, 'updateConfiguration']);
    Route::post('/upload-documentation', [EnterpriseConfigController::class, 'uploadDocumentation']);
});