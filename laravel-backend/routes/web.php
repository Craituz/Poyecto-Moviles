<?php

use Illuminate\Support\Facades\Route;

// Ruta mínima para evitar errores si alguna notificación intenta usar el nombre estándar
Route::get('/password/reset/{token}', function ($token) {
    return "Usa la app móvil para restablecer tu contraseña. Token: " . $token;
})->name('password.reset');
Route::get('/', function () {
    return view('welcome');
});
