<?php

use App\Http\Controllers\PropertyController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PropertyImageController;
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

Route::get('/trips', function () {
    return response()->json([
        ['id' => 1, 'destination' => 'Paris - Londres', 'price' => 45],
        ['id' => 2, 'destination' => 'Lyon - Marseille', 'price' => 30],
    ]);
});


Route::apiResource('properties', PropertyController::class);
Route::apiResource('bookings', BookingController::class);
Route::apiResource('payments', PaymentController::class);
Route::apiResource('users', UserController::class);

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);


Route::post('/properties/{property}/images', [PropertyImageController::class, 'store'])->middleware("auth:sanctum");
