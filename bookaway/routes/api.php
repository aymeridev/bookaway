<?php

use App\Http\Controllers\PropertyController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PropertyImageController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ConversationController;
use Illuminate\Support\Facades\Route;

Route::get('/trips', function () {
    return response()->json([   
        ['id' => 1, 'destination' => 'Paris - Londres', 'price' => 45],
        ['id' => 2, 'destination' => 'Lyon - Marseille', 'price' => 30],
    ]);
});


Route::apiResource('properties', PropertyController::class)->only(['index', 'show']);
Route::apiResource('properties', PropertyController::class)->only(['store', 'update', 'destroy'])->middleware('auth:sanctum');
Route::apiResource('bookings', BookingController::class);
Route::apiResource('payments', PaymentController::class);
Route::apiResource('users', UserController::class);
Route::get('/users/{id}/properties', [UserController::class, 'properties']);


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);


Route::post('/properties/{property}/images', [PropertyImageController::class, 'store'])->middleware("auth:sanctum");
Route::delete('/properties/{property}/images/{image}', [PropertyImageController::class, 'destroy'])->middleware("auth:sanctum");
Route::get('/my-properties', [PropertyController::class, 'userProperties'])->middleware('auth:sanctum');

Route::get('/my-reservations', [BookingController::class, 'myReservations'])->middleware('auth:sanctum');

Route::get('/conversations', [ConversationController::class, 'index'])->middleware('auth:sanctum');
Route::post('/conversations', [ConversationController::class, 'startConversation'])->middleware('auth:sanctum');
Route::post('/conversations/{id}/messages', [ConversationController::class, 'sendMessage'])->middleware('auth:sanctum');
Route::post('/conversations/{id}/read', [ConversationController::class, 'markAsRead'])->middleware('auth:sanctum');
