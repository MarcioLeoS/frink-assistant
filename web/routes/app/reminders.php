<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\App\RemindersController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('reminders', function () { return Inertia::render('app/reminders/reminders'); })->name('reminders');
    Route::get('/reminders/getData', [RemindersController::class, 'getData']);
    Route::post('/reminders/storeData', [RemindersController::class, 'storeData']);


    //Categories
    Route::get('/reminders/categories/getData', [RemindersController::class, 'getCategories']);
    Route::post('/reminders/categories/storeData', [RemindersController::class, 'storeCategory']);

});
