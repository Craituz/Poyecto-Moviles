<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

// Ruta Login (Pública)
Route::post('/login', [AuthController::class, 'login']);

// Rutas Privadas (Requieren estar logueado)
Route::middleware(['auth:sanctum'])->group(function () {
    
    // Obtener datos del usuario actual
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    
    // Cerrar sesión
    Route::post('/logout', [AuthController::class, 'logout']);
});