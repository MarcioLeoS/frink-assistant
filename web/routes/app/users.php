<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\App\UsersController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('users', [UsersController::class, 'index'])->name('users.index');
    Route::post('users', [UsersController::class, 'store'])->name('users.store');
    Route::get('users/{id}', [UsersController::class, 'show'])->name('users.show');
    Route::match(['put', 'patch'], 'users/{id}', [UsersController::class, 'update'])->name('users.update');
    Route::post('users/{id}/assign-agent', [UsersController::class, 'assignAgent'])->name('users.assign-agent');
    Route::delete('users/{id}', [UsersController::class, 'destroy'])->name('users.destroy');

    Route::get('agents', [UsersController::class, 'index'])->name('agents.index');
    Route::post('agents', [UsersController::class, 'store'])->name('agents.store');
    Route::get('agents/{id}', [UsersController::class, 'show'])->name('users.show');
    Route::match(['put', 'patch'], 'agents/{id}', [UsersController::class, 'update'])->name('agents.update');
    Route::post('agents/{id}/assign-agent', [UsersController::class, 'assignAgent'])->name('agents.assign-agent');
    Route::delete('agents/{id}', [UsersController::class, 'destroy'])->name('agents.destroy');
});
