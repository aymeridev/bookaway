<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/trips', function () {
    return response()->json([
        ['id' => 1, 'destination' => 'Paris - Londres', 'price' => 45],
        ['id' => 2, 'destination' => 'Lyon - Marseille', 'price' => 30],
    ]);
});