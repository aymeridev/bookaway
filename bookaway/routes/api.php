<?php

use App\Http\Controllers\PropertyController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::get('/trips', function () {
    return response()->json([
        ['id' => 1, 'destination' => 'Paris - Londres', 'price' => 45],
        ['id' => 2, 'destination' => 'Lyon - Marseille', 'price' => 30],
    ]);
});


Route::apiResource('properties', PropertyController::class);
Route::apiResource('bookings', PropertyController::class);
Route::apiResource('payments', PropertyController::class);
Route::apiResource('users', PropertyController::class);
