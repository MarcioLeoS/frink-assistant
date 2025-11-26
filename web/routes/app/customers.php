<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\App\CustomersController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('customers', function () {
        return Inertia::render('app/customers/customers');
    })->name('customers');

    Route::get('customers/{id}', function ($id) {
        return Inertia::render('app/customers/details', [
            'id' => $id,
        ]);
    })->name('customer.details');

    Route::get('conversations', function () {
        return Inertia::render('app/conversations/conversations');
    })->name('conversations');


    Route::get('/customer/getData', [CustomersController::class, 'getCustomerData']);
    Route::get('/customer/getList', [CustomersController::class, 'getList']);
    Route::get('/customer/getCustomerEspecificData/{id}', [CustomersController::class, 'getCustomerEspecificData']);
    Route::get('/customer/getCustomerEspecificData/timeline/{id}', [CustomersController::class, 'getCustomerTimeline']);
    Route::get('/customer/getCustomerEspecificData/feedBack/{id}', [CustomersController::class, 'fetchCustomerFeedback']);
    Route::get('/conversations/getData', [CustomersController::class, 'getData']);
    Route::get('/conversations/conversation/{id}', [CustomersController::class, 'getConversationEspecificData']);
});
